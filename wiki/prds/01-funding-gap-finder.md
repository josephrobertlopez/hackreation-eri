# PRD 01: Funding gap finder

> **SUPERSEDED, 2026-10-26.** ERI supplied their own four problem statements;
> this PRD was our guess and is not one of them. See
> [docs/eri-problem-statements.md](../../docs/eri-problem-statements.md) and
> [ADR 0003](../../docs/adr/0003-pivot-to-eri-problem-statements.md). The code
> under `challenges/` stays until its replacement runs, because its test
> harness is being ported, not thrown away.

**Status:** v0.2, **Hello world:** [`challenges/01-funding-gap-finder`](../../challenges/01-funding-gap-finder/), **Data:** `data/dvr/`, `data/ticket/`, `data/county/`, **Personas:** finance director, [Alex](../personas/eri-staff.md)

> **Our assumptions (ERI: keep / kill / change)**
> 1. Some delivered work goes unbilled or underbilled across DVR, Ticket to Work and county contracts.
> 2. Billing and case notes live in systems that can export CSV.
> 3. A weekly exception list a person reviews beats any automation.
> 4. This stays a prototype until ERI decides on data access.

## Problem
ERI is paid only when work is **authorized → delivered → documented → claimed**. Each funder has different rules, so gaps hide in the seams: a retention month never invoiced, a Ticket payment never requested, county units under-claimed. Program revenue was $1.68M in FY2025 (all programs), so small leaks add up.

## The one idea
Turn every funder's export into **one common ledger**: `funder, client, period, service, delivered, claimed, expected $, claimed $, evidence`. Then **one check**, expected vs claimed, works everywhere.

## Demo (3 minutes)
"Here are three fake exports. One command builds the ledger. Here are 22 flags: $4.8K DVR, $6.9K Ticket, and 4 county **over-claims** marked as risk. Click one to see the evidence. A person decides."

## MVP: already working in the hello world
- ETL for DVR monthly support, Ticket to Work (simplified), county units
- Generic under/over-claim check, plus a filterable accessible table

## Team stretch goals (pick 1-2)
- DVR Job Development & Hire, including preferred outcomes ($2,000 / $2,200)
- Late-report flags (more than 5 business days)
- Ticket "missing evidence" (no pay stub) as its own action
- A review workflow with an audit trail (who / when / decision) (big)
- Wrap it as a WordPress admin page. Test site and synthetic data only: billing data never goes on ERI's public sites.

## Acceptance criteria (spec)
Each criterion is tested. Scenarios in `challenges/01-funding-gap-finder/features/` are tagged with these IDs, and PHPUnit tests name them in their docblocks.

| ID | Given / When / Then |
| --- | --- |
| AC-01.1 | Given DVR, Ticket and county exports, when the ETL runs, then every row lands in **one ledger** with the same columns |
| AC-01.2 | Given a delivered DVR monthly support note with no invoice, then it is flagged **under-claimed** (3 in the sample) |
| AC-01.3 | Given a month where the note says the client was **not employed**, then it is **not** flagged |
| AC-01.4 | Given a Ticket payment earned (with a pay stub) but not requested, then it is flagged (5 in the sample) |
| AC-01.5 | Given county units delivered > claimed, then it is flagged under-claimed (10 in the sample) |
| AC-01.6 | Given claimed > delivered, then it is flagged **over-claimed (risk)** with a negative amount, never as money to collect (4 in the sample) |
| AC-01.7 | Every flag carries **evidence** (a note id or source row) |

## Adversarial debate
| Against | Response |
| --- | --- |
| "ERI can't use this. It needs real data and IT approval." | True. It's a **prototype + recommendation**. The deliverable is the pattern and the ledger schema; ERI finance staff can map a real export to it later, in house. |
| "Billing tools invite gaming." | Flags only, evidence shown, human decides, over-claims surfaced as risk. Never suggests wording. (See [billing integrity](../knowledge/compliance/billing-integrity-and-false-claims.md).) |
| "Simplified Ticket rules are wrong." | They're labeled simplified, and real rules are in [ticket-to-work](../knowledge/benefits/ticket-to-work.md). The demo proves the *pattern*, not the payment math. |
| "A spreadsheet pivot could do this." | Maybe! If a team proves that with a clear pivot recipe, that's a win too, and cheaper to adopt. |

**Kill it if:** ERI says billing gaps aren't real, or no one will ever export the data, or ERI's billing system already shows these gaps.

## Monday owner
If ERI continues: ERI finance owns the rules. No code owner until ERI decides on data access; billing data never goes on ERI's public sites. **Volunteer follow-up:** one evening walking finance through the ledger schema using the synthetic data. ERI maps its own exports in house, and no real data leaves ERI. ERI decides whether to continue.
