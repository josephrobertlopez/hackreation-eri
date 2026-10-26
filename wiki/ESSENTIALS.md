# Hackathon essentials (read this, skip the rest)

Everything a team needs on rules and data for Oct 31, on one page. The deep [knowledge base](knowledge/README.md) is optional background.

## ERI in 30 seconds
- A Madison nonprofit (since 1990) that helps people with disabilities get and keep jobs.
- Work can shrink SSI or SSDI (Social Security disability checks) or affect Medicaid (health coverage). Fear of that stops people from saying yes to jobs.
- ERI is paid mostly per service, by Wisconsin DVR and Social Security, and only when work is documented and claimed.
- A small web team runs ERI's WordPress sites. Build on that stack so they can keep it.

## The 6 rules
1. **Fake data only** (privacy law protects client data). Use `data/`. No real names, case notes, benefits amounts or diagnoses, ever.
2. **No connection to ERI systems.** Your prototype stands alone.
3. **AI is optional and off by default.** In real life, DVR requires the client's consent before any AI tool touches their info. At the event, AI may only see synthetic data.
4. **Benefits answers are estimates** (wrong benefits info hurts people). Show "Estimate only, talk to a benefits specialist: WIPA 1-877-826-1752." Never say "you'll keep your SSI."
5. **Billing tools flag, people decide** (this is public money). Find work that was done but not billed. Never suggest wording to get a higher rate.
6. **Accessible or it doesn't count.** Keyboard works, labels on inputs, visible focus, good contrast, plain words ([checklist](domain/accessibility.md)).

## Sample data you get
| File | What | For |
| --- | --- | --- |
| `data/job_seekers.csv` | 40 fake Milwaukee job seekers | PRD 02 |
| `data/job_postings.csv` | 60 fake jobs at fictional employers | PRD 02, PRD 03 |
| `data/dvr/*.csv` | Fake DVR purchase orders, notes, invoices, fee schedule, with planted billing mistakes | PRD 01 |
| `data/ticket/*.csv`, `data/county/*.csv` | Fake Ticket to Work earnings and payment requests; fake county units (simplified rules) | PRD 01 |

## Numbers you might need
| Thing | Value |
| --- | --- |
| SSI max federal payment (2026 / 2027) | $994 / $1,029 a month |
| SSDI earnings line, SGA (2026 / 2027) | $1,690 / $1,770 a month |
| SSDI trial work month (2026 / 2027) | $1,210 / $1,270 a month |
| SSI rough math | check drops $1 for every $2 earned after the first $85 |
| DVR job placement pay to ERI | $1,600, or $2,000 (20+ h and insurance or ≥ $12/h), or $2,200 (35+ h and insurance or ≥ $16/h) |
| DVR monthly job support | $1,600 (instruction) or $500 (retention) per month employed |
| DVR report deadline | 5 business days |

## Don't pitch employers on
- The Section 503 "7% goal" (rescinded Sept 2026) or the WOTC tax credit (lapsed for hires after 2025). Pitch retention, accommodations (most cost little or nothing; see askjan.org), and ERI support instead.

## Where to send people (put these in your app)
- Benefits questions: **Wisconsin WIPA 1-877-826-1752**
- Rights or a DVR dispute: **Disability Rights Wisconsin / Client Assistance Program 800-928-8778**
- Accommodation ideas: **askjan.org**
