# Hackreation x ERI

**Building software that connects people with disabilities to job opportunities.**
Sat, Oct 31, 2026, Penrod, Milwaukee, [Mitobyte](https://www.meetup.com/mitobyte/events/316630269/) + [Employment Resources, Inc.](https://eri-wi.org)

> Everything in this repo uses **synthetic data**. No real client information, ever.

**Event day? Start with [START-HERE.md](START-HERE.md).** Joey is the Mitobyte host (name tag: HELP). It says, step by step, how to start in a Codespace or on your own laptop (and the backup team editor if you have no account), what to do if you are not coding, where to get help, and how to hand in your work. Times, place, help and judging: [wiki/event/hackreation.md](wiki/event/hackreation.md).

## Get going in 10 minutes
1. **Read** [wiki/ESSENTIALS.md](wiki/ESSENTIALS.md), the one-page rules and data summary.
2. **Your team picks one project at kickoff; read its PRD first.** These four are ERI's own projects ([ERI's words](docs/eri-problem-statements.md) win if anything here differs; P4 was checked sentence by sentence against ERI's PDF, P1 to P3 were read carefully). Several teams may pick the same one:
   - **P1** [Show Your Skills](wiki/prds/p1-show-your-skills.md): Accessible digital skills portfolio ([hello world](challenges/p1-show-your-skills))
   - **P2** [My Workday Assistant](wiki/prds/p2-my-workday-assistant.md): Accessible workplace task and routine support tool ([hello world](challenges/p2-my-workday-assistant))
   - **P3** [Job Coach Connection](wiki/prds/p3-job-coach-connection.md): Accessible employee and job coach communication tool ([hello world](challenges/p3-job-coach-connection))
   - **P4** [Employer Opportunity & Support Hub](wiki/prds/p4-employer-hub.md): Employer decision-support and workplace accessibility tool ([hello world](challenges/p4-employer-hub))
3. **Start from your challenge's hello world.** It already runs and has tests. P1 to P4 need no install, only Node 20 or newer (and Python 3 for `npm start`, which runs `python3 -m http.server`): on the day do the fork steps in [START-HERE.md](START-HERE.md) first, so your work can be sent; then `cd challenges/p<n>-...` and `npm start` (a web page) and `npm test`. Ports and preview addresses: [START-HERE.md](START-HERE.md#ports-and-preview-addresses). The recommended stack is plain HTML, CSS and JavaScript that could be pasted into WordPress ([details](wiki/company/tech-stack.md)). The starters below are not recommended at the event: the rubric favours plain HTML, CSS and JavaScript, and several need Docker, PHP or an outside account. Use one only if you must, and copy files into your challenge folder, because CI fails a diff that touches anything outside it:

| Starter | Stack | Hello world | Works in the backup team editor? | Works in the default (slim) Codespace? |
| --- | --- | --- | --- | --- |
| [`starters/static-web`](starters/static-web) | HTML/CSS/jQuery | `python3 -m http.server` | Yes | Yes |
| [`starters/php-mysql`](starters/php-mysql) | PHP 8 + MySQL (or SQLite) + phpMyAdmin | `php seed.php && php -S localhost:8080 -t public` | Yes, with SQLite | No (no PHP): use the full configuration |
| [`starters/wordpress-plugin`](starters/wordpress-plugin) | WordPress plugin: shortcode + REST + admin | `docker compose up` or `npx @wordpress/env start` | No (needs Docker); `php tests/smoke.php` only | No: use the full configuration |
| [`starters/eri-job-card`](starters/eri-job-card) | WordPress Gutenberg block | `npm install && npm run build` | No; its build is already committed | Untested; its build is already committed |
| [`starters/expo-supabase`](starters/expo-supabase) | React Native/Expo + Supabase (iOS, Android, web) | `npm install && npx expo start` | Untested; assume no | Untested; assume no |
| [`starters/ai-helpers`](starters/ai-helpers) | Prompts + PHP client for Claude/OpenAI | `php starters/ai-helpers/php/hello_llm.php` | Yes, in mock mode | The PHP client: no (full configuration) |

