# PRD 03: Inclusive job post checker

> **SUPERSEDED, 2026-10-26.** ERI supplied their own four problem statements;
> this PRD was our guess and is not one of them. See
> [docs/eri-problem-statements.md](../../docs/eri-problem-statements.md) and
> [ADR 0003](../../docs/adr/0003-pivot-to-eri-problem-statements.md). The code
> under `challenges/` stays until its replacement runs, because its test
> harness is being ported, not thrown away.

**Status:** v0.2, **Hello world:** [`challenges/03-job-post-checker`](../../challenges/03-job-post-checker/), **Data:** `data/job_postings.csv` (46/60 contain planted barrier phrases), **Persona:** hiring manager ([job-seekers.md #6](../personas/job-seekers.md))

> **Our assumptions (ERI: keep / kill / change)**
> 1. ERI wants more employer relationships (Business Services).
> 2. A free, useful tool is a better door-opener than a brochure.
> 3. Employers won't paste anything sensitive; job posts are public anyway.

## Problem
Job posts often include requirements that aren't essential but screen out disabled applicants: lifting 50 lbs for a desk job, "valid driver's license," "must hear the phone." Employers don't notice, and they don't know ERI can help.

## The one idea
Paste a job post → flagged phrases, why they matter, suggested rewrites, an accommodation statement, and **"Talk to ERI Business Services."**

## Demo (3 minutes)
Paste a synthetic posting → score 45/100 → three fixes → the rewritten line → the ERI link. "Every employer who uses this meets ERI."

## MVP: already working in the hello world
- 10 rules, a score, the accommodation statement, the ERI link, and a WordPress plugin

## Team stretch goals (pick 1-2)
- One-click rewrite; more rules with fewer false positives
- Optional LLM rewrite (public text only; demo only, not part of the plugin ERI would host)
- An unbranded, accessible inclusive-hiring checklist page (HTML, not PDF); a "have ERI review my post" link (mailto or ERI's contact page; nothing stored)

## Acceptance criteria (spec)
Tested by `challenges/03-job-post-checker/test/` (node:test) and `features/` (Cucumber, tagged with these IDs).

| ID | Given / When / Then |
| --- | --- |
| AC-03.1 | Given a post with a barrier phrase, then it's flagged with **why** and a **suggested rewrite** |
| AC-03.2 | Given no accommodation statement, then one is suggested |
| AC-03.3 | Given an inclusive post, then **no** flags |
| AC-03.4 | Flags barrier phrases in more than 20 of the 60 sample postings |
| AC-03.5 | Shows "Talk to ERI Business Services" and "guidance only, not legal advice" |
| AC-03.6 | The page has **no axe violations**; result focus moves to the heading |
| AC-03.7 | Pasted HTML is shown as text, never run (no injection) |

## Adversarial debate
| Against | Response |
| --- | --- |
| "Employers may need those requirements." | The tool says "include it only if it's essential." The employer decides. It's guidance, not legal advice. |
| "Low impact for job seekers." | Indirect but real: better posts mean more applicants, and every user is a potential ERI employer partner. |
| "Off-theme." | It's the employer side of "connect job seekers with jobs." |

**Kill it if:** ERI doesn't want to grow employer services right now, or ERI's web team can't maintain a second plugin (see [hackathon value plan](../knowledge/org/hackathon-value-plan.md): adopting more than two projects is a likely failure mode).

## Monday owner
If ERI picks it: ERI web team + Employment Services manager. **Volunteer follow-up:** evening 1, install the plugin on a test page with the web developer. Evening 2, the Employment Services manager reviews the wording. ERI decides whether and when it goes live.
