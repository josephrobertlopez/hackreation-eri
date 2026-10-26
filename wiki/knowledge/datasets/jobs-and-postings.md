---
title: Job postings data sources
summary: Where a hackathon job matcher can legally get job postings for southern Wisconsin (USAJOBS API, Job Center of Wisconsin, NLx, Wisc.Jobs, local boards), and which sources forbid scraping.
tags: [datasets, jobs, postings, api, usajobs, nlx, job-center-of-wisconsin, schedule-a]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2026-12-01   # NLx said "check back in November" about its new access model
review_owner: ERI employment services manager
confidence: medium
sources:
  - title: USAJOBS Developer, Quick Start
    url: https://developer.usajobs.gov/general/quick-start
    accessed: 2026-10-23
  - title: USAJOBS Developer, GET /api/Search reference
    url: https://developer.usajobs.gov/api-reference/get-api-Search
    accessed: 2026-10-23
  - title: USAJOBS Developer, Hiring Paths
    url: https://developer.usajobs.gov/General/Hiring-Paths
    accessed: 2026-10-23
  - title: USAJOBS Developer, Terms of Service
    url: https://developer.usajobs.gov/guides/terms-of-service
    accessed: 2026-10-23
  - title: USAJOBS Developer, Rate Limiting
    url: https://developer.usajobs.gov/guides/rate-limiting
    accessed: 2026-10-23
  - title: NASWA, NLx Research Hub
    url: https://www.naswa.org/national-labor-exchange/nlx-research-hub
    accessed: 2026-10-23
  - title: NLx Research Hub, Request NLx Data
    url: https://nlxresearchhub.org/request-nlx-data
    accessed: 2026-10-23
  - title: Job Center of Wisconsin, About Us
    url: https://www.wisconsinjobcenter.org/about/
    accessed: 2026-10-23
  - title: Job Center of Wisconsin, Look for Jobs
    url: https://wisconsinjobcenter.org/lookforjobs/
    accessed: 2026-10-23
  - title: Job Center of Wisconsin, Terms of Use
    url: https://www.wisconsinjobcenter.org/legal/terms.htm
    accessed: 2026-10-23
  - title: Job Center of Wisconsin, RSS feeds
    url: https://jobcenterofwisconsin.com/Services/RSS.aspx
    accessed: 2026-10-23
  - title: Wisc.Jobs flyer (WI Division of Personnel Management)
    url: https://dpm.wi.gov/Documents/2023Wisc.JobsFlyerQRcode.pdf
    accessed: 2026-10-23
  - title: City of Milwaukee, Other Government Employers
    url: https://city.milwaukee.gov/jobs/Other
    accessed: 2026-10-23
  - title: Indeed Terms of Service
    url: https://www.indeed.com/legal
    accessed: 2026-10-23
  - title: Handshake Terms of Service
    url: https://joinhandshake.com/tos
    accessed: 2026-10-23
---

# Job postings data sources

## TL;DR
- The only open, documented, reusable job API that covers Wisconsin is **USAJOBS** (federal jobs). It needs a free key, and `HiringPath=disability` returns announcements open to Schedule A applicants. OPM's terms let you reuse the data, including commercially.
- **Job Center of Wisconsin (JCW, run under DWD)** has no public job-postings API. Its RSS feeds give only posting and resume *statistics*. Link to its search instead of copying listings.
- **NLx Research Hub** paused new data requests in 2026 while it moves to a new access model. Job matching and product development are *not currently authorized* uses. Don't plan on it for Oct 31.
- **Indeed, LinkedIn and Handshake:** do not scrape. Handshake's terms ban crawling and scraping outright. Indeed bans scraping in the program terms we read. LinkedIn blocks automated reads of its own terms page. For the hackathon, use `data/job_postings.csv` (synthetic) plus USAJOBS.