4. **Build in your challenge folder.** That's where CI runs. Work on a branch in your team fork (names: [START-HERE.md](START-HERE.md#branch-names); backup editor teams: Joey saves your folder). The folders `challenges/01-...` to `03-...` are retired; ignore them. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Day-of
- **Schedule, challenges and judging:** [wiki/event/hackreation.md](wiki/event/hackreation.md)
- **Where to work:** a GitHub Codespace (`.devcontainer/`, free account; the default is a slim Node + Python image, start time in the [event page](wiki/event/hackreation.md#paths-how-you-get-a-workspace); not ready after 10 minutes, delete it) or your own laptop (git, Node 20 or newer, and Python 3). Backup only: each team has a shared VS Code in the browser (team password, no account) for no account, a laptop that cannot run Node, or a Codespace not ready in 10 minutes. Paths and addresses are on the event page. Which door to use: [START-HERE.md](START-HERE.md#which-door). Using a screen reader? Start on your laptop. The backup hosting design is in [infra/README.md](infra/README.md).
- **Kickoff slides:** [deck/attendee-kickoff.md](deck/attendee-kickoff.md). The `.md` file is the plain-text version and the only committed copy; PDF, HTML and PowerPoint renders are optional and not stored here (see [deck/README.md](deck/README.md) for the command).
- **Stack how-tos for people and AI:** [wiki/stack/](wiki/stack/README.md) covers WordPress plugins and blocks, PHP/MySQL, JS/jQuery, HTML/CSS accessibility, Expo, Supabase, Docker and AI-assisted coding

## Knowledge base and simulated users
- [`wiki/knowledge/`](wiki/knowledge/README.md): 60+ sourced pages on benefits, employment law, compliance, the Wisconsin service landscape, public datasets, and ERI's finances and strategy
- [`wiki/personas/`](wiki/personas/README.md) and [`agents/`](agents/README.md): composite personas and role-play profiles for quick usability checks
- Public data: `bash tools/fetch_public_data.sh` on your own machine (O*NET, BLS wages, MCTS + Madison Metro GTFS, Census)

## Deploying it
Copy-paste agent prompts in [prompts/](prompts/README.md): publish to GitHub, deploy the hosting, day-of ops, post-event triage, install on ERI's WordPress, and a yearly number refresh.

## Using AI coding tools?
Point them at [`AGENTS.md`](AGENTS.md) (or `CLAUDE.md` / [`llms.txt`](llms.txt)). Everything they need is in [`wiki/`](wiki/README.md).

## Repo map
```
wiki/        company info, domain rules, PRDs, personas, knowledge base (the "LLM wiki")
agents/      role-play profiles (also in .claude/agents/)
data/        synthetic CSVs: job seekers, job postings, DVR billing
challenges/  p1 to p4: one working hello world per ERI project (start here). 01 to 03 are retired
starters/    hello worlds for each recommended stack
tools/       data generator, smoke tests, public-data fetch
infra/       backup hosting: per-team browser VS Code (Docker Compose)
deck/        attendee kickoff slides (Marp)
```

Run every smoke test: `bash tools/check.sh`. It exits **0** when everything ran and passed, **2** when something was skipped for a missing tool (a fresh clone or a fresh Codespace has no `node_modules` in some folders, so some BDD and accessibility steps can skip; that is not a failure), and **1** on a real failure. A team's pull request runs three checks, informational at the event and required for an after-event merge: **Conformance (changed projects)**, **Attempt declaration (backlog IDs)** and **Repo guardrails** (see [CONTRIBUTING.md](CONTRIBUTING.md), section 7). The `challenge-01` to `challenge-03` workflows in `.github/workflows/` belong to the retired folders and run only when a file in those folders changes.

**Work like a real team:** [CONTRIBUTING.md](CONTRIBUTING.md) covers issues tied to acceptance criteria, branches, Conventional Commits, TDD/BDD, PRs with review, the Definition of Done and ADRs ([docs/adr/](docs/adr/)).

MIT licensed. Built by Mitobyte volunteers for ERI. Not an official ERI product: ERI reviews projects and decides what, if anything, to adopt.
