# 3. ERI's four problem statements replace our three guesses

Date: 2026-10-26

## Status

Accepted. Supersedes the challenge selection in
[0001-decoupled-challenges.md](0001-decoupled-challenges.md); that ADR's
*structure* (one folder, one data copy, one CI workflow per challenge) still
stands and is reused unchanged.

## Context

Until today the three challenges in this repo were **our** inference of what
ERI wanted, written from their stated interest in "connecting job seekers to
jobs" and "DVR billing". On 2026-10-26, five days before the event, ERI
supplied four written problem statements with their own MVPs, success criteria,
accessibility requirements, out-of-scope lists and privacy constraints. They
are now at [docs/eri-problem-statements.md](../eri-problem-statements.md),
converted from ERI's PDF.

The four are not refinements of our three. They are different products:

| | ERI asked for | We had built |
| --- | --- | --- |
| P1 | Show Your Skills — accessible portfolio | — |
| P2 | My Workday Assistant — task/routine support | — |
| P3 | Job Coach Connection — employee↔coach messaging | — |
| P4 | Employer Opportunity & Support Hub — skills-to-tasks | — |
| | — | 01 Funding gap finder (DVR/Ticket/county billing) |
| | — | 02 Is this job right for me? (benefits + commute) |
| | — | 03 Inclusive job post checker |

Three observations drove the decision:

1. **ERI's statements win.** They are the client's own words, with their own
   success criteria. Anything in this repo that contradicts them is a bug.
2. **Our 01 is off-brief.** ERI's four contain no billing or funding-gap
   product. DVR billing was a real ERI interest, but it is not what they wrote
   down for the hackathon.
3. **The harnesses transfer; the subject matter does not.** 02 and 03 are
   browser-only, no-network tools with node:test + Cucumber + Playwright/axe
   suites, a CSV data copy, and a synced WordPress plugin. That scaffolding is
   the expensive part and it is challenge-agnostic.

## Decision

ERI's four problem statements are the canonical challenge set. The PRDs,
challenge folders, README, deck and event page are rewritten around them.

**We port onto the existing harnesses rather than starting from empty dirs:**

| New | Inherits the harness from | Why it fits |
| --- | --- | --- |
| P1 Show Your Skills | `challenges/02-job-fit-checker` | Browser-only, nothing stored, CSV sample data, share/export, WP plugin — the same shape ERI's P1 asks for |
| P4 Employer Hub | `challenges/03-job-post-checker` | Input → analysis → explained output with reasoning shown; P4's skills-to-tasks MVP is that shape |
| P2 My Workday Assistant | `starters/static-web` + the a11y harness | New build: step state machine, one step at a time |
| P3 Job Coach Connection | `starters/static-web` + the a11y harness | New build: two views (employee, coach inbox) over session state |

**The old three are retired, not deleted, until their replacements run.**
Deleting them tonight would leave four briefs and nothing that executes, with
five days left; the repo's central promise is "pick a challenge, it already
runs and has tests." They are marked superseded in their PRDs and README and
come out once P1–P4 are green.

## Consequences

- **Four challenges, six teams.** Previously three challenges, two teams each.
  Allocation is now an organizer decision (2/2/1/1, or let teams choose). This
  needs an answer before kickoff.
- **P1 and P4 can share data.** ERI's P4 §12 names the P1 portfolio as the
  future integration. We keep them decoupled per ADR 0001 but use consistent
  skill vocabulary in both data copies so a team can demo the handoff.
- **Guardrails get stricter, not looser.** ERI's statements add explicit
  prohibitions we did not have written down: no automated hiring or
  accommodation decisions, no ranking candidates by disability, never require
  disclosure of a disability or diagnosis, no accommodation suggested from a
  disability label alone, and task progress stays private to the employee. P2
  and P3 also carry a new one — the product must not read as employer
  surveillance, and must not imply a coach is always available.
- **The emergency boundary is now a requirement.** P3 must distinguish routine
  coaching requests from emergencies and point at established emergency
  procedures. That is a correctness requirement, not a nicety.
- **Synthetic-data generator needs new tables.** Skills, work examples, sample
  tasks with steps, support-need options, employer needs. `tools/
  generate_synthetic_data.py` and the `check_synthetic`/`check_derived` gates
  are coupled to the old CSVs and must follow.
- **Our 02's benefits work does not die.** The SSI/SSDI and WIPA material in
  `wiki/knowledge/benefits/` stays; it is reference knowledge any of the four
  may need, and ERI's P1 §10 and P4 §10 both touch disclosure.

## What was explicitly not done

The three old challenge folders, their CI workflows, the data generator, the
compose files, `llms.txt`/`llms-full.txt` and the stack how-tos still name the
old challenges — 54 files in total at the time of writing
(`git grep -lI -E 'funding-gap-finder|job-fit-checker|job-post-checker'`).
Those follow with the ports, so the repo never sits in a state where the
documented entry point does not run.
