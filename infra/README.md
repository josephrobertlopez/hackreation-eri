# Day-of hosting: nothing to install

**Goal:** an attendee opens a URL, types a team password, and is coding in VS Code in the browser within 2 minutes. They get PHP 8, Node 22, the monorepo and their own WordPress. No laptop setup.

## Why this design (and not something fancier)
| Option | Verdict | Why |
| --- | --- | --- |
| **One host, Docker Compose, one container per team** (this folder) | **Chosen** | One machine, one command, easy to reason about and tear down the same night. code-server is single-user, so one per team is the documented pattern |
| GitHub Codespaces (`.devcontainer/`) | **Fallback** | Zero infra, but needs a GitHub account per person; free tier is about 60 hours a month on 2 cores. Good backup if the host dies |
| Kubernetes / per-person containers | Cut | Overkill for about 18 people for 6 hours |
| Everyone installs locally | Cut as default | Install problems eat the first hour. Still works: every starter runs locally |

## What each team gets
| URL | What |
| --- | --- |
| `https://teamN.<domain>` | VS Code in the browser (password per team). Preview any dev server at `/proxy/<port>/`, e.g. `php -S 0.0.0.0:8000 -t public` → `https://teamN.<domain>/proxy/8000/` |
| `https://wp-teamN.<domain>` | The team's own WordPress. `~/wp-plugins/` in VS Code **is** the WordPress plugins folder; the 4 ERI plugins are pre-loaded |
| MySQL | `DB_HOST=mysql`, a database per team (in env vars in the terminal) |

## Run it (organizer, about 20 minutes)
```bash
# on the host (Linux, Docker + Compose v2), with wildcard DNS *.<domain> -> host IP, ports 80/443 open
git clone <repo> && cd hackreation-eri
python3 infra/generate.py --teams 6 --domain hack.example.org --email you@example.org
cd infra/out && docker compose up -d --build
# hand each team its row from infra/out/teams.csv (URL + password). Keep .env private.
```
Dry run on a laptop: `python3 infra/generate.py --teams 2 --domain localhost`, then open `http://team1.localhost`.

**Validated here:** the generator runs and `docker compose config` passes. **Not yet run end to end** (this sandbox can't pull images), so do a full dry run on the host at least 2 days before.

## Sizing (6 teams)
| Piece | Each | Total |
| --- | --- | --- |
| Workspace (code-server + PHP + Node) | ≤ 1.5 CPU, 2 GB | 9 CPU, 12 GB (burst; typical use is far lower) |
| WordPress | 512 MB | 3 GB |
| MySQL (shared) + Caddy | 1 GB | 1.2 GB |
| **Recommended host** | | **8 vCPU, 16 GB RAM, 40 GB disk** |

## Questions for Jacob (the infra owner)
1. What is it: a VM, bare metal, or Kubernetes? Docker + Compose v2 available?
2. Can we get a domain or subdomain with **wildcard DNS** (`*.hack.<domain>`) and open 80/443? (If not: one hostname with path routing. Ask me to switch the Caddyfile.)
3. CPU/RAM available on the day (see sizing)? Any egress limits? npm and Packagist are needed.
4. Who is on call during 9:00-4:00 if it falls over?
5. OK to wipe everything that evening?

## Runbook
- **T-7 days:** confirm the answers above. `CODE_SERVER_VERSION` is already pinned to
  `4.143.1` in `workspace/Dockerfile`; only change it if the dry run then re-passes.
- **T-2 days:** full dry run with 2 teams. Open VS Code, run `bash tools/check.sh` (expect exit **2** on a team image: no `node_modules`, so both BDD suites skip. Exit 1 is a real failure), activate a plugin in WordPress, and **check spoken instructions actually speak on the image** -- if the voice list is empty, no team can rely on audio and P2 needs pre-recorded files instead.
- **T-1 day:** `generate.py --teams <N+1>` (one spare), `up -d --build`, print the `teams.csv` slips.
- **Day of:** hand out slips at team formation; watch `docker stats`; the Codespaces fallback is in `.devcontainer/`.
- **Same night:** teams push to GitHub (or download a zip from VS Code); then `docker compose down -v` to delete everything.

## Security (one-day event)
- **Synthetic data only.** Nothing real ever goes on this host. That's the main control.
- HTTPS via Caddy (automatic certificates); a random password per team; MySQL not exposed outside the Docker network; no phpMyAdmin on the public internet.
- Containers have CPU and memory limits; no Docker socket is mounted into workspaces.
- Teams may install npm packages in their workspace; that's fine for a sandbox that gets deleted the same night.
- **Teardown is a requirement, not a nice-to-have:** `docker compose down -v` deletes all volumes.

## Known (verify) items
- `codercom/code-server` entrypoint path (`/usr/bin/entrypoint.sh`) and flags in `workspace/start.sh`.
- Named volumes copy the image's `/home/coder` content on first mount (standard Docker behavior; confirm in the dry run that the repo appears).
- `deploy.resources.limits` is honored by `docker compose up` on the host's Compose version.
