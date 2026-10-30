> **Status for Saturday Oct 31:** the five hosted VS Code editors at `https://hack-teamN.taild76c1b.ts.net` (one shared session per team, team password, no account) are the BACKUP only (no account, a laptop that cannot run Node, or a Codespace not ready in 10 minutes). The primary paths are GitHub Codespaces (`.devcontainer/`) and your own laptop ([START-HERE.md](../START-HERE.md), [event page](../wiki/event/hackreation.md)). This design is the earlier plan. It is kept as history and as the source of the workspace images. The per-team deploy box described here is **optional**, and nothing else depends on it.

# Day-of hosting: nothing to install

> **History banner.** The numbers and names below come from the earlier plan and are out of date: it says about 18 people, 6 teams,
> `teamN.<domain>` addresses and a WordPress per team. Saturday is about 31 people, 5 teams and `hack-teamN.taild76c1b.ts.net`
> with no per-team WordPress. For event facts see the [event page](../wiki/event/hackreation.md); this page only describes how the images are built.

**Goal:** an attendee opens a URL, types a team password, and is coding in VS Code in the browser within 2 minutes. They get PHP 8, Node 22, the monorepo and their own WordPress. No laptop setup.

## Why this design (and not something fancier)
| Option | Verdict | Why |
| --- | --- | --- |
| **One host, Docker Compose, one container per team** (this folder) | **Chosen** | One machine, one command, easy to reason about and tear down the same night. code-server is single-user, so one per team is the documented pattern |
| GitHub Codespaces (`.devcontainer/`) | **Primary for Saturday** | Zero infra, but needs a GitHub account per person; start times are on the [event page](../wiki/event/hackreation.md#paths-how-you-get-a-workspace) (single source). The hosted editors below are the backup when it does not come up |
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

**Validated here (2026-10-26, first real end-to-end run):** 2 teams on Fedora with SELinux enforcing, Docker 29.8.2 / Compose 5.6.0. All 7 containers up from the single documented command; `bash ../verify.sh` **23/23, exit 0**; `bash tools/check.sh` inside a team image **14 passed, 0 failed, 2 skipped, exit 2** exactly as the T-2 step below predicts. Four defects were found and fixed in the process — three of them while `docker compose ps` showed everything up (see the comments in `generate.py` and `workspace/Dockerfile`).

**Still unproven, so do a dry run on the real host anyway:** TLS (this run used `--domain localhost`, so no ACME certificate was ever issued), the `/proxy/<port>/` preview serving real content (it routes and is auth-gated, but nothing logged in), the spoken-instructions voice list, and anything about the host's own CPU/RAM/egress. Host port 443 was already taken on this box, so Caddy ran on an alternate port via a throwaway `docker-compose.override.yml`; **check 80 and 443 are free on the real host first** — Docker binds the wildcard address and fails if anything holds that port, even on one interface.

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
4. Who is on call during 8:00-5:00 if it falls over?
5. OK to wipe everything that evening?

## Runbook
- **T-7 days:** confirm the answers above. `CODE_SERVER_VERSION` is already pinned to
  `4.143.1` in `workspace/Dockerfile`; only change it if the dry run then re-passes.
- **T-2 days:** full dry run with 2 teams. **First: `cd infra/out && bash ../verify.sh`** — 23 checks that a team can actually work, and it must exit 0 before anything else is trusted. It exists because on 2026-10-26 a stack where `docker compose ps` showed all 7 containers up had no team databases at all in one configuration, and in another a team could not create a WordPress plugin; both were invisible to `up` and to `ps`. Then open VS Code, run `bash tools/check.sh` (expect exit **2** on a team image: no `node_modules`, so both BDD suites skip. Exit 1 is a real failure), activate a plugin in WordPress, and **check spoken instructions actually speak on the image** -- if the voice list is empty, no team can rely on audio and P2 needs pre-recorded files instead.
- **T-1 day:** **`docker compose down -v` FIRST**, then `generate.py --teams <N+1>`
  (one spare), then `up -d --build`, then print the `teams.csv` slips.
  The `down -v` is not optional and this step used to omit it. `generate.py`
  mints fresh credentials on every run, but `mysql:8.4` executes
  `docker-entrypoint-initdb.d` **only against an empty data volume** — so
  regenerating after the T-2 dry run leaves `.env` and the printed slips holding
  values MySQL has never seen, and `CREATE USER IF NOT EXISTS` would not update
  an existing user anyway. The symptom is every WordPress showing "Error
  establishing a database connection" at 9am, with the slips already handed out.
  If you must keep the T-2 data, reuse the existing `.env` instead of regenerating.
- **Day of:** hand out slips at team formation; watch `docker stats`; Codespaces (`.devcontainer/`) and own laptops are the primary paths and carry the day if the host dies.
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
