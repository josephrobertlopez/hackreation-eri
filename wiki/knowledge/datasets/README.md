---
title: Public data catalog for the ERI hackathon
summary: Index of public datasets (jobs, occupations, accommodations, disability statistics, transit, employers, services, funding, geography) for the Hackreation x ERI hackathon, with a ranked starter kit of the 8 most useful ones.
tags: [datasets, catalog, index, starter-kit, hackathon]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2026-12-05   # Madison Metro GTFS expires; NLx access model update expected November 2026
review_owner: ERI data and IT lead
confidence: medium
sources:
  - title: O*NET 31.0 Database
    url: https://www.onetcenter.org/database.html
    accessed: 2026-10-23
  - title: MCTS Developer Terms and GTFS Feed
    url: https://www.ridemcts.com/policies/developer-terms
    accessed: 2026-10-23
  - title: BLS OEWS tables
    url: https://www.bls.gov/oes/tables.htm
    accessed: 2026-10-23
  - title: USAJOBS Developer, GET /api/Search
    url: https://developer.usajobs.gov/api-reference/get-api-Search
    accessed: 2026-10-23
  - title: JAN A to Z
    url: https://askjan.org/a-to-z.cfm
    accessed: 2026-10-23
  - title: Census Data API, ACS 5-Year 2024 subject tables
    url: https://api.census.gov/data/2024/acs/acs5/subject
    accessed: 2026-10-23
  - title: Madison Metro, Information for Developers
    url: https://www.cityofmadison.com/metro/business/information-for-developers
    accessed: 2026-10-23
  - title: Ticket to Work, Find Help
    url: https://choosework.ssa.gov/findhelp
    accessed: 2026-10-23
---

# Public data catalog for the ERI hackathon

## TL;DR
- Ten pages catalog the public data a job matcher (PRD 02) or a DVR billing checker (PRD 01) might use, focused on Milwaukee, Dane, Waukesha, Racine, Kenosha and Rock counties.
- **Build on synthetic `data/` first.** Public data *enriches* it: wages, job demands, commute times, accommodation ideas, referral links.
- **PRD 01 needs no public dataset.** Billing rules come from DVR documents (see `wiki/domain/dvr-supported-employment.md`) and the synthetic `data/dvr/` files.
- Run `tools/fetch_public_data.sh` **on your own machine** to download the openly downloadable starter files into `data/public/` (git-ignored by a `.gitignore` the script writes).

## Key facts: the starter kit (top 8, ranked)
| # | Dataset | Why it's in the kit | Access | License | Page |
| --- | --- | --- | --- | --- | --- |
| 1 | **O*NET 31.0** (Work Context, Abilities, Occupation Data) | Turns a job title into concrete demands (standing, lifting, noise, public contact), which drives accommodation hints and "why it fits" text. One download, no key | Zip or CSV download | CC BY 4.0 (attribution) | [occupations-and-wages](occupations-and-wages.md) |
| 2 | **MCTS GTFS** (Milwaukee) | The event is in Milwaukee, and "can I get there by bus?" is in the PRD's user stories. Powers commute-time and near-bus checks | Direct zip, no key | MCTS Developer Terms (disclaimer + data dates) | [transit-gtfs](transit-gtfs.md) |
| 3 | **BLS OEWS May 2025** (metro file) | "Typical pay here" next to each posting. Flags low-wage postings for review. Covers Milwaukee-Waukesha, Madison, Racine, Kenosha and Janesville-Beloit | Direct zip (XLSX) | Public domain | [occupations-and-wages](occupations-and-wages.md) |
| 4 | **USAJOBS Search API** (`HiringPath=disability`) | The only open, reusable *live* job feed. Shows real Schedule A federal openings near Milwaukee and Madison | Free key + email header | Open license for Public Data | [jobs-and-postings](jobs-and-postings.md) |
| 5 | **JAN A to Z / SOAR** | Trusted accommodation ideas to link from each match ("ideas to discuss with the employer") | Web links (no API) | JAN works are U.S. government works | [accommodations](accommodations.md) |
| 6 | **Madison Metro GTFS** | ERI is in Madison. Second commute-time city. Feed valid through about 2026-12-05 | Direct zip, no key | City of Madison developer license (rider-assistance use) | [transit-gtfs](transit-gtfs.md) |
| 7 | **Census ACS 2020-2024** (B18140, S1810, S1811, C18120) | County context for a specialist or employer dashboard: disability rate, employment gap, earnings gap | Census API, free key | Census API ToS (disclaimer, no re-identification) | [disability-population](disability-population.md) |
| 8 | **Referral directories** (DVR offices, ADRC contacts, Ticket to Work Find Help / WIPA) | Every benefits or eligibility flag must route to people. These are the official places to send them | Web links + public phone lines | Public information | [services-directories](services-directories.md) |

