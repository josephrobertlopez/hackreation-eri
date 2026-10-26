---
title: Nonprofit and funding data
summary: Sources for nonprofit finances and grant opportunities: ProPublica Nonprofit Explorer API, IRS Form 990 e-file downloads, Candid, Grants.gov (XML extract and Simpler.Grants.gov API), and Wisconsin DHS/DWD grant pages, including foundation 990-PFs.
tags: [datasets, nonprofits, form-990, propublica, irs, candid, grants-gov, funding, wisconsin]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2027-04-23
review_owner: ERI development and grants manager
confidence: medium
sources:
  - title: ProPublica Nonprofit Explorer API
    url: https://projects.propublica.org/nonprofits/api
    accessed: 2026-10-23
  - title: ProPublica Data Store terms (archived Data Store)
    url: https://projects.propublica.org/datastore/terms/
    accessed: 2026-10-23
  - title: IRS, Form 990 Series Downloads
    url: https://www.irs.gov/charities-non-profits/form-990-series-downloads
    accessed: 2026-10-23
  - title: Candid home page
    url: https://candid.org/
    accessed: 2026-10-23
  - title: Grants.gov API page
    url: https://www.grants.gov/api
    accessed: 2026-10-23
  - title: Grants.gov XML Extract
    url: https://www.grants.gov/xml-extract
    accessed: 2026-10-23
  - title: Simpler.Grants.gov developer page
    url: https://simpler.grants.gov/developer
    accessed: 2026-10-23
  - title: Wisconsin DHS, Business with DHS
    url: https://www.dhs.wisconsin.gov/business/index.htm
    accessed: 2026-10-23
  - title: Wisconsin DHS, Current Grant Funding Opportunities
    url: https://www.dhs.wisconsin.gov/business/solicitations-list.htm
    accessed: 2026-10-23
  - title: Wisconsin DWD home page
    url: https://dwd.wisconsin.gov/
    accessed: 2026-10-23
---

# Nonprofit and funding data

## TL;DR
- **ProPublica Nonprofit Explorer API v2** is free with no key: `https://projects.propublica.org/nonprofits/api/v2/search.json?state%5Bid%5D=WI&q=…` and `/organizations/{EIN}.json`. It's built on IRS data. Its exact terms for the API are **(verify)**.
- **IRS Form 990 e-file data:** yearly zip files of XML returns plus a CSV index (e.g. `index_2026.csv`). 2026 has 10 zips so far, page updated 2026-10-22. Foundation **990-PF** returns are part of the same series.
- **Grants.gov:** a daily full-database XML extract (`GrantsDBExtract[YYYYMMDD]v2.zip`, no login seen). The **Simpler.Grants.gov API** needs a key via Login.gov (60 requests per minute, 10,000 a day).
- **Candid** (Foundation Directory, grants data) is mostly paid. A free account gives profiles. It also sells APIs.

