---
title: Disability population and benefits data
summary: County-level counts of people with disabilities, their employment and earnings (Census ACS S1810, S1811, C18120, B18140), SSI and SSDI recipients by Wisconsin county (SSA), Cornell disabilitystatistics.org, and DVR/WRC annual reports.
tags: [datasets, census, acs, disability, ssi, ssdi, ssa, dvr, wrc]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2026-11-15   # ACS 2025 1-year release scheduled 2026-10-29
review_owner: ERI benefits specialist manager
confidence: high
sources:
  - title: Census ACS updates and release schedule
    url: https://census.gov/programs-surveys/acs/news/updates.html
    accessed: 2026-10-23
  - title: Census Data API, ACS 5-Year Subject Tables 2024 (metadata)
    url: https://api.census.gov/data/2024/acs/acs5/subject
    accessed: 2026-10-23
  - title: Census API variables, group S1810 (2024 ACS 5-year)
    url: https://api.census.gov/data/2024/acs/acs5/subject/groups/S1810.html
    accessed: 2026-10-23
  - title: Census API variables, group S1811 (2024 ACS 5-year)
    url: https://api.census.gov/data/2024/acs/acs5/subject/groups/S1811.html
    accessed: 2026-10-23
  - title: Census API variables, group C18120 (2024 ACS 5-year)
    url: https://api.census.gov/data/2024/acs/acs5/groups/C18120.html
    accessed: 2026-10-23
  - title: Census API variables, group B18140 (2024 ACS 5-year)
    url: https://api.census.gov/data/2024/acs/acs5/groups/B18140.html
    accessed: 2026-10-23
  - title: Census Data API User Guide, API key
    url: https://www.census.gov/data/developers/guidance/api-user-guide.API_Key.html
    accessed: 2026-10-23
  - title: Census Data API Terms of Service
    url: https://census.gov/data/developers/terms-of-service.html
    accessed: 2026-10-23
  - title: Cornell Yang-Tan Institute, Disability Statistics
    url: https://www.ilr.cornell.edu/yti/work/disability-statistics
    accessed: 2026-10-23
  - title: SSA, SSI Recipients by State and County, 2025
    url: https://www.ssa.gov/policy/docs/statcomps/ssi_sc/2025/index.html
    accessed: 2026-10-23
  - title: SSA, SSI Recipients by State and County, 2025, Wisconsin (PDF)
    url: https://www.ssa.gov/policy/docs/statcomps/ssi_sc/2025/wi.pdf
    accessed: 2026-10-23
  - title: SSA, OASDI Beneficiaries by State and County, 2025
    url: https://www.ssa.gov/policy/docs/statcomps/oasdi_sc/2025/index.html
    accessed: 2026-10-23
  - title: SSA, OASDI Beneficiaries by State and County, 2025, Wisconsin
    url: https://www.ssa.gov/policy/docs/statcomps/oasdi_sc/2025/wi.html
    accessed: 2026-10-23
  - title: SSA, Annual Statistical Report on the SSDI Program
    url: https://www.ssa.gov/policy/docs/statcomps/di_asr/
    accessed: 2026-10-23
  - title: DVR, Wisconsin Rehabilitation Council annual reports
    url: https://dwd.wisconsin.gov/dvr/partners/wrc/annual-reports.htm
    accessed: 2026-10-23
  - title: WRC 2025 Annual Report (PDF)
    url: https://www.dwd.wi.gov/dvr/partners/wrc/pdf/2025-wrc-annual-report.pdf
    accessed: 2026-10-23
---

# Disability population and benefits data

## TL;DR
- **Census ACS** is the source for "how many people with disabilities, employed, and earning what" by county. The newest 5-year data (2020-2024) came out on 2026-01-29. The **2025 1-year** release is scheduled for **2026-10-29**, two days before the hackathon **(verify it happened)**.
- **SSA county counts (December 2025):** SSI recipients total 107,505 statewide and 39,348 in Milwaukee County. SSDI disabled-worker beneficiaries total 136,029 statewide and 22,785 in Milwaukee County.
- **For county-level counts, use the SSA "OASDI Beneficiaries by State and County"** release. The DI Annual Statistical Report is state-level and national. Its 2025 edition came out in October 2026.
- **DVR (WRC report, FFY 2025):** 33,687 consumers served, 3,429 successful employment outcomes, average hourly wage $17.04 (median $15.00).

