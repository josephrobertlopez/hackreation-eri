---
title: Occupations, wages and projections data
summary: O*NET 31.0 (job requirements, abilities, work context), BLS OEWS May 2025 wages for southern Wisconsin metros, DWD WisConomy projections by WDA, and BLS LAUS unemployment, with access and license details.
tags: [datasets, onet, oews, bls, wages, projections, wisconomy, laus, occupations]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2027-04-01   # OEWS May 2026 estimates expected spring 2027; O*NET updates quarterly
review_owner: ERI employment services manager
confidence: high
sources:
  - title: O*NET 31.0 Database (downloads)
    url: https://www.onetcenter.org/database.html
    accessed: 2026-10-23
  - title: O*NET Database Content License
    url: https://onetcenter.org/license_db.html
    accessed: 2026-10-23
  - title: O*NET Resource Center, Developers
    url: https://www.onetcenter.org/developers.html
    accessed: 2026-10-23
  - title: O*NET Web Services, developer sign-up
    url: https://services.onetcenter.org/developer/signup
    accessed: 2026-10-23
  - title: BLS OEWS tables (downloads)
    url: https://www.bls.gov/oes/tables.htm
    accessed: 2026-10-23
  - title: BLS OEWS May 2025 metropolitan and nonmetropolitan area list
    url: https://www.bls.gov/oes/2025/may/oessrcma.htm
    accessed: 2026-10-23
  - title: BLS news release, Occupational Employment and Wages in Kenosha, May 2025
    url: https://www.bls.gov/regions/midwest/news-release/2026/occupationalemploymentandwages_kenosha_20260731.htm
    accessed: 2026-10-23
  - title: BLS Copyright Information
    url: https://www.bls.gov/opub/copyright-information.htm
    accessed: 2026-10-23
  - title: BLS Public Data API features
    url: https://www.bls.gov/bls/api_features.htm
    accessed: 2026-10-23
  - title: BLS API FAQs
    url: https://www.bls.gov/developers/api_faqs.htm
    accessed: 2026-10-23
  - title: BLS LAUS data access
    url: https://www.bls.gov/lau/lausad.htm
    accessed: 2026-10-23
  - title: WisConomy projections
    url: https://www.jobcenterofwisconsin.com/wisconomy/pub/projections
    accessed: 2026-10-23
  - title: WisConomy geography (WDAs and MSAs)
    url: https://www.jobcenterofwisconsin.com/wisconomy/pub/geography
    accessed: 2026-10-23
  - title: WisConomy WDA 1 Southeast page
    url: https://jobcenterofwisconsin.com/wisconomy/pub/wdaSE.htm
    accessed: 2026-10-23
---

# Occupations, wages and projections data

## TL;DR
- **O*NET 31.0** is the current release. It is free to download (Excel or MySQL zip, plus per-file CSV and JSON) under **CC BY 4.0**. Use Work Context, Abilities and Work Activities to describe a job's physical and sensory demands.
- **BLS OEWS May 2025** is the newest wage data (tables page updated 2026-05-15). Metro file: `oesm25ma.zip`. **Kenosha is now its own MSA (area 0028450)**, not part of the Chicago division.
- **WisConomy** publishes 2022-2032 long-term projections for each of the 11 WDAs, and 2024-2034 statewide, as Excel downloads.
- BLS data is public domain. The BLS API v2 needs free registration (500 queries a day).

## Key facts
| Dataset | What | Access / API | License / ToS | Refresh | How ERI uses it |
| --- | --- | --- | --- | --- | --- |
| **O*NET 31.0 Database** | About 1,000 occupations: tasks, skills, abilities (94,640 rows), work context (305,389 rows), work activities, education, tools | Zips: `db_31_0_excel.zip`, `db_31_0_mysql.zip` at onetcenter.org/dl_files/database/. Per-file CSV and JSON, e.g. `db_31_0_csv/work_context.csv`, `db_31_0_csv/abilities.csv`. No full-database text zip is listed | **CC BY 4.0.** Credit "O*NET 31.0 Database" and USDOL/ETA, link the license, and note changes. Say USDOL/ETA hasn't endorsed your changes. Include the "O*NET® is a trademark of USDOL/ETA" notice. Use the version number | Quarterly. The primary update is in Q3 | Map a job title to SOC/O*NET-SOC. Show "standing", "lifting", "noise" and "public contact" levels to match accommodations |
| **O*NET Web Services** | API over the same data, plus keyword search ("cashier" → SOC) | Register at services.onetcenter.org/developer/signup. O*NET staff approve organizations. API keys per project. Current API appears to be v2 **(verify)** | Must agree to ToS and Data License. Show data in a free, public area with no login. Credit and link to O*NET Web Services. Personal use isn't supported. Rate limits not stated **(verify)** | Serves the latest release (31.0) | Title-to-occupation search in the matcher. For the hackathon, the downloaded CSV is simpler |
| **BLS OEWS** (May 2025) | Employment and hourly or annual wage percentiles by SOC and area | `https://www.bls.gov/oes/special-requests/oesm25ma.zip` (metro and nonmetro, XLSX). `oesm25st.zip` (states). Browse at data.bls.gov/oes | Public domain. BLS asks for a citation. BLS logo is trademarked | Annual. May reference period, released in spring. Kenosha release was 2026-07-31 | "Typical pay for this job in Madison": median and 25th percentile next to the posting's wage |
| **WisConomy projections** (DWD) | Long-term industry and occupation projections and "Hot Jobs" | Excel per WDA (2022-2032) and statewide (2024-2034) from each WDA page, e.g. `wisconomy/pub/wdaSE.htm` | DWD site terms. No specific open license stated **(verify)** | Every two years | "Growing jobs in your area" hints for career exploration |
| **BLS LAUS** | Labor force, employment and unemployment rate by state, metro, county and city | Flat files at download.bls.gov/pub/time.series/la/. BLS API v2 (series IDs) | Public domain | Monthly. Annual revisions **(verify schedule)** | Context only, e.g. county unemployment on a dashboard |
| **BLS Public Data API v2** | Time series for LAUS, OEWS and others | Register at data.bls.gov/registrationEngine/. 500 queries a day, 50 series per query, 20 years, 50 requests per 10 seconds. Renew yearly | Public domain data. Developer ToS linked from the API pages **(verify text)** | n/a | Optional. Files are easier for a one-day build |

