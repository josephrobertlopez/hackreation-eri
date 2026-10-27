#!/usr/bin/env python3
"""
Generate the day-of hosting stack for N teams.

    python3 infra/generate.py --teams 6 --domain hack.example.org
    cd infra/out && docker compose up -d --build

Writes infra/out/: docker-compose.yml, Caddyfile, .env (random passwords), teams.csv (hand-out sheet).
Per team: a browser VS Code workspace + its own WordPress. One shared MySQL (a database per team).
Routes (Caddy, automatic HTTPS when --domain points at the host):
    https://team1.<domain>      -> VS Code for team 1  (preview any dev server at /proxy/<port>/)
    https://wp-team1.<domain>   -> WordPress for team 1. Anything the team puts in ~/wp-plugins/ shows up
                                   in WordPress > Plugins (same volume). The ERI plugins are pre-loaded there.
"""
import argparse, os, secrets, shutil, string

ap = argparse.ArgumentParser()
ap.add_argument("--teams", type=int, default=6)
ap.add_argument("--domain", default="localhost", help="wildcard DNS *.domain -> this host; 'localhost' for a dry run")
ap.add_argument("--email", default="", help="ACME email for TLS certificates")
a = ap.parse_args()

here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, "out")
os.makedirs(out, exist_ok=True)
pw = lambda n=16: "".join(secrets.choice(string.ascii_letters + string.digits) for _ in range(n))

# copy the repo into the build context (excluding heavy/secret stuff)
ctx = os.path.join(out, "workspace")
if os.path.exists(ctx): shutil.rmtree(ctx)
shutil.copytree(os.path.join(here, "workspace"), ctx)
# "_answer_key.md" is correct and always was. shutil.ignore_patterns fnmatches
# the BASENAME, and the judges' key is data/dvr/_answer_key.md -- "dvr" is the
# directory, not part of the name (tools/generate_synthetic_data.py:349,
# .gitignore:9). An earlier edit here widened this to "*answer*key*",
# "*solution*", "*rubric*" on the false reading that the file was called
# dvr_answer_key.md and was therefore leaking into team images. It was not;
# measured, both versions copy zero answer keys. That widening is reverted
# because it was a net risk: these globs drop whole DIRECTORIES, so a future
# docs/solutions/ or a wiki Solution-*.md would silently vanish from all six
# team images and break tools/check.sh at the event if anything linked to it --
# while still missing DVR_Answer_Key.md, since fnmatch here is case-sensitive.
# "*_answer_key.md" rather than the bare name: it still matches the real file
# (fnmatch's * matches zero characters) and also a judges_answer_key.md style
# variant. It matches only NAMES ending "_answer_key.md" -- narrow enough that
# no plausible directory collides, unlike "*answer*key*", which would drop a
# whole docs/solutions/ tree. ignore_patterns matches names, not files, so a
# directory literally named x_answer_key.md would still be dropped; that is a
# narrower guarantee than "cannot swallow a directory", which an earlier
# version of this comment claimed.
_drop = shutil.ignore_patterns("node_modules", ".git", "*.sqlite", "*_answer_key.md", ".env", "dist")


def _ignore(dirpath, names):
    """Exclude the usual heavy/secret things, and infra/out specifically.

    infra/ as a whole used to be excluded. That broke the workspace: the
    repo README links to infra/README.md, so `bash tools/check.sh` -- the
    command the kickoff deck tells attendees to run -- failed on a broken
    link inside every team's environment. Only infra/out/ must be skipped,
    because it is this script's own output and copying it would recurse.
    """
    drop = set(_drop(dirpath, names))
    if os.path.abspath(dirpath) == os.path.abspath(here):
        drop.add("out")
    return drop


shutil.copytree(os.path.join(here, ".."), os.path.join(ctx, "repo"), ignore=_ignore)
# Mounted read-only into the fix-plugin-perms one-shot; see its service block below.
shutil.copy2(os.path.join(here, "fix-plugin-perms.sh"), os.path.join(out, "fix-plugin-perms.sh"))

