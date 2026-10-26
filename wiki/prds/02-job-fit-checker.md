# PRD 02: "Is this job right for me?"

**Status:** v0.2, **Hello world:** [`challenges/02-job-fit-checker`](../../challenges/02-job-fit-checker/), **Data:** `data/job_postings.csv`, `data/job_seekers.csv`, **Persona:** [Marcus](../personas/job-seekers.md) (and [agent](../../agents/avg-job-seeker.md))

> **Our assumptions (ERI: keep / kill / change)**
> 1. Fear of losing SSI/SSDI or Medicaid stops people from taking jobs.
> 2. A public, anonymous tool on eri-wi.org that sends people to ERI is useful and safe.
> 3. Plain language and mobile-first matter more than features.
> 4. Nothing typed in is stored or sent anywhere.

## Problem
"Connect job seekers with jobs" breaks down at the moment of a job offer. People can't tell whether it fits: the hours, the bus, and above all *what happens to my benefits*. They either turn it down or call ERI with the same question.

## The one idea
A 4-question check (hours, pay, benefit type, bus) → plain-language result: monthly pay, an SSI/SSDI heads-up with 2026/2027 numbers, and the commute. Always **"Estimate only: call WIPA."** Everything runs in the browser.

## Demo (3 minutes)
Play Marcus: "20 hours at $15, I get SSI, there's a bus." → "About $1,299 a month; your SSI check might be about $387; Medicaid may continue; call WIPA." Then: it's a WordPress shortcode, so ERI's web team could test it on a page.

## MVP: already working in the hello world
- The estimator (SSI rough math, SSDI TWP/SGA, 2026/2027 switch), accessible form, WordPress plugin

## Team stretch goals (pick 1-2)
- Choose a real-looking posting from `job_postings.csv` and score fit against a 3-question profile
- Commute time from MCTS GTFS (big: needs a data download)
- "Send to my ERI specialist" (mailto or print; nothing stored)
- Spanish; a reading-level check

## Acceptance criteria (spec)
Tested by `challenges/02-job-fit-checker/test/` (node:test) and `features/` (Cucumber, tagged with these IDs).

| ID | Given / When / Then |
| --- | --- |
| AC-02.1 | Monthly pay = hours × wage × 4.33, rounded to whole dollars |
| AC-02.2 | Given SSI, then a rough check estimate = federal max − (monthly pay − $85) ÷ 2, never below $0 |
| AC-02.3 | Given SSDI and pay above SGA, then a heads-up; pay between TWP and SGA, then a trial-work note |
| AC-02.4 | Uses the right year's SSA numbers (2026: TWP $1,210 / SGA $1,690; 2027: $1,270 / $1,770) |
| AC-02.5 | **Always** shows "Estimate only" and the WIPA number 1-877-826-1752 |
| AC-02.6 | Given no bus and a commute over 45 minutes, then a commute warning |
| AC-02.7 | The page has **no axe violations**, every input has a label, and focus moves to the result heading |
| AC-02.8 | Makes **no network requests** and stores nothing |

## Adversarial debate
| Against | Response |
| --- | --- |
| "Benefits math online will mislead people." | It's labeled rough, uses conservative wording ("may"), and always routes to WIPA. Before any launch, ERI's benefits staff would need to review the copy. |
| "This isn't connecting people to jobs." | It removes the #1 blocker at the moment of an offer, and it sends people to ERI. Stretch: pick from postings. |
| "SSI rules are more complex (state supplement, deeming, IRWE)." | Yes, which is exactly why it says "rough guess" and hands off to a human. Don't add complexity in one day. |

**Kill it if:** ERI's benefits team says any estimate is too risky to publish. Then fall back to a plain "what to ask before you say yes" checklist.

## Monday owner
If ERI picks it: ERI web team. **Volunteer follow-up:** evening 1, install it on a test page with the web developer. Evening 2, the benefits manager reviews the copy. ERI decides whether and when it goes live.
