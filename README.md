# Hackreation x ERI

**Building software that connects people with disabilities to job opportunities.**
Sat, Oct 31, 2026, Penrod, Milwaukee, [Mitobyte](https://www.meetup.com/mitobyte/events/316630269/) + [Employment Resources, Inc.](https://eri-wi.org)

> Everything in this repo uses **synthetic data**. No real client information, ever.

## Get going in 10 minutes
1. **Read** [wiki/ESSENTIALS.md](wiki/ESSENTIALS.md), the one-page rules and data summary.
2. **Pick a challenge** and read its PRD:
   - **01** [Funding gap finder](wiki/prds/01-funding-gap-finder.md): DVR, Ticket and county billing gaps ([hello world](challenges/01-funding-gap-finder))
   - **02** [Is this job right for me?](wiki/prds/02-job-fit-checker.md): a job seeker tool for ERI's website ([hello world](challenges/02-job-fit-checker))
   - **03** [Inclusive job post checker](wiki/prds/03-job-post-checker.md): an employer tool for ERI's website ([hello world](challenges/03-job-post-checker))
   - Why only three: the [cut list](wiki/prds/cut-list.md)
3. **Start from your challenge's hello world.** It already runs and has tests (`npm test` or `composer test`). The starters below are optional, for a different stack ([recommended stack](wiki/company/tech-stack.md)):

| Starter | Stack | Hello world |
| --- | --- | --- |
| [`starters/static-web`](starters/static-web) | HTML/CSS/jQuery | `python3 -m http.server` |
| [`starters/php-mysql`](starters/php-mysql) | PHP 8 + MySQL (or SQLite) + phpMyAdmin | `php seed.php && php -S localhost:8080 -t public` |
| [`starters/wordpress-plugin`](starters/wordpress-plugin) | WordPress plugin: shortcode + REST + admin | `docker compose up` or `npx @wordpress/env start` |
| [`starters/eri-job-card`](starters/eri-job-card) | WordPress Gutenberg block | `npm install && npm run build` |
| [`starters/expo-supabase`](starters/expo-supabase) | React Native/Expo + Supabase (iOS, Android, web) | `npm install && npx expo start` |
| [`starters/ai-helpers`](starters/ai-helpers) | Prompts + PHP client for Claude/OpenAI | `php starters/ai-helpers/php/hello_llm.php` |

4. **Build in your challenge folder on a team branch** (`team/<your-team-name>/<feature>`). That's where CI runs. Picked a starter instead? Copy it into `teams/<your-team-name>/`. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Day-of
- **Schedule, challenges and judging:** [wiki/event/hackreation.md](wiki/event/hackreation.md)
- **Nothing to install:** each team gets VS Code in the browser plus its own WordPress ([infra/README.md](infra/README.md)). Fallback: GitHub Codespaces (`.devcontainer/`). Using a screen reader? Start on your laptop or in Codespaces; the browser IDE isn't tested with one yet.
- **Kickoff slides:** [deck/attendee-kickoff.md](deck/attendee-kickoff.md) (Marp markdown; render with `npx @marp-team/marp-cli`)
- **Stack how-tos for people and AI:** [wiki/stack/](wiki/stack/README.md) covers WordPress plugins and blocks, PHP/MySQL, JS/jQuery, HTML/CSS accessibility, Expo, Supabase, Docker and AI-assisted coding

## Knowledge base and simulated users
- [`wiki/knowledge/`](wiki/knowledge/README.md): 55+ sourced pages on benefits, employment law, compliance, the Wisconsin service landscape, public datasets, and ERI's finances and strategy
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
challenges/  one working hello world per PRD (start here)
starters/    hello worlds for each recommended stack
teams/       only if you picked a starter (otherwise work in challenges/)
tools/       data generator, smoke tests, public-data fetch
infra/       day-of hosting: per-team browser VS Code + WordPress (Docker Compose)
deck/        attendee kickoff slides (Marp)
```

Run every smoke test: `bash tools/check.sh`. It exits **0** when everything ran and passed, **2** when something was skipped for a missing tool (the day-of team images ship without `node_modules`, so both BDD suites skip there), and **1** on a real failure. CI runs one workflow per challenge plus repo guardrails (`.github/workflows/`).

**Work like a real team:** [CONTRIBUTING.md](CONTRIBUTING.md) covers issues tied to acceptance criteria, branches, Conventional Commits, TDD/BDD, PRs with review, the Definition of Done and ADRs ([docs/adr/](docs/adr/)).

MIT licensed. Built by Mitobyte volunteers for ERI. Not an official ERI product: ERI reviews projects and decides what, if anything, to adopt.
