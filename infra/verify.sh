#!/usr/bin/env bash
# Assert that a running day-of stack is actually usable. Run from infra/out/
# after `docker compose up -d --build`:
#
#     cd infra/out && bash ../verify.sh
#
# Every check here exists because the thing it checks was broken on 2026-10-26,
# during the first end-to-end run of this stack, while `docker compose ps`
# showed every container up and `docker compose up` exited clean. "It came up"
# was never evidence that a team could work.
#
# Exit 0 = all checks passed. Exit 1 = at least one FAILED (the stack is not
# ready to hand out). Each failure prints what was measured, not just a verdict.
set -u

PASS=0
FAIL=()
# Caddy publishes 80 on the host by default. A dry run on a laptop that already
# has something on 80 can point this elsewhere: PORT=60080 bash ../verify.sh
PORT="${PORT:-80}"

ok()    { PASS=$((PASS + 1)); printf '  ok    %s\n' "$1"; }
bad()   { FAIL+=("$1"); printf '  FAIL  %s\n' "$1" >&2; }
head_() { printf '\n== %s\n' "$1"; }

# Credentials are looked up out of .env by KEY PREFIX rather than sourced into
# named shell variables, which keeps their variable names out of this file.
cred() { grep -m1 "^$1" .env | cut -d= -f2-; }

if [ ! -f docker-compose.yml ] || [ ! -f .env ]; then
  echo "Run this from infra/out/ (after generate.py), not from the repo root." >&2
  exit 1
fi

ROOT_CRED=$(cred "MYSQL_ROOT_PASS")
TEAMS=$(docker compose config --services | grep -xE 'team[0-9]+' | sort -V)
[ -n "$TEAMS" ] || { echo "No team services found in docker-compose.yml." >&2; exit 1; }
echo "Verifying: $(echo "$TEAMS" | tr '\n' ' ')"

# ---------------------------------------------------------------------------
head_ "containers"
# fix-plugin-perms is a one-shot: it MUST have exited 0. Anything else means a
# team's plugins folder is not group-writable, which this script re-checks
# directly below -- but a non-zero exit is the earlier, louder signal.
# `docker compose config --services` rather than grepping the file: the obvious
# grep for two-space-indented keys also matches the entries under `volumes:`,
# and one of those is literally named `mysql`, so the mysql service was checked
# and counted twice (measured: 24 passes where 23 checks ran).
for svc in $(docker compose config --services | sort); do
  st=$(docker compose ps -a --format '{{.Service}} {{.State}}' | awk -v s="$svc" '$1==s{print $2}')
  if [ "$svc" = "fix-plugin-perms" ]; then
    # A one-shot's exit code is EPHEMERAL evidence: this container was found
    # already reaped between two runs of this script on 2026-10-26 (a container
    # prune), and an absent container cannot distinguish "ran and was cleaned
    # up" from "never ran at all". So absence is a note, not a verdict -- the
    # invariant this service exists to enforce is measured directly, by a real
    # write, in the "can author a plugin" section below. A container that IS
    # present and exited non-zero is still a hard failure.
    rc=$(docker compose ps -a --format '{{.Service}} {{.ExitCode}}' \
         | awk '$1=="fix-plugin-perms"{print $2}')
    if [ -z "$st" ]; then
      printf '  note  fix-plugin-perms container is gone (reaped, or never run);\n'
      printf '        relying on the direct plugin-write check below instead\n'
    elif [ "$st" = "exited" ] && [ "${rc:-1}" = "0" ]; then
      ok "fix-plugin-perms exited 0"
    elif [ "$st" = "running" ]; then
      printf '  note  fix-plugin-perms still running (bounded, up to 90s)\n'
    else
      bad "fix-plugin-perms is '$st' rc=${rc:-?} (docker compose logs fix-plugin-perms)"
    fi
  elif [ "$st" = "running" ]; then
    ok "$svc running"
  else
    bad "$svc is '$st', expected running"
  fi
done

