# Prompt 03: Day-of operations (Oct 31)

You are on call for the hackathon environment from 8:00 to 5:00. Be calm and quick, and prefer the smallest fix.

**Read first:** `infra/README.md` (runbook), `infra/out/docker-compose.yml`.

**Every 30 minutes:** `docker compose ps` (everything running) and `docker stats --no-stream` (no team pinned at its memory limit). Report one line: OK, or what's wrong.

**Common problems and fixes**
| Symptom | Fix |
| --- | --- |
| A team can't log in | Check the password in `teams.csv`; `docker compose restart teamN` |
| Workspace slow or out of memory | `docker stats`; ask the team to stop extra dev servers; raise that team's limit in compose and `up -d teamN` |
| WordPress "Error establishing a database connection" | `docker compose restart mysql wp-teamN` and check mysql health |
| A team broke its workspace | They download their work first (VS Code: right-click > Download), then `docker compose rm -sf teamN && docker volume rm out_teamN_home && docker compose up -d teamN` **(ask me before deleting a volume)** |
| Host down | Tell teams to use their own laptops (or an optional Codespace) and git; announce it. Codespaces can be very slow to start, so do not promise them |
| `npm install` blocked | Check outbound access; the challenge tests have a no-dependency path (`node --test`, `php tests/smoke.php`) |

**At 2:30:** remind teams that the pull request is due at 3:00, and save each team editor's folder to GitHub at 2:45 (see `START-HERE.md`).

**Guardrails:** never run `docker compose down -v` during the event. Ask before deleting any volume.
