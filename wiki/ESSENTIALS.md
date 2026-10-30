# Hackathon essentials (read this, skip the rest)

Everything a team needs on rules and data for Oct 31, on one page. The deep [knowledge base](knowledge/README.md) is optional background.

## ERI in 30 seconds
- A Madison-based nonprofit (since 1990, with staff in Milwaukee too) that helps people with disabilities get and keep jobs.
- Work can shrink SSI or SSDI (Social Security disability checks) or affect Medicaid (health coverage). Fear of that stops people from saying yes to jobs.
- ERI is paid mostly per service, by Wisconsin DVR and Social Security, and only when work is documented and claimed.
- A small web team runs ERI's WordPress sites. Build on the [recommended stack](company/tech-stack.md) (plain HTML, CSS and JavaScript that could be pasted into WordPress) so they can keep it.

## The 6 rules
1. **Fake data only** (privacy law protects client data). Use `data/` or your project's `fixtures/`. No real names, case notes, benefits amounts or diagnoses, ever. A Codespace port you make Public can be opened by anyone with the link, so fake data only there too. The repo is public: anything you push is world-readable.
2. **No connection to ERI systems.** Your prototype stands alone.
3. **AI is allowed, optional, and for fake data only.** An assistant you run yourself is fine: a chat in another browser tab, a tool on your own laptop, or GitHub Copilot in a Codespace if your account has it. Paste only synthetic data and repo code, and leave nothing that needs a paid key in the project folder. The backup team editor has no assistant. In real life, DVR requires the client's consent before any AI tool touches their info; at the event, AI may only see synthetic data.
4. **Benefits answers are estimates** (wrong benefits info hurts people). Show "Estimate only, talk to a benefits specialist: WIPA 1-877-826-1752." Never say "you'll keep your SSI."
5. **Only if you build a billing tool (none of P1 to P4 does): billing tools flag, people decide** (this is public money). Find work that was done but not billed. Never suggest wording to get a higher rate.
6. **Accessible or it doesn't count.** Keyboard works, labels on inputs, visible focus, good contrast, plain words ([checklist](domain/accessibility.md)).

## Getting started
Open a GitHub Codespace (free account) or use your own laptop (git and Node 20 or newer). The captain forks the repo and everyone works from the team fork. No account or no Node? The backup team editor (address and password on your team card) works in any browser. Steps, help and hand-in are in [START-HERE.md](../START-HERE.md); times and place are on the [event page](event/hackreation.md).

## Sample data you get
ERI's four projects (P1 to P4) each carry their own fake data in `challenges/p<n>-.../fixtures/`. That is all you need. The shared `data/` folder has more fake records (`job_seekers.csv`, `job_postings.csv`) if you want them; its DVR, Ticket and county files are for billing tools only, and none of P1 to P4 is one.

## Numbers you might need
The dollar figures and legal statuses below are unconfirmed as of Oct 30, 2026: the ERI liaison has not checked them, so show them as estimates and say "as of 2026". Benefits numbers are for any project that shows an estimate; their source is [wiki/domain/ssa-work-incentives-2026.md](domain/ssa-work-incentives-2026.md) (SSA Red Book), and they are estimates to verify before you hard-code anything. The 2027 figures were announced on 2026-10-14 (the source page says so). The DVR rows are for billing tools only (none of P1 to P4).

| Thing | Value |
| --- | --- |
| SSI max federal payment (2026 / 2027) | $994 / $1,029 a month |
| SSDI earnings line, SGA (2026 / 2027) | $1,690 / $1,770 a month |
| SSDI trial work month (2026 / 2027) | $1,210 / $1,270 a month |
| SSI rough math | check drops $1 for every $2 earned after the first $85 |
| DVR job placement pay to ERI | $1,600, or $2,000 (20+ h and insurance or ≥ $12/h), or $2,200 (35+ h and insurance or ≥ $16/h) |
| DVR monthly job support | $1,600 (instruction) or $500 (retention) per month employed |

## Don't pitch employers on
- The Section 503 "7% goal" (rescinded Sept 2026) or the WOTC tax credit (lapsed for hires after 2025); sources: [knowledge base](knowledge/README.md) and [Rehabilitation Act page](knowledge/employment-law/rehabilitation-act.md). Pitch retention, accommodations (most cost little or nothing; see askjan.org), and ERI support instead.

## Where to send people (put these in your app)
- Benefits questions: **Wisconsin WIPA 1-877-826-1752**
- Rights or a DVR dispute: **Disability Rights Wisconsin / Client Assistance Program 800-928-8778**
- Accommodation ideas: **askjan.org**
