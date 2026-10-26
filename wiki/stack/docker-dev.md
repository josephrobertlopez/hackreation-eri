---
title: Docker and dev environments for the event
summary: Docker Compose for this repo's WordPress + MySQL + phpMyAdmin and PHP app, with healthchecks, volumes, .env and resource limits. Also covers a hosted code-server-per-team setup behind a reverse proxy, the Dev Container / Codespaces alternative, and teardown and security for a one-day event.
tags: [stack, docker, compose, code-server, devcontainers, codespaces, security, event-ops]
last_verified: 2026-10-23
next_review: 2027-04-23
review_owner: Hackathon technical lead (Mitobyte) with ERI web team lead
confidence: medium
sources:
  - title: Docker docs, Control startup and shutdown order in Compose
    url: https://docs.docker.com/compose/how-tos/startup-order/
    accessed: 2026-10-23
  - title: Docker docs, Compose services reference
    url: https://docs.docker.com/reference/compose-file/services/
    accessed: 2026-10-23
  - title: Docker docs, Compose Deploy Specification (resources)
    url: https://docs.docker.com/reference/compose-file/deploy/
    accessed: 2026-10-23
  - title: Docker docs, Variable interpolation and .env
    url: https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/
    accessed: 2026-10-23
  - title: Docker docs, Volumes
    url: https://docs.docker.com/engine/storage/volumes/
    accessed: 2026-10-23
  - title: Docker docs, docker compose down
    url: https://docs.docker.com/reference/cli/docker/compose/down/
    accessed: 2026-10-23
  - title: code-server, Install (Docker)
    url: https://coder.com/docs/code-server/install
    accessed: 2026-10-23
  - title: code-server, FAQ
    url: https://coder.com/docs/code-server/FAQ
    accessed: 2026-10-23
  - title: code-server, Setup and configuration guide (exposing safely)
    url: https://coder.com/docs/code-server/guide
    accessed: 2026-10-23
  - title: Dev Container metadata reference (containers.dev)
    url: https://containers.dev/implementors/json_reference/
    accessed: 2026-10-23
  - title: GitHub Docs, Introduction to dev containers
    url: https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers
    accessed: 2026-10-23
  - title: GitHub Docs, How use of GitHub Codespaces is measured
    url: https://docs.github.com/en/billing/concepts/product-billing/github-codespaces
    accessed: 2026-10-23
  - title: GitHub Docs, Troubleshooting included usage
    url: https://docs.github.com/en/codespaces/troubleshooting/troubleshooting-included-usage
    accessed: 2026-10-23
---

# Docker and dev environments for the event