### OEWS area codes for southern Wisconsin (May 2025)
| Area | OEWS code | Counties (per WisConomy) |
| --- | --- | --- |
| Milwaukee-Waukesha, WI | 0033340 | Milwaukee, Ozaukee, Washington, Waukesha |
| Madison, WI | 0031540 | Columbia, Dane, Green, Iowa |
| Racine-Mount Pleasant, WI | 0039540 | Racine |
| Kenosha, WI | 0028450 | Kenosha |
| Janesville-Beloit, WI | 0027500 | Rock |
| South Central WI nonmetro | 5500003 | Rest of south-central WI **(verify county list)** |

### Wisconsin WDAs (for WisConomy projections)
| WDA | Name | Counties |
| --- | --- | --- |
| 1 | Southeast | Kenosha, Racine, Walworth |
| 2 | Milwaukee | Milwaukee |
| 3 | WOW | Ozaukee, Washington, Waukesha |
| 10 | South Central | Columbia, Dane, Dodge, Jefferson, Marquette, Sauk |
| 11 | Southwest | Grant, Green, Iowa, Lafayette, Richland, Rock |

## How it works
- **Join key:** use the 6-digit SOC code (e.g. `35-3023`). O*NET uses O*NET-SOC (`35-3023.01`), so take the first 7 characters to join to OEWS.
- **O*NET Work Context** gives levels (e.g. "Spend Time Standing", "Sounds, Noise Levels Are Distracting", "Exposed to Hazardous Conditions"). **Abilities** rates levels such as Static Strength, Near Vision and Hearing Sensitivity. These describe the *typical* job, not a specific employer.
- **OEWS** gives mean wages and the 10th, 25th, 50th, 75th and 90th percentiles. Some cells are suppressed (`*`, `**`, `#`). Handle them as missing.

## Caveats and gotchas
- **Kenosha:** older notes put Kenosha in the "Lake County-Kenosha County, IL-WI" metro division (code 29404). The May 2025 OEWS lists **Kenosha, WI MSA 0028450** instead, under the newer OMB delineations **(verify which delineation year)**.
- WisConomy's MSA list says "Racine, WI". BLS names it "Racine-Mount Pleasant, WI". Same area.
- WDA projections are 2022-2032, while statewide projections are already 2024-2034. Don't mix the two vintages in one chart.
- BLS sometimes blocks scripted downloads that lack a descriptive User-Agent (our automated fetch of the zip was refused). Send a User-Agent with your contact email **(verify current BLS policy)**.
- O*NET describes occupations. It must not be used to decide that a *person* "can't" do a job.

## How ERI / a hackathon tool should use this
- Precompute a small `occupations.csv` (SOC, title, median wage per MSA, 3-5 work-context flags). Load it in PHP or MySQL. No live API is needed.
- Show the wage as "typical pay in this area (BLS May 2025)" next to the posting wage. Flag postings below the area's 25th percentile so a specialist can review them.
- Use work-context flags to *suggest accommodations to discuss* (link to JAN), never to filter people out.
- Add the O*NET CC BY attribution text in the app footer.

## Related pages
- [accommodations.md](accommodations.md): JAN, to pair with O*NET demands
- [jobs-and-postings.md](jobs-and-postings.md)
- [disability-population.md](disability-population.md)
- [README.md](README.md)

## Sources
- [O*NET 31.0 Database (downloads)](https://www.onetcenter.org/database.html)
- [O*NET Database Content License](https://onetcenter.org/license_db.html)
- [O*NET Resource Center, Developers](https://www.onetcenter.org/developers.html)
- [O*NET Web Services, developer sign-up](https://services.onetcenter.org/developer/signup)
- [BLS OEWS tables](https://www.bls.gov/oes/tables.htm)
- [BLS OEWS May 2025 area list](https://www.bls.gov/oes/2025/may/oessrcma.htm)
- [BLS, Occupational Employment and Wages in Kenosha, May 2025](https://www.bls.gov/regions/midwest/news-release/2026/occupationalemploymentandwages_kenosha_20260731.htm)
- [BLS Copyright Information](https://www.bls.gov/opub/copyright-information.htm)
- [BLS Public Data API features](https://www.bls.gov/bls/api_features.htm)
- [BLS API FAQs](https://www.bls.gov/developers/api_faqs.htm)
- [BLS LAUS data access](https://www.bls.gov/lau/lausad.htm)
- [WisConomy projections](https://www.jobcenterofwisconsin.com/wisconomy/pub/projections)
- [WisConomy geography](https://www.jobcenterofwisconsin.com/wisconomy/pub/geography)
- [WisConomy WDA 1 Southeast](https://jobcenterofwisconsin.com/wisconomy/pub/wdaSE.htm)
