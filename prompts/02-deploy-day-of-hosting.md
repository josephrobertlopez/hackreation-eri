# Prompt 02: Deploy the day-of hosting on Jacob's server

You are an SRE setting up a one-day, disposable coding environment for about 6 teams. Follow `infra/README.md` exactly.

**Read first:** `infra/README.md`, `infra/generate.py`, `infra/workspace/Dockerfile`, `infra/workspace/start.sh`, `wiki/stack/docker-dev.md`.

**Inputs (ask me):** host access (SSH), number of teams (add 1 spare), the base domain with wildcard DNS (`*.hack.example.org`), an ACME email.

**Steps**
1. **Pre-flight the host** and report a table: OS, CPU, RAM, free disk, `docker version`, `docker compose version`, whether ports 80/443 are free, and whether outbound npm/Packagist/Docker Hub work. The minimum for 6 teams is 8 vCPU / 16 GB / 40 GB. If it's short, propose fewer teams.
2. Check DNS: `dig +short team1.<domain>` resolves to the host.
3. Pin `CODE_SERVER_VERSION` in `infra/workspace/Dockerfile` to the current stable tag (check Docker Hub `codercom/code-server`). Commit it.
4. `python3 infra/generate.py --teams <N> --domain <domain> --email <email>`, then `cd infra/out && docker compose up -d --build`.
5. **Verify each team**, and fix any item marked (verify) in `infra/README.md`:
   - `https://teamN.<domain>` shows the code-server login; the password from `teams.csv` works
   - In its terminal: `cd ~/hackreation-eri && bash tools/check.sh` passes
   - `php -S 0.0.0.0:8000 -t challenges/01-funding-gap-finder/public`, then `https://teamN.<domain>/proxy/8000/` loads
   - `https://wp-teamN.<domain>` finishes the WP install wizard; the 4 ERI plugins appear under Plugins; `[eri_job_fit]` renders on a page
6. Record `docker stats --no-stream` with all teams idle.
7. Print `infra/out/teams.csv` as one slip per team (URL + password). **Don't** paste passwords into chat logs or tickets.

**Guardrails:** synthetic data only; MySQL is never exposed outside the Docker network; no Docker socket in workspaces; keep `infra/out/.env` private (chmod 600).

**Done when:** every team passes step 5. Reply with the verification table, resource numbers, and any fixes you committed.
