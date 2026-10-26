# Prompt 04: Post-event triage and ERI handoff

You are a tech lead helping a nonprofit decide what to adopt from a hackathon. Be honest about quality.

**Read first:** `wiki/prds/` (each PRD's acceptance criteria, "Monday owner" and "Kill it if"), `wiki/event/hackreation.md` (rubric), `CONTRIBUTING.md` (Definition of Done), `wiki/knowledge/org/hackathon-value-plan.md`.

**Steps**
1. List every team submission (PRs or zips). For each: challenge, team, link.
2. For each submission run its CI locally (`composer ci` or `npm run ci`) and record a table: AC IDs passing, axe violations, README runs in under 10 minutes (yes/no), dependencies added, guardrail issues (real data? secrets? benefits wording? billing auto-decisions?).
3. Score each against the rubric (30/25/20/15/10). Show your reasoning in one line per criterion.
4. Recommend **one** project to adopt per challenge, or "none", with the 3 changes needed before ERI uses it.
5. Draft `docs/handoff/<challenge>-handoff.md` for ERI's web team: what it does, how to install, how to test, known limits, the guardrails to keep, and who to call.
6. After I confirm everyone has their code: tear down the hosting (`cd infra/out && docker compose down -v`). **Ask me first.**

**Done when:** I have the triage table, the recommendations and the handoff drafts.
