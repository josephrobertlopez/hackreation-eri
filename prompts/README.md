# Handoff prompts

Copy-paste prompts for an AI coding agent (Claude Code, Codex, Cursor agent) to **deploy and operate** this repo. Each one is self-contained: role, context to read, steps, guardrails, and how to verify. Run them in order before the event.

| # | Prompt | When | Where it runs |
| --- | --- | --- | --- |
| 01 | [Publish to GitHub](01-publish-to-github.md) | T-7 days | Your laptop |
| 02 | [Deploy day-of hosting](02-deploy-day-of-hosting.md) | T-7 days (dry run at T-2) | Jacob's server |
| 03 | [Day-of operations](03-day-of-ops.md) | Oct 31 | Jacob's server |
| 04 | [Post-event triage and handoff](04-post-event-triage.md) | Oct 31 evening to Nov 7 | Your laptop |
| 05 | [Install a winning plugin on ERI's WordPress](05-install-on-eri-wordpress.md) | Follow-up evening 1 | With ERI's web developer |
| 06 | [Refresh SSA and DVR numbers](06-refresh-numbers.md) | Each January | Your laptop |

**Always:** read `AGENTS.md` first, use synthetic data only, never print or commit secrets, and stop and ask before anything destructive (`down -v`, force push, deleting repos).
