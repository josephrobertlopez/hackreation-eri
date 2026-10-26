---
title: Employer and federal contractor data
summary: Finding disability-friendly employers in southern Wisconsin: federal contractors (USAspending API, SAM.gov Entity API) and Section 503 (7% goal rescinded 2026-09-21), OFCCP status in 2026, WEDC tools, business databases at public libraries, and WOTC statistics.
tags: [datasets, employers, federal-contractors, section-503, ofccp, usaspending, sam, wedc, wotc]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2027-01-15   # WOTC authorization and OFCCP status are in flux
review_owner: ERI business development manager
confidence: medium
sources:
  - title: eCFR 41 CFR 60-741.45, Utilization goal
    url: https://www.ecfr.gov/current/title-41/subtitle-B/chapter-60/part-60-741/subpart-C/section-60-741.45
    accessed: 2026-10-23
  - title: DOL OFCCP home page
    url: https://www.dol.gov/agencies/ofccp
    accessed: 2026-10-23
  - title: USAspending API
    url: https://api.usaspending.gov/
    accessed: 2026-10-23
  - title: USAspending API endpoint list
    url: https://api.usaspending.gov/docs/endpoints
    accessed: 2026-10-23
  - title: GSA Open Technology, SAM.gov Entity Management API
    url: https://open.gsa.gov/api/entity-api/
    accessed: 2026-10-23
  - title: WEDC home page
    url: https://wedc.org/
    accessed: 2026-10-23
  - title: Milwaukee Public Library, All Databases
    url: https://www.mpl.org/databases/all/
    accessed: 2026-10-23
  - title: Madison Public Library, Databases and eResources
    url: https://www.madisonpubliclibrary.org/resources/eresources
    accessed: 2026-10-23
  - title: DOL ETA, Work Opportunity Tax Credit
    url: https://www.dol.gov/agencies/eta/wotc
    accessed: 2026-10-23
  - title: DOL ETA, WOTC Performance data
    url: https://www.dol.gov/agencies/eta/wotc/performance
    accessed: 2026-10-23
  - title: IRS, Work Opportunity Tax Credit
    url: https://www.irs.gov/businesses/small-businesses-self-employed/work-opportunity-tax-credit
    accessed: 2026-10-23
---

# Employer and federal contractor data

## TL;DR
- **Section 503 changed in 2026.** A DOL final rule (91 FR 54482, published 2026-08-21, effective 2026-09-21) **rescinded the 7% utilization goal (41 CFR 60-741.45) and the self-ID requirement (60-741.42)**. Non-discrimination, accommodation and outreach duties remain for federal contractors, so they're still a reasonable outreach list, but there's no longer a numeric goal to pitch. See [rehabilitation-act](../employment-law/rehabilitation-act.md).
- **Who's a federal contractor in WI?** Use the **USAspending API** (no key) for awards to WI recipients. Use the **SAM.gov Entity API** (free personal key, only 10 requests a day without a SAM role) for registered entities with WI addresses.
- **WOTC** has vocational rehabilitation referral and SSI recipient target groups. Its authorization ran to **2025-12-31**, and we found no confirmed extension **(verify)**. DOL publishes national certification totals (FY2024: 1,577,683). State detail appears to be in PDFs.
- Library business databases: **Milwaukee Public Library offers AtoZdatabases** (remote with a City of Milwaukee card). We did not find Data Axle/ReferenceUSA listed at MPL.