env = {"MYSQL_ROOT_PASSWORD": pw()}
# The `,z` on the two bind mounts below is load-bearing on an SELinux host
# (Fedora, RHEL, CentOS), and compose.yaml at the repo root already explains
# why at length: an unlabelled bind mount is unreadable inside the container
# and the only symptom is a bare "Permission denied". Added 2026-10-26 after a
# review found both of them missing it, while `:z` WAS applied to two named
# volumes further down, where it decides nothing. Without these two labels the
# morning of the event looks like this: Caddy cannot read its config, so no
# team has routing, AND MySQL cannot read its init SQL, so no team database or
# user is ever created. Both at `docker compose up`, both at once.
svc = ['''services:
  caddy:
    image: caddy:2
    restart: unless-stopped
    ports: ["80:80", "443:443"]
    volumes: ["./Caddyfile:/etc/caddy/Caddyfile:ro,z", "caddy_data:/data"]
  mysql:
    image: mysql:8.4
    restart: unless-stopped
    environment: { MYSQL_ROOT_PASSWORD: "${MYSQL_ROOT_PASSWORD}" }
    volumes: ["mysql:/var/lib/mysql", "./mysql-init:/docker-entrypoint-initdb.d:ro,z"]
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${MYSQL_ROOT_PASSWORD}"]
      interval: 5s
      retries: 30
    deploy: { resources: { limits: { memory: 1g } } }''']
caddy = [("{\n  email %s\n}\n" % a.email) if a.email else ""]
init, sheet, vols = [], ["team,vscode_url,vscode_password,wordpress_url,db_name,db_user,db_password"], ["caddy_data:", "mysql:"]
scheme = "http" if a.domain == "localhost" else "https"
perm_mounts, perm_deps = [], []
for t in range(1, a.teams + 1):
    T = f"team{t}"
    env[f"{T.upper()}_PASSWORD"] = pw(10)
    env[f"{T.upper()}_DB_PASSWORD"] = pw()
    svc.append(f'''  {T}:
    build: ./workspace
    restart: unless-stopped
    environment: {{ PASSWORD: "${{{T.upper()}_PASSWORD}}", DB_HOST: mysql, DB_NAME: {T}, DB_USER: {T}, DB_PASS: "${{{T.upper()}_DB_PASSWORD}}" }}
    volumes: ["{T}_home:/home/coder", "{T}_plugins:/home/coder/wp-plugins:z"]
    deploy: {{ resources: {{ limits: {{ cpus: "1.5", memory: 2g }} }} }}
  wp-{T}:
    image: wordpress:php8.3-apache
    restart: unless-stopped
    environment: {{ WORDPRESS_DB_HOST: mysql, WORDPRESS_DB_NAME: {T}_wp, WORDPRESS_DB_USER: {T}, WORDPRESS_DB_PASSWORD: "${{{T.upper()}_DB_PASSWORD}}", WORDPRESS_DEBUG: 1 }}
    volumes: ["{T}_wp:/var/www/html", "{T}_plugins:/var/www/html/wp-content/plugins:z"]
    depends_on: {{ mysql: {{ condition: service_healthy }} }}
    deploy: {{ resources: {{ limits: {{ memory: 512m }} }} }}''')
    vols += [f"{T}_home:", f"{T}_wp:", f"{T}_plugins:"]
    perm_mounts.append(f'"{T}_plugins:/plugins/{T}:z"')
    perm_deps.append(f"wp-{T}")
    host = "localhost" if a.domain == "localhost" else a.domain
    caddy.append(f"{scheme}://{T}.{host} {{\n  reverse_proxy {T}:8080\n}}\n{scheme}://wp-{T}.{host} {{\n  reverse_proxy wp-{T}:80\n}}\n")
    init.append(f"CREATE DATABASE IF NOT EXISTS {T}; CREATE DATABASE IF NOT EXISTS {T}_wp;\n"
                f"CREATE USER IF NOT EXISTS '{T}'@'%' IDENTIFIED BY '{env[T.upper()+'_DB_PASSWORD']}';\n"
                f"GRANT ALL ON {T}.* TO '{T}'@'%'; GRANT ALL ON {T}_wp.* TO '{T}'@'%';\n")
    sheet.append(f"{T},{scheme}://{T}.{host},{env[T.upper()+'_PASSWORD']},{scheme}://wp-{T}.{host},{T},{T},{env[T.upper()+'_DB_PASSWORD']}")