**Honorable mentions:** SSA county SSI and SSDI counts (outreach maps), WisConomy WDA projections (growing jobs), USAspending (Section 503 contractor list for business development).

## How it works: the catalog
| Page | Covers |
| --- | --- |
| [jobs-and-postings.md](jobs-and-postings.md) | USAJOBS API, Job Center of Wisconsin, NLx Research Hub, Wisc.Jobs, city and county boards, Indeed, LinkedIn, Handshake (no scraping) |
| [occupations-and-wages.md](occupations-and-wages.md) | O*NET database and Web Services, BLS OEWS May 2025 area codes, WisConomy projections by WDA, BLS LAUS, BLS API |
| [accommodations.md](accommodations.md) | JAN SOAR, A to Z, Situations & Solutions, reuse terms, ODEP centers (EARN, PEAT, LEAD) |
| [disability-population.md](disability-population.md) | ACS S1810, S1811, C18120, B18140 via the Census API; Cornell disabilitystatistics.org; SSA SSI and OASDI county tables; SSDI annual report; WRC annual reports |
| [transit-gtfs.md](transit-gtfs.md) | GTFS and GTFS-rt for MCTS, Madison, Racine, Janesville (Waukesha and Kenosha unconfirmed); Mobility Database and Transitland; r5py and OpenTripPlanner |
| [employers-and-contractors.md](employers-and-contractors.md) | Section 503 (7% goal rescinded 2026), OFCCP 2026 status, USAspending and SAM.gov APIs, WEDC, library business databases, WOTC |
| [services-directories.md](services-directories.md) | 211 Wisconsin, ADRCs, DVR offices, Family Care MCOs, IRIS, Ticket to Work Find Help (ENs, WIPA, PABSS), USA.gov Benefit Finder |
| [nonprofit-and-funding-data.md](nonprofit-and-funding-data.md) | ProPublica Nonprofit Explorer API, IRS 990 e-file, 990-PF, Candid, Grants.gov extract and Simpler.Grants.gov API, WI DHS and DWD grants |
| [geography.md](geography.md) | TIGER/Line 2026, ZCTA relationship files, HUD USPS crosswalk API, LTSB municipal boundaries, SCO parcels, OpenStreetMap ODbL |

## Caveats and gotchas
- Items marked **(verify)** on each page could not be confirmed from an opened official page on 2026-10-23. Check them before relying on them.
- Feeds expire (Madison GTFS around 2026-12-05, Janesville around 2026-12-10). Data releases land during event week (ACS 2025 1-year is scheduled for 2026-10-29).
- "Public" doesn't mean "open license": MCTS, Madison Metro, JCW, 211 and the library databases all have their own terms.

## How ERI / a hackathon tool should use this
- Download once, precompute small CSVs (occupations, wages by MSA, commute minutes, county context), and load them into MySQL or WordPress. Live APIs are optional extras.
- Put keys in `.env` (`USAJOBS_API_KEY`, `USAJOBS_EMAIL`, `CENSUS_API_KEY`, `HUD_API_TOKEN`). Never commit them.
- Show the source and vintage for every public number, plus any required attribution (O*NET CC BY, Census API disclaimer, MCTS "not sponsored", OSM).
- **Must NOT:** scrape job boards, mix public aggregates with client records, or present estimates as eligibility decisions.

## Related pages
- [../_PAGE_SPEC.md](../_PAGE_SPEC.md)
- [../../prds/02-job-fit-checker.md](../../prds/02-job-fit-checker.md)
- [../../prds/01-funding-gap-finder.md](../../prds/01-funding-gap-finder.md)
- [../../domain/privacy-and-data.md](../../domain/privacy-and-data.md)

## Sources
- [O*NET 31.0 Database](https://www.onetcenter.org/database.html)
- [MCTS Developer Terms and GTFS Feed](https://www.ridemcts.com/policies/developer-terms)
- [BLS OEWS tables](https://www.bls.gov/oes/tables.htm)
- [USAJOBS Developer, GET /api/Search](https://developer.usajobs.gov/api-reference/get-api-Search)
- [JAN A to Z](https://askjan.org/a-to-z.cfm)
- [Census Data API, ACS 5-Year 2024 subject tables](https://api.census.gov/data/2024/acs/acs5/subject)
- [Madison Metro, Information for Developers](https://www.cityofmadison.com/metro/business/information-for-developers)
- [Ticket to Work, Find Help](https://choosework.ssa.gov/findhelp)