## TL;DR
- Docker is **optional**. Every starter has a no-Docker path: `php -S` with SQLite, `python3 -m http.server`, `npx expo start`. Use Docker when you need real MySQL or WordPress.
- Replace `sleep 15` and plain `depends_on` with a **healthcheck + `condition: service_healthy`**. Bind ports to **`127.0.0.1`**, keep passwords in a git-ignored **`.env`**, and `docker compose down -v` at the end.
- **Hosted option:** one **code-server container per team** (code-server doesn't do multi-user in one instance), each with its own password, behind Caddy with HTTPS. **Never** mount the Docker socket into a team container.
- **Codespaces:** personal GitHub Free accounts include **120 core hours and 15 GB-month a month** (Pro: 180 and 20). That's about **60 hours on a 2-core machine**. Organization plans have **no** free quota. The default idle timeout is 30 minutes, and retention is 30 days.

## Minimal working example
`starters/wordpress-plugin/docker-compose.yml`, hardened for the day:

```yaml
# compose.yaml - WordPress + MySQL + phpMyAdmin. Passwords come from .env (git-ignored).
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: wp
      MYSQL_USER: wp
      MYSQL_PASSWORD: ${WP_DB_PASSWORD:?set WP_DB_PASSWORD in .env}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:?set MYSQL_ROOT_PASSWORD in .env}
    volumes: ["db_data:/var/lib/mysql"]
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h 127.0.0.1 -uroot -p$$MYSQL_ROOT_PASSWORD --silent"]  # (verify)
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s
    deploy: { resources: { limits: { cpus: "1", memory: 1g } } }
  wordpress:
    image: wordpress:6-php8.2-apache
    ports: ["127.0.0.1:8000:80"]             # localhost only, not the venue Wi-Fi
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wp
      WORDPRESS_DB_PASSWORD: ${WP_DB_PASSWORD}
      WORDPRESS_DB_NAME: wp
      WORDPRESS_DEBUG: 1
    volumes:
      - ./eri-hello:/var/www/html/wp-content/plugins/eri-hello   # bind mount: edit live
    depends_on:
      db: { condition: service_healthy, restart: true }
    deploy: { resources: { limits: { cpus: "1", memory: 512m } } }
  phpmyadmin:
    image: phpmyadmin:5
    ports: ["127.0.0.1:8081:80"]
    environment: { PMA_HOST: db, PMA_USER: wp, PMA_PASSWORD: "${WP_DB_PASSWORD}" }
    depends_on:
      db: { condition: service_healthy }
volumes:
  db_data:
```

```bash
# .env next to compose.yaml (git-ignored; commit .env.example):
#   WP_DB_PASSWORD=change-me-synthetic-only
#   MYSQL_ROOT_PASSWORD=change-me-too
docker compose config            # shows resolved values; fails early if a ${VAR:?} is missing
docker compose up -d && docker compose ps   # db should show "healthy"
docker stats --no-stream         # confirm limits are applied (verify for your Compose version)
docker compose down -v           # remove containers, network AND the db_data volume
```

For `starters/php-mysql`, apply the same changes: a `db` healthcheck, `depends_on: { db: { condition: service_healthy } }`, and remove `sleep 15` from the app's `command`. Note that its compose file also publishes MySQL on `3306` to all interfaces. Bind it to `127.0.0.1:3306:3306`, or drop the port.

### Compose notes
- **Volumes:** named volumes (`db_data`) persist data and are managed by Docker. Bind mounts (`./eri-hello:…`) share files with your editor. Mount data you only read as `:ro`, as the php-mysql starter does with `../../data:/data:ro`.
- **`.env`:** used for `${VAR}` interpolation in the Compose file. A value reaches a container only when you reference it under `environment`. Shell variables beat `--env-file`, which beats `.env`.
- **`down` keeps named volumes** unless you pass `-v`. That's handy mid-day and a leak at the end.

## Hosted shared environment: code-server per team
Use this only if laptops can't run the stack. One VM, one container per team, and only the proxy exposed:

```yaml
# ops/compose.yaml on the event VM (organizers only)
services:
  caddy:
    image: caddy:2
    ports: ["80:80", "443:443"]
    volumes: ["./Caddyfile:/etc/caddy/Caddyfile:ro", "caddy_data:/data"]
  team-a:
    image: codercom/code-server:latest      # pin the exact version you tested
    environment:
      HASHED_PASSWORD: ${TEAM_A_HASHED_PASSWORD:?}   # in compose, escape $ as $$ inside literal hashes
    volumes: ["team_a_home:/home/coder"]
    deploy: { resources: { limits: { cpus: "2", memory: 3g, pids: 512 } } }
    # NO ports: (reached only through caddy). NO /var/run/docker.sock mount.
  # team-b: ...copy for each team
volumes: { caddy_data: {}, team_a_home: {} }
```
```
# Caddyfile - automatic HTTPS (Let's Encrypt) once DNS points at the VM
team-a.code.example.org {
  reverse_proxy team-a:8080
}
```
- code-server listens on `127.0.0.1:8080` by default. The official Docker image serves on `0.0.0.0:8080` inside the container (verify), which is what lets Caddy reach `team-a:8080` over the Compose network.
- Docs: "Never expose code-server directly to the internet without some form of authentication and encryption". Logins are rate-limited (2 a minute plus 12 an hour). Keep `auth: password`, never `--auth none`.
- Extensions come from **Open VSX**, not Microsoft's marketplace. Some AI extensions may not be available (verify each one before the day).
- Previews: code-server can proxy app ports at `/proxy/<port>/`. WordPress hard-codes its site URL, so it breaks behind a sub-path. For hosted teams, prefer the static, PHP-with-SQLite and Expo-web starters.
- Without the Docker socket, teams can't run `docker compose` in a hosted container. That's the point: the socket gives root on the host.

## Dev Container / Codespaces alternative
Codespaces' default image already includes Node, PHP and Python, so most teams need **no config**. If you want forwarded ports labeled:
```json
// .devcontainer/devcontainer.json
{
  "name": "hackreation-eri",
  "image": "mcr.microsoft.com/devcontainers/universal:2",
  "forwardPorts": [8000, 8080, 8081],
  "portsAttributes": { "8000": { "label": "web" }, "8081": { "label": "phpMyAdmin" } },
  "postCreateCommand": "node --version && php --version",
  "hostRequirements": { "cpus": 2 }
}
```
(The universal image name and tag are a (verify) item. They aren't on the pages opened.) Each member forks the repo into a **personal** account, so the 120 free core hours apply. Stop the codespace at lunch and delete it after the event.

## Do / Don't checklist
- [ ] **Do** pin image tags you've tested (`mysql:8.0`, `wordpress:6-php8.2-apache`, `phpmyadmin:5`). Avoid `latest` on event day.
- [ ] **Do** pre-pull images on venue machines the night before (`docker compose pull`). Venue Wi-Fi is slow.
- [ ] **Don't** publish MySQL or phpMyAdmin on `0.0.0.0` on a shared network.
- [ ] **Don't** put real data in any volume. `data/` is synthetic, and that's all that goes in.

## Security (one-day event)
- **Before:** create one random password per team container and hand it out on paper or in a DM, not in a shared channel. Use a dedicated VM in a throwaway cloud project. Open only ports 22 (keys only), 80 and 443.
- **During:** set resource limits per team so one runaway build can't starve others. Don't keep shell history with keys in it, and don't paste API keys into shared terminals.
- **After (same evening):** `docker compose down -v` on the VM, then destroy the VM. Revoke any event LLM keys. Delete Codespaces. Pause or delete Supabase projects. Have teams rotate any personal keys they used.

## Accessibility
- code-server and VS Code have screen-reader modes, but test with the team's own setup first. Some participants will be faster on their own laptop with their own assistive tech. Always offer the laptop path.

## Common AI-assistant mistakes to watch for
- Writing a `version: "3.8"` key on top (verify that it's obsolete in Compose v2; it's harmless but noise) and old `docker-compose` (v1, hyphenated) commands. Use `docker compose`.
- `depends_on: [db]` presented as "waits for MySQL". It only waits for the container to start, not to be ready.
- `privileged: true` or `-v /var/run/docker.sock:/var/run/docker.sock` "so Docker works inside code-server".
- Hard-coding `MYSQL_ROOT_PASSWORD=root` in a file that is going to a shared VM.
- Inventing Codespaces quotas ("60 free hours"). The quota is 120 **core** hours, which comes to 60 hours only on a 2-core machine.

## How to hand off to ERI
- ERI's hosting runs PHP + MySQL and WordPress, not Docker. Hand off the **plugin folder or PHP app**, with Docker as an optional local way to run it.
- README: one `docker compose up` line, the `.env.example` values to set, the ports, and how to reset (`down -v`).
- Delete event-only infrastructure, such as `ops/` and code-server configs, from what you hand over.

## Sources
- [Compose startup order](https://docs.docker.com/compose/how-tos/startup-order/) · [Compose services](https://docs.docker.com/reference/compose-file/services/) · [Deploy/resources](https://docs.docker.com/reference/compose-file/deploy/)
- [Interpolation and .env](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/) · [Volumes](https://docs.docker.com/engine/storage/volumes/) · [compose down](https://docs.docker.com/reference/cli/docker/compose/down/)
- [code-server install](https://coder.com/docs/code-server/install) · [FAQ](https://coder.com/docs/code-server/FAQ) · [Guide](https://coder.com/docs/code-server/guide)
- [Dev Container reference](https://containers.dev/implementors/json_reference/) · [GitHub: intro to dev containers](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers)
- [Codespaces usage and quotas](https://docs.github.com/en/billing/concepts/product-billing/github-codespaces) · [Troubleshooting included usage](https://docs.github.com/en/codespaces/troubleshooting/troubleshooting-included-usage)