## Key facts
| Dataset | What | Access / API | License / ToS | Refresh | How ERI uses it |
| --- | --- | --- | --- | --- | --- |
| **USAJOBS Search API** | Federal job announcements (title, agency, location, pay, schedule, hiring paths, closing date) | `GET https://data.usajobs.gov/api/Search`. Free key from developer.usajobs.gov/apirequest/. Headers: `Host: data.usajobs.gov`, `User-Agent: <your email>`, `Authorization-Key: <key>`. Code-list endpoints need no key | "Public Data" is under an open license: copy, reformat and redistribute, commercial use OK. Attribution is encouraged, not required. Don't imply OPM endorsement or present altered data as official | Live (announcements open and close daily) | Federal jobs in Milwaukee, Madison and elsewhere, filtered by `HiringPath=disability` (Schedule A) |
| **Job Center of Wisconsin** (jobcenterofwisconsin.com) | Statewide job bank, resume bank, Skill Explorer, WisConomy LMI | Web search only. No job-posting API found. RSS: `RSS.aspx?Topic=JobPostingStatistics` and `?Topic=ResumeStatistics` (statistics only) | DWD terms: content is "AS IS". Employers may not resell or repost resumes. Nothing on scraping either way **(verify with DWD before automating)** | Live | Deep-link job seekers and specialists to JCW searches. Don't copy listings |
| **NLx Research Hub** (NASWA + DirectEmployers) | Real-time and historical postings from employers and state job banks | API or monthly files, **after** a signed Data Use Agreement. New requests paused (2026), "check back in November" | DUA required. Raw postings can't go to third parties. Only aggregates or code can be shared. Currently authorized only for state LMI work and discrete nonprofit research. Job matching, product development and AI training are not currently authorized | Daily (real-time feed), monthly files | Not for the hackathon. Possible later research partnership with DWD LMI |
| **Wisc.Jobs** (wisc.jobs) | State of Wisconsin government jobs | Web portal with account and email alerts. No API documented **(verify)** | Not reviewed **(verify)** | Live | Link to it for state jobs. Many are in Madison |
| **City and county boards** | City of Milwaukee (E-Notify job alerts). Milwaukee County, MPS, MMSD and the State of Wisconsin are "separate employers" with their own application sites | Web only. Dane, Waukesha, Racine, Kenosha and Rock county boards not reviewed **(verify)** | Each site's own terms **(verify)** | Live | A curated link list in the app ("public-sector jobs near you") |
| **Indeed** | Commercial aggregator | Official channels only: Indeed API and Developer Portal (separate API terms) | Smart Sourcing terms: "scraping the database… is strictly prohibited" and resume-extraction software is forbidden. We could not see a general site-wide scraping clause in the text we read **(verify the Site Rules)**. Treat all scraping as off-limits | Live | Don't scrape. A job seeker can paste a link by hand |
| **LinkedIn** | Professional network and jobs | Official partner APIs only **(verify)** | LinkedIn's servers refused our automated read of its User Agreement and help pages (robots disallowed). That alone is a strong signal. Its "prohibited software" page is widely reported to ban scrapers **(verify)** | Live | Don't scrape. Don't use LinkedIn data in demos |
| **Handshake** | Student and early-career jobs via university partners | No public API in the terms we read | Bans accounts created "through… scripts, bots, or automated crawlers" and "collecting content through crawling, scraping, or caching… without our express consent." Also bans using its data to build competing services | Live | Only useful through a school's career center. Not a data source |

## How it works
- **USAJOBS query for Schedule A jobs near Milwaukee:**
  `https://data.usajobs.gov/api/Search?HiringPath=disability&LocationName=Milwaukee,%20Wisconsin&Radius=50&ResultsPerPage=100`
  Other useful parameters: `Keyword`, `PositionScheduleTypeCode` (1 full-time, 2 part-time), `RemoteIndicator`, `DatePosted` (0-60 days), `WhoMayApply=public`, `Fields=full`. Separate multiple values with semicolons.