# Each team<N>_plugins volume is mounted by TWO images that run as different
# users: code-server as coder (uid 1000) and wordpress:php8.3-apache as
# www-data (uid 33). Whichever container mounts it first seeds its ownership,
# and the wordpress entrypoint then rewrites BOTH the owner and the mode over
# wp-content -- and because wp-team<N> waits on MySQL's healthcheck, it is
# always the one that acts last. Measured 2026-10-26, isolated stage by stage:
#   team<N> alone        -> coder:www-data 2775   (what the image sets)
#   wp-team<N> then up   -> www-data:www-data 755 (what wordpress leaves)
# At 755 owned by www-data, a team could still edit the four seeded plugins but
# `mkdir` and `touch` in ~/wp-plugins both returned EACCES -- so they could not
# create a plugin, which is exactly what infra/README.md says that folder is
# for, and `docker compose up` was fully green while it was true.
#
# No image-side fix can win a race it always loses, so the ordering is made
# explicit instead: this one-shot depends on every wp-team<N>, then re-asserts
# group-ownership and mode 2775 (setgid, group-writable) on a bounded loop, and
# exits NON-ZERO if any volume is still not group-writable at the end. That
# makes a silent permissions regression a visibly failed container in
# `docker compose ps` rather than something a team discovers at 10am.
if perm_mounts:
    svc.append('  fix-plugin-perms:\n'
               '    image: alpine:3\n'
               '    restart: "no"\n'
               '    command: ["sh", "/fix-plugin-perms.sh"]\n'
               '    volumes: ["./fix-plugin-perms.sh:/fix-plugin-perms.sh:ro,z", '
               + ", ".join(perm_mounts) + ']\n'
               '    depends_on: [' + ", ".join(perm_deps) + ']')

open(os.path.join(out, "docker-compose.yml"), "w").write("\n".join(svc) + "\nvolumes:\n" + "\n".join("  " + v for v in vols) + "\n")
open(os.path.join(out, "Caddyfile"), "w").write("\n".join(caddy))
os.makedirs(os.path.join(out, "mysql-init"), exist_ok=True)
open(os.path.join(out, "mysql-init", "01-teams.sql"), "w").write("".join(init) + "FLUSH PRIVILEGES;\n")
open(os.path.join(out, ".env"), "w").write("".join(f"{k}={v}\n" for k, v in env.items()))
open(os.path.join(out, "teams.csv"), "w").write("\n".join(sheet) + "\n")

# These two hold every team's credentials and are read only by the operator and
# by `docker compose` running as that same user, so 0600 costs nothing. They
# were 0644 until 2026-10-26 (umask 022) on a host that other people may have
# accounts on, while the README said only "Keep .env private" and nothing
# enforced it.
for _f in (".env", "teams.csv"):
    os.chmod(os.path.join(out, _f), 0o600)

# mysql-init/01-teams.sql deliberately stays world-readable, and this is the
# one place in here where that is the correct call. mysql:8.4's entrypoint
# re-execs as the mysql user (uid 999) before it processes
# docker-entrypoint-initdb.d, so a 0600 file owned by the operator is
# unreadable to it. Measured 2026-10-26: at 0600 the container reported
# **healthy**, logged no permission error of any kind, and created ZERO of the
# four team databases -- a silent fake-green that would have surfaced as six
# WordPress sites failing to connect at 9am. Hence infra/verify.sh, which
# asserts the databases and users actually exist rather than trusting health.
# The proportionate control is the one the README already names: synthetic data
# only, and the host is wiped the same night.
os.chmod(os.path.join(out, "mysql-init", "01-teams.sql"), 0o644)
print(f"Wrote infra/out/ for {a.teams} teams on {a.domain}. Hand out teams.csv rows (one per team). Keep .env private.")