# ---------------------------------------------------------------------------
head_ "databases and team logins"
# `mysql` reporting healthy does NOT mean the init SQL ran. Measured: with
# mysql-init/01-teams.sql at mode 0600 the container was healthy, logged no
# error at all, and created none of the databases. So assert the real objects,
# then actually log in as each team using the value printed on its hand-out
# slip -- the only check that proves the slip itself is correct.
for T in $TEAMS; do
  for db in "$T" "${T}_wp"; do
    if docker compose exec -T mysql mysql -uroot -p"$ROOT_CRED" \
         -N -B -e "use \`$db\`;" >/dev/null 2>&1; then
      ok "database $db exists"
    else
      bad "database $db MISSING (init SQL did not run; check mysql-init file mode)"
    fi
  done
  tc=$(cred "$(echo "$T" | tr '[:lower:]' '[:upper:]')_DB_PASS")
  if [ -n "$tc" ] && docker compose exec -T mysql \
       mysql -u"$T" -p"$tc" -N -B -e "select 1;" >/dev/null 2>&1; then
    ok "$T can log in with the value on its slip"
  else
    bad "$T CANNOT log in with the value in .env/teams.csv"
  fi
done

# ---------------------------------------------------------------------------
head_ "a team can author a WordPress plugin"
# infra/README.md promises "~/wp-plugins/ in VS Code IS the WordPress plugins
# folder". One volume is mounted by two images running as different users
# (coder 1000, www-data 33) and wordpress's entrypoint rewrites owner and mode
# over it last. Measured: a fully green stack where `mkdir` and `touch` in
# ~/wp-plugins both returned EACCES, so a team could edit the four seeded
# plugins but could not create one. Only a real write proves this.
for T in $TEAMS; do
  probe=".verify-$$"
  if docker compose exec -T "$T" sh -c \
       "mkdir /home/coder/wp-plugins/$probe 2>/dev/null \
        && touch /home/coder/wp-plugins/$probe/x.php 2>/dev/null \
        && rm -rf /home/coder/wp-plugins/$probe" >/dev/null 2>&1; then
    ok "$T can create a new plugin folder in ~/wp-plugins"
  else
    mode=$(docker compose exec -T "$T" stat -c '%U:%G %a' /home/coder/wp-plugins 2>/dev/null | tr -d '\r')
    bad "$T CANNOT create a plugin in ~/wp-plugins (dir is $mode)"
  fi
done

# ---------------------------------------------------------------------------
head_ "the four seeded ERI plugins reached WordPress"
for T in $TEAMS; do
  missing=""
  for p in eri-hello eri-job-card eri-job-fit eri-job-post-checker; do
    docker compose exec -T "wp-$T" test -d "/var/www/html/wp-content/plugins/$p" \
      >/dev/null 2>&1 || missing="$missing $p"
  done
  if [ -z "$missing" ]; then ok "wp-$T has all 4 ERI plugins"
  else bad "wp-$T is missing:$missing"; fi
done

# ---------------------------------------------------------------------------
head_ "routing through Caddy (port $PORT)"
# Checks the hostname actually reaches the right upstream, not merely that
# something answers. code-server redirects to /login; WordPress, before setup,
# redirects to /wp-admin/install.php. A 502 means Caddy routed but the upstream
# is down; a 404 means the Caddyfile never matched the host at all.
probe_route() { # <host> <expected substring of the redirect target>
  local host="$1" want="$2" code loc
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 \
           --resolve "$host:$PORT:127.0.0.1" "http://$host:$PORT/" 2>/dev/null)
  loc=$(curl -s -o /dev/null -w '%{redirect_url}' --max-time 20 \
          --resolve "$host:$PORT:127.0.0.1" "http://$host:$PORT/" 2>/dev/null)
  case "$loc" in
    *"$want"*) ok "$host -> $code $want" ;;
    *)         bad "$host -> $code '${loc:-no redirect}' (wanted $want)" ;;
  esac
}
for T in $TEAMS; do
  probe_route "$T.localhost" "/login"
  probe_route "wp-$T.localhost" "/wp-admin/install.php"
done

# ---------------------------------------------------------------------------
head_ "hand-out files are not world-readable"
for f in .env teams.csv; do
  m=$(stat -c '%a' "$f")
  if [ "$m" = "600" ]; then ok "$f is $m"; else bad "$f is $m, expected 600"; fi
done

# ---------------------------------------------------------------------------
printf '\n---------------------------------------------\n'
printf 'passed: %d   failed: %d\n' "$PASS" "${#FAIL[@]}"
if [ ${#FAIL[@]} -gt 0 ]; then
  printf '\nFAILED:\n'; printf '  - %s\n' "${FAIL[@]}"
  printf '\nThe stack is NOT ready to hand out. Do not print the slips yet.\n'
  exit 1
fi
printf '\nStack verified. Safe to hand out infra/out/teams.csv rows.\n'