- USAJOBS limits: 500 rows per page and 10,000 rows per query. The code-list endpoints have no limit.
- The USAJOBS `DISABILITY` hiring path matches announcements whose text mentions "individuals with a disab…" or "Schedule A".
- JCW search is behind its own web UI. Its RSS gives counts, not listings.

## Caveats and gotchas
- USAJOBS covers **federal** jobs only. In southern Wisconsin that means a small pool (VA, USPS, other agencies). Don't oversell it.
- Schedule A eligibility is a federal hiring authority with its own proof-of-disability letter. The app should explain it in plain language and link to the announcement. It must not decide eligibility.
- NLx access rules changed in 2026. Re-check after November 2026.
- We found no DWD statement that JCW feeds NLx. Whether JCW listings flow into NLx is **(verify)**.
- We could not open LinkedIn's terms ourselves. The no-scraping claim for LinkedIn is **(verify)**, though LinkedIn has sued scrapers and blocks bots.
- Wisc.Jobs and the county job boards were not opened beyond what's noted. Their terms are **(verify)**.

## How ERI / a hackathon tool should use this
- **Build on synthetic `data/job_postings.csv`.** Optionally add a live "federal jobs (Schedule A)" panel from USAJOBS. Read the key from `.env` (`USAJOBS_API_KEY`) plus your email as `USAJOBS_EMAIL`. Never commit them.
- Show the USAJOBS source, the retrieval date and a link to the official announcement. Add "not endorsed by OPM."
- **Must NOT:** scrape Indeed, LinkedIn, Handshake or JCW. Store or redistribute NLx raw postings. Submit applications on anyone's behalf. Tell a user they "qualify" for Schedule A.
- For non-federal jobs, deep-link to the JCW, Wisc.Jobs and city or county job pages, and let the specialist paste postings in by hand.

## Related pages
- [occupations-and-wages.md](occupations-and-wages.md): O*NET and OEWS, to enrich postings
- [employers-and-contractors.md](employers-and-contractors.md): federal contractors (Section 503)
- [transit-gtfs.md](transit-gtfs.md): commute time to a posting
- [README.md](README.md): starter kit
- [../../prds/02-job-fit-checker.md](../../prds/02-job-fit-checker.md)

## Sources
- [USAJOBS Developer, Quick Start](https://developer.usajobs.gov/general/quick-start)
- [USAJOBS Developer, GET /api/Search reference](https://developer.usajobs.gov/api-reference/get-api-Search)
- [USAJOBS Developer, Hiring Paths](https://developer.usajobs.gov/General/Hiring-Paths)
- [USAJOBS Developer, Terms of Service](https://developer.usajobs.gov/guides/terms-of-service)
- [USAJOBS Developer, Rate Limiting](https://developer.usajobs.gov/guides/rate-limiting)
- [NASWA, NLx Research Hub](https://www.naswa.org/national-labor-exchange/nlx-research-hub)
- [NLx Research Hub, Request NLx Data](https://nlxresearchhub.org/request-nlx-data)
- [Job Center of Wisconsin, About Us](https://www.wisconsinjobcenter.org/about/)
- [Job Center of Wisconsin, Look for Jobs](https://wisconsinjobcenter.org/lookforjobs/)
- [Job Center of Wisconsin, Terms of Use](https://www.wisconsinjobcenter.org/legal/terms.htm)
- [Job Center of Wisconsin, RSS feeds](https://jobcenterofwisconsin.com/Services/RSS.aspx)
- [Wisc.Jobs flyer (WI DPM)](https://dpm.wi.gov/Documents/2023Wisc.JobsFlyerQRcode.pdf)
- [City of Milwaukee, Other Government Employers](https://city.milwaukee.gov/jobs/Other)
- [Indeed Terms of Service](https://www.indeed.com/legal)
- [Handshake Terms of Service](https://joinhandshake.com/tos)