## Key facts
| Dataset | What | Access / API | License / ToS | Refresh | How ERI uses it |
| --- | --- | --- | --- | --- | --- |
| **ProPublica Nonprofit Explorer API** | Organization profiles and 990 financials (revenue, expenses, assets, filings, PDF links) | `GET /api/v2/search.json` (keyword, `state[id]`, NTEE, subsection; 25 per page) and `GET /api/v2/organizations/:ein.json`. No key mentioned. PDF links are rate limited | "Using the API means you agree to ProPublica's Data Terms of Use." The archived Data Store terms (cite ProPublica; no reselling; no full republication) may or may not be the ones that apply **(verify)** | As IRS releases data | Peer benchmarking (other WI supported-employment nonprofits), and funder lookups by EIN |
| **IRS Form 990 Series e-file** | XML of e-filed 990, 990-EZ, 990-PF, 990-T **(verify forms included)** | `irs.gov/charities-non-profits/form-990-series-downloads`. ZIPs of XML by year, CSV index per year | U.S. government data. Public returns | Several zips per year (2026: 01A-09A + 05B) | Bulk analysis of foundation grants (990-PF Part XV lists grants paid) **(verify part number)** |
| **Foundation 990-PFs** | Private foundation returns: assets, grants paid, grantee names | In the IRS e-file data above. Also as PDFs or parsed data via ProPublica | As above | Annual per foundation | Find WI foundations that fund disability employment |
| **Candid** (candid.org) | 1.9M organization profiles, 3M annual grant transactions; funder search; APIs; custom datasets | Free registration for profiles. Paid subscriptions and APIs (pricing page not read). Free access at Funding Information Network libraries not confirmed **(verify)** | Commercial license | Continuous | Development staff prospecting. Not for the hackathon |
| **Grants.gov XML Extract** | The whole Grants.gov opportunity database | Daily zip at `https://prod-grants-gov-chatbot.s3.amazonaws.com/extracts/GrantsDBExtract[YYYYMMDD]v2.zip` (pattern from the extract page). No login step seen | Federal data. Grants.gov Terms & Conditions linked from the API page **(verify)** | Daily, about 4:40 AM ET | Filter by CFDA/ALN, keyword ("disabilit", "vocational rehabilitation") |
| **Simpler.Grants.gov API** | REST search of funding opportunities | Docs at `api.simpler.grants.gov/docs`. Key from your Simpler.Grants.gov account (Login.gov). 60 req/min, 10,000/day. Keys disabled after 30 days unused. Read-only | No formal ToS on the developer page **(verify)** | Live | A "new federal funding this week" alert for the development team |
| **Grants.gov legacy APIs** | Applicant and Grantor system-to-system APIs | grants.gov/api. Not a public search API | Grants.gov T&C | n/a | Not needed |
| **WI DHS grant opportunities** | Current unawarded DHS solicitations (Requests for Application) | HTML table at `dhs.wisconsin.gov/business/solicitations-list.htm`. Bids go on VendorNet and the WI Public Notices site. No feed | State public information | As posted | Watch for disability-related RFAs |
| **WI DWD grants** | e.g. Wisconsin Fast Forward / Workforce Innovation announcements | No single grants page loaded for us (`dwd.wisconsin.gov/grants/` failed). News items like the 2026-06-29 WFF release **(verify the grants hub URL)** | State | As posted | DVR-adjacent workforce funding |

## How it works
- The **EIN** is the join key across ProPublica, IRS e-file and Candid.
- IRS e-file XML schemas change by tax year. Parse with care and use the CSV index to find the filings you need, instead of unzipping everything.
- The Grants.gov extract is large (the whole database). For a demo, filter it offline to a few opportunities.

## Caveats and gotchas
- 990 data lags 1-2 years behind the fiscal year.
- ProPublica's API is "a work in progress and subject to change."
- Candid's free tier is limited. Don't promise grant-level detail without a subscription.

## How ERI / a hackathon tool should use this
- Not core to Challenges A or B. It's a good **backlog** idea for ERI's development team (funder prospect list, grant deadline alerts).
- **Must NOT:** scrape Candid, or republish ProPublica data in bulk.

## Related pages
- [employers-and-contractors.md](employers-and-contractors.md)
- [README.md](README.md)
- [../../prds/cut-list.md](../../prds/cut-list.md)

## Sources
- [ProPublica Nonprofit Explorer API](https://projects.propublica.org/nonprofits/api)
- [ProPublica Data Store terms](https://projects.propublica.org/datastore/terms/)
- [IRS, Form 990 Series Downloads](https://www.irs.gov/charities-non-profits/form-990-series-downloads)
- [Candid](https://candid.org/)
- [Grants.gov API](https://www.grants.gov/api)
- [Grants.gov XML Extract](https://www.grants.gov/xml-extract)
- [Simpler.Grants.gov developer](https://simpler.grants.gov/developer)
- [WI DHS, Business with DHS](https://www.dhs.wisconsin.gov/business/index.htm)
- [WI DHS, Current Grant Funding Opportunities](https://www.dhs.wisconsin.gov/business/solicitations-list.htm)
- [WI DWD](https://dwd.wisconsin.gov/)