## Key facts
| Dataset | What | Access / API | License / ToS | Refresh | How ERI uses it |
| --- | --- | --- | --- | --- | --- |
| **ACS S1810** Disability Characteristics | Population with a disability by sex, age, race and disability type | data.census.gov, or the API at `api.census.gov/data/2024/acs/acs5/subject` (e.g. `S1810_C01_001E` = total civilian noninstitutionalized population) | Census API ToS: show "This product uses the Census Bureau Data API but is not endorsed or certified by the Census Bureau." No re-identification | 1-year every fall (areas 65k+). 5-year each winter | Size of the population per county or tract |
| **ACS S1811** Economic characteristics by disability status | Employment, labor force, earnings, industry and occupation by disability status (age 16+) | Same subject endpoint (`S1811_C01_001E` = population 16+, `S1811_C01_002E` = employed, …) | Same | Same | Employment gap, with vs without disability |
| **ACS C18120** Employment Status by Disability Status | Labor force, employed, unemployed and not in the labor force, with or without a disability | Detailed endpoint `api.census.gov/data/2024/acs/acs5` (`C18120_001E`…`_011E`) **(verify each variable's label before use)** | Same | Same | Simple counts for a dashboard |
| **ACS B18140** Median earnings by disability status by sex | `B18140_001E` total. `_002E` with a disability. `_005E` no disability (16+ with earnings, inflation-adjusted dollars) | Detailed endpoint | Same | Same | "Earnings gap" context |
| **Census Data API key** | Free key | Request at census.gov/data/developers/api-key.html. Append `&key=…`. Limits without a key not confirmed **(verify)** | ToS above | n/a | Put it in `.env` as `CENSUS_API_KEY` |
| **Cornell disabilitystatistics.org** | ACS disability estimates (national, state, county, congressional district), Annual Disability Status Reports, EEOC charge summaries, as maps and tables | Web tool. No API mentioned. Built by the Northeast ADA Center (NIDILRR-funded) | © Cornell University 2026. Reuse terms not stated **(verify)** | Follows ACS releases **(verify)** | Quick sanity checks and ready-made charts |
| **SSA SSI Recipients by State and County, 2025** | December 2025 SSI recipients and payments by county, eligibility category and age | HTML, PDF and Excel: `ssi_sc/2025/wi.html`, `wi.pdf`, `wi.xlsx`. Released August 2026 | U.S. government work **(verify any SSA reuse note)** | Annual | Where SSI recipients are, for outreach planning |
| **SSA OASDI Beneficiaries by State and County, 2025** | December 2025 beneficiaries by county and type, incl. **disabled workers** | `oasdi_sc/2025/wi.html`, `wi.pdf`, `wi.xlsx`. Released August 2026 | Same | Annual | SSDI disabled-worker counts per county |
| **SSA Annual Statistical Report on SSDI, 2025** | National and state DI tables (awards, terminations, demographics, work incentives) | `statcomps/di_asr/`, PDF and Excel. 2025 edition released October 2026 | Same | Annual | State context. The 2024 report put WI DI beneficiaries at 4.2% of people aged 18-64 |
| **DVR / WRC annual reports** | Council findings on DVR: consumers served, outcomes, wages. FFY basis | PDFs for 2023, 2024 and 2025 at dwd.wisconsin.gov/dvr/partners/wrc/ | State publication | Annual (after each FFY) | Statewide outcome benchmarks. No county or WDA counts |

### SSA county counts, December 2025
| County | SSI recipients (total) | SSDI disabled workers |
| --- | --- | --- |
| Wisconsin | 107,505 | 136,029 |
| Milwaukee | 39,348 | 22,785 |
| Dane | 7,204 | 8,640 |
| Waukesha | 3,045 | 6,400 |
| Racine | 5,177 | 5,665 |
| Kenosha | 3,263 | 4,335 |
| Rock | 3,447 | 4,530 |

Sources: SSA `ssi_sc/2025/wi.pdf` (Table 3) and `oasdi_sc/2025/wi.html` (Table 4). People can receive both SSI and SSDI, so **don't add the two columns**.

## How it works
- **Wisconsin FIPS:** state `55`. Counties: Milwaukee `079`, Dane `025`, Waukesha `133`, Racine `101`, Kenosha `059`, Rock `105`.
- **Example call** (5-year, six counties):
  `https://api.census.gov/data/2024/acs/acs5?get=NAME,B18140_001E,B18140_002E,B18140_005E&for=county:079,025,133,101,059,105&in=state:55&key=$CENSUS_API_KEY`
- Each estimate (`E`) has a margin of error (`M`). Show both, or at least warn when the MOE is large (small areas, tracts).
- ACS "disability" covers six difficulty questions (hearing, vision, cognitive, ambulatory, self-care, independent living). It undercounts some groups (e.g. some mental health conditions) **(verify wording against ACS documentation)**.

## Caveats and gotchas
- A 2026-08-06 Census notice said the 2025 1-year release date was "being determined" under Departmental Administrative Order 216-26. The banner now says 2026-10-29. Check again before you cite 2025 figures.
- 1-year ACS covers areas of 65,000+ people only. All six focus counties qualify, but use 5-year data for tracts and small cities.
- SSA tables count people in **current-payment status**. They are not applicants, and not everyone with a disability.
- The WRC report has no county or WDA breakdown. Don't present statewide DVR averages as local.

## How ERI / a hackathon tool should use this
- Use these numbers as **aggregate context only** (dashboards, grant narratives, outreach maps). They never describe an individual.
- Precompute a tiny `county_context.csv` with the six counties, and cite the source and vintage on screen.
- **Must NOT:** combine ACS or SSA aggregates with synthetic client rows to "estimate" anyone's benefits or disability, or present ACS numbers without the Census API disclaimer.

## Related pages
- [geography.md](geography.md): FIPS, tracts, ZCTAs
- [../../domain/ssa-work-incentives-2026.md](../../domain/ssa-work-incentives-2026.md)
- [../../domain/dvr-supported-employment.md](../../domain/dvr-supported-employment.md)
- [README.md](README.md)

## Sources
- [Census ACS updates and release schedule](https://census.gov/programs-surveys/acs/news/updates.html)
- [Census API, ACS 5-Year Subject Tables 2024](https://api.census.gov/data/2024/acs/acs5/subject)
- [Census API group S1810](https://api.census.gov/data/2024/acs/acs5/subject/groups/S1810.html)
- [Census API group S1811](https://api.census.gov/data/2024/acs/acs5/subject/groups/S1811.html)
- [Census API group C18120](https://api.census.gov/data/2024/acs/acs5/groups/C18120.html)
- [Census API group B18140](https://api.census.gov/data/2024/acs/acs5/groups/B18140.html)
- [Census Data API User Guide, API key](https://www.census.gov/data/developers/guidance/api-user-guide.API_Key.html)
- [Census Data API Terms of Service](https://census.gov/data/developers/terms-of-service.html)
- [Cornell Yang-Tan Institute, Disability Statistics](https://www.ilr.cornell.edu/yti/work/disability-statistics)
- [SSA, SSI Recipients by State and County, 2025](https://www.ssa.gov/policy/docs/statcomps/ssi_sc/2025/index.html)
- [SSA, SSI by State and County 2025, Wisconsin PDF](https://www.ssa.gov/policy/docs/statcomps/ssi_sc/2025/wi.pdf)
- [SSA, OASDI Beneficiaries by State and County, 2025](https://www.ssa.gov/policy/docs/statcomps/oasdi_sc/2025/index.html)
- [SSA, OASDI by State and County 2025, Wisconsin](https://www.ssa.gov/policy/docs/statcomps/oasdi_sc/2025/wi.html)
- [SSA, Annual Statistical Report on the SSDI Program](https://www.ssa.gov/policy/docs/statcomps/di_asr/)
- [DVR, WRC annual reports](https://dwd.wisconsin.gov/dvr/partners/wrc/annual-reports.htm)
- [WRC 2025 Annual Report](https://www.dwd.wi.gov/dvr/partners/wrc/pdf/2025-wrc-annual-report.pdf)