## Key facts
| Dataset | What | Access / API | License / ToS | Refresh | How ERI uses it |
| --- | --- | --- | --- | --- | --- |
| **USAspending.gov API** | Federal awards (contracts, grants) by recipient, place and agency | `https://api.usaspending.gov/api/v2/…`. "Endpoints do not currently require any authorization." Useful: `GET /api/v2/recipient/state/55/`, `GET /api/v2/recipient/state/awards/55/`, `POST /api/v2/recipient/`. Award search endpoints (e.g. `/api/v2/search/spending_by_award/`) are not on the endpoint index we read **(verify)** | Federal data. No license terms stated on the API page **(verify)** | Agencies report regularly **(verify cadence)** | List of WI federal contractors, so ERI can pitch Section 503 hiring support |
| **SAM.gov Entity Management API** | Registered entities: name, UEI, addresses, NAICS, PSC, business types, POC names | `https://open.gsa.gov/api/entity-api/`. Personal Public API Key from your SAM.gov account page. Filter `physicalAddressProvinceOrStateCode=WI` | Public data tier only (FOUO and sensitive need federal system accounts) | Live | Enrich contractor names with NAICS and address. **10 requests a day** without a SAM role, so pull once and cache |
| **OFCCP** | Section 503 and VEVRAA enforcement | dol.gov/agencies/ofccp. No open contractor dataset on the home page. FOIA Library linked | Federal | n/a | As of the page we read: pending compliance reviews administratively closed; the Section 503/VEVRAA AAP certification period closed; VEVRAA/503 obligations "remain in effect" |
| **WEDC** | WI economic development: SizeUpWI (free market research), export data, available sites, programs, Workforce Innovation Grant reports, annual report | wedc.org. No API listed | WEDC site terms **(verify)** | Varies | Employer prospect lists by industry (SizeUpWI). Context on grants |
| **Data Axle / ReferenceUSA** | Commercial business lists | Through library subscriptions. **Not found** in MPL's A-G database list. Not visible in the first 50 of 175 Madison PL eResources **(verify)** | Vendor license. Typically personal or non-bulk use only **(verify)** | Vendor | Don't plan on it for the hackathon |
| **AtoZdatabases** (MPL) | "30 million business and executive profiles" | Remote access for City of Milwaukee cardholders | Vendor license **(verify bulk-export limits)** | Vendor | Manual employer research by a specialist. No scraping or bulk export into the app |
| **WOTC statistics** (DOL ETA) | Certifications nationally by fiscal year, wage band and occupation | `dol.gov/agencies/eta/wotc/performance`. FY2024 PDF "State and National Details" **(verify WI figures in the PDF)** | Federal | Annual | Employer pitch: hiring a DVR referral or SSI recipient may earn a tax credit, if WOTC is authorized |

## How it works
- **Section 503 basics:** contractors with more than 100 employees measure utilization by the same job groups they used under EO 11246 (per the eCFR text). Smaller contractors may measure their whole workforce. Paragraph (h) bars using the goal as a quota or ceiling. The eCFR text still references EO 11246 job groups after the EO's revocation. How OFCCP handles that is **(verify)**.
- **WOTC target groups** (IRS page) include *vocational rehabilitation referral* (state VR plan, a Ticket to Work Employment Network plan, or a VA program) and *qualified SSI recipient* (SSI for any month ending within the 60 days before the hire date).
- **USAspending FIPS:** Wisconsin is `55`.

## Caveats and gotchas
- Federal contractor status isn't a quality rating. A big award doesn't mean the employer hires locally or has openings.
- SAM data includes point-of-contact names. Don't show personal contact data in a public demo.
- WOTC: both the DOL and IRS pages (IRS reviewed 2026-07-20) still say "authorized until December 31, 2025." Don't tell employers the credit is available without checking current law.
- OFCCP's status page has no updates after mid-2025 items plus a moratorium for VAHBP providers through 2027-05-07. Check it again before relying on it.

## How ERI / a hackathon tool should use this
- **Stretch feature:** "Employers who may value Section 503 hires." Build a cached list of WI recipients from USAspending, joined to the synthetic postings by employer name, with a plain-language note on why it matters.
- Keep this for ERI business development staff, not job seekers. Never imply an employer "must hire" someone.
- **Must NOT:** scrape library databases, present WOTC as guaranteed, or show SAM POC personal data.

## Related pages
- [jobs-and-postings.md](jobs-and-postings.md)
- [nonprofit-and-funding-data.md](nonprofit-and-funding-data.md)
- [README.md](README.md)

## Sources
- [eCFR 41 CFR 60-741.45](https://www.ecfr.gov/current/title-41/subtitle-B/chapter-60/part-60-741/subpart-C/section-60-741.45)
- [DOL OFCCP](https://www.dol.gov/agencies/ofccp)
- [USAspending API](https://api.usaspending.gov/)
- [USAspending API endpoints](https://api.usaspending.gov/docs/endpoints)
- [SAM.gov Entity Management API](https://open.gsa.gov/api/entity-api/)
- [WEDC](https://wedc.org/)
- [Milwaukee Public Library, All Databases](https://www.mpl.org/databases/all/)
- [Madison Public Library, eResources](https://www.madisonpubliclibrary.org/resources/eresources)
- [DOL ETA, WOTC](https://www.dol.gov/agencies/eta/wotc)
- [DOL ETA, WOTC Performance](https://www.dol.gov/agencies/eta/wotc/performance)
- [IRS, WOTC](https://www.irs.gov/businesses/small-businesses-self-employed/work-opportunity-tax-credit)
