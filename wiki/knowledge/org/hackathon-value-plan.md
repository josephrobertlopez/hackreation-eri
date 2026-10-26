---
title: Hackathon value plan (Oct 31, 2026) and 30/60/90-day follow-up
summary: How ERI turns the 2026-10-31 hackathon into lasting value (code ownership, MIT license, triage and adoption, volunteer pipeline, employer visibility, funder story), with a 30/60/90-day plan.
tags: [eri, hackathon, open-source, volunteers, adoption, fundraising]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2027-01-31   # end of the 90-day follow-up window
review_owner: ERI executive director
confidence: medium
sources:
  - title: ERI - Training and Design (in-house team and partnership models)
    url: https://eri-wi.org/training-and-design/
    accessed: 2026-10-23
  - title: ERI - Our Staff
    url: https://eri-wi.org/staff/
    accessed: 2026-10-23
  - title: Microsoft - Offers for nonprofits (Azure grant)
    url: https://www.microsoft.com/en-us/nonprofits/offers-for-nonprofits
    accessed: 2026-10-23
  - title: Kessler Foundation - Grantmaking FAQ
    url: https://KesslerFoundation.org/what-we-fund/frequently-asked-questions
    accessed: 2026-10-23
  - title: Madison Community Foundation - Community Impact Fund Grants
    url: https://madisongives.org/community-impact/grant-opportunities/community-impact-fund-grants/
    accessed: 2026-10-23
---

# Hackathon value plan

## TL;DR
- Most hackathon code dies within a month. ERI avoids that by deciding **before 2026-10-31** who owns the code, which license applies (MIT), who triages it, and which 1-2 projects it will actually adopt.
- Adopt only what ERI's **6-person web/training team** can maintain on its existing WordPress stack. Pick projects tied to a KPI in the [consulting brief](consulting-brief.md) (days-to-report, preferred-outcome %, Ticket payments, counselor time saved).
- Turn the event into **three lasting assets**: a volunteer pipeline, employer visibility, and a measured impact story for funders (MCF capacity building; Kessler requires collaborators and other funding).

## Key facts

| Item | Decision / fact |
|---|---|
| Event date | 2026-10-31 |
| Code owner | ERI GitHub organization (ERI admins); volunteers contribute under the repo license |
| License | MIT for code; content (KB text, training material) stays ERI-owned unless ERI releases it |
| Data rule | Public and synthetic data only. No client PII, no case notes |
| Maintainers | ERI senior web developer (tech) + one program owner per adopted project |
| Platform constraint | WordPress multisite (existing); static or small add-ons preferred |
| In-kind to lean on | Azure $2,000/yr credits; M365 Business Basic free up to 300 users |
| Funder hooks | MCF capacity-building grants (LOI due June); Kessler Community/Signature grants (ERI budget over $2M) |

## How it works

### Before the event (by 2026-10-30)
- Create an ERI-owned GitHub organization with an MIT `LICENSE`, `CONTRIBUTING.md`, a code of conduct, and an issue template per challenge. MIT is confirmed (2026-10-23).
- Write a one-page "definition of done" for each challenge: user, KPI, data source, what the tool must NOT do.
- Publish a "no PII" rule and give teams synthetic sample data.
- Get a signed (or click-through) contributor acknowledgment that work is MIT-licensed and that ERI may reuse it.

### On the day
- Every team demos against its KPI and its "must NOT do" list.
- An ERI review panel (program lead, web lead, a benefits specialist) scores each project on value, maintainability, safety, and accessibility (WCAG).

### Triage and adoption (week 1-2)
- **Adopt** (1-2 projects): ERI assigns an owner, a backlog and a release date.
- **Incubate** (2-3): volunteers keep working with an ERI mentor; review again at day 60.
- **Archive** the rest with a README saying what was learned.

### Volunteer pipeline
- Invite top contributors to a standing "ERI Tech Volunteers" group with monthly office hours and labeled "good first issues".
- Offer accessible, remote roles. Volunteers with disabilities are a natural fit and a mission signal.

### Employer visibility
- Thank sponsoring and participating employers publicly (with their consent). Invite them to an inclusive-hiring follow-up, which feeds opportunity #6 in the consulting brief.

### Impact story for funders
- Measure baseline vs after for adopted tools: minutes saved per counselor session, % of DVR reports filed within 5 business days, placeholder fixes shipped.
- Package results into a 2-page brief for MCF, UW Dane and Kessler conversations.

## 30/60/90-day follow-up

| Window | Dates | Deliverables | Owner (role) |
|---|---|---|---|
| **30 days** | by 2026-11-30 | Triage done. 1-2 projects adopted with owners. Repos cleaned (license, README, security check). Training Center placeholder fixes live. Thank-you and results post. Volunteer group launched | ED + senior web developer |
| **60 days** | by 2026-12-30 | First adopted tool piloted with 3-5 staff (human review on; synthetic data until ERI's AI policy, data agreements and any DVR AI consent are in place). Baseline KPIs captured. Incubated projects reviewed (adopt or archive). Employer follow-up meeting held | Program owner + client services director |
| **90 days** | by 2027-01-29 | Pilot results vs baseline. Go/no-go for production. Funder brief written. Grant calendar set (MCF LOI, UW Dane spring 2027, Kessler). Next hackathon or sprint decided | ED + finance director |

## Caveats and gotchas
- An MIT license lets anyone reuse the code, competitors included. That's fine for tools; keep proprietary training content separate.
- Volunteer-built AI tools must not go live without CWIC review, dated sources, and a clear "not advice" disclaimer routing to WIPA (1-877-826-1752).
- Federal TA-center sites (NTACT:C, VRTAC-QE, GW-CRCRE) belong to their clients. Don't use their content or credentials at the event.
- Staff time is the scarcest resource. Adopting more than two projects is a likely failure mode (our judgment, not a sourced finding).

## How ERI / a hackathon tool should use this
- Teams should read this page and the [consulting brief](consulting-brief.md) KPIs first.
- A project that cannot name its ERI owner, KPI and maintenance plan by demo time should be archived, not adopted.

## Related pages
- [Consulting brief](consulting-brief.md)
- [Digital footprint](eri-digital-footprint.md)
- [Funders and grant opportunities](funders-and-grant-opportunities.md)

## Sources
- [ERI - Training and Design](https://eri-wi.org/training-and-design/) (accessed 2026-10-23)
- [ERI - Staff](https://eri-wi.org/staff/) (accessed 2026-10-23)
- [Microsoft nonprofit offers](https://www.microsoft.com/en-us/nonprofits/offers-for-nonprofits) (accessed 2026-10-23)
- [Kessler Foundation FAQ](https://KesslerFoundation.org/what-we-fund/frequently-asked-questions) (accessed 2026-10-23)
- [MCF - Community Impact Fund Grants](https://madisongives.org/community-impact/grant-opportunities/community-impact-fund-grants/) (accessed 2026-10-23)
