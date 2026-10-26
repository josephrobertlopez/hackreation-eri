---
title: Workplace accommodation resources (JAN, ODEP)
summary: What the Job Accommodation Network (askjan.org) offers (SOAR accommodation search, A to Z, Situations & Solutions), its public-domain reuse terms, and related ODEP-funded resources.
tags: [datasets, accommodations, jan, odep, ada, earn]
jurisdiction: federal
last_verified: 2026-10-23
next_review: 2027-04-23
review_owner: ERI employment services manager
confidence: medium
sources:
  - title: JAN home page (askjan.org)
    url: https://askjan.org/
    accessed: 2026-10-23
  - title: JAN Accommodation Search (SOAR)
    url: https://askjan.org/soar.cfm
    accessed: 2026-10-23
  - title: JAN A to Z of Disabilities and Accommodations
    url: https://askjan.org/a-to-z.cfm
    accessed: 2026-10-23
  - title: JAN Situations and Solutions Finder
    url: https://askjan.org/sitsol/index.cfm
    accessed: 2026-10-23
  - title: JAN Copyright
    url: https://askjan.org/copyright.cfm
    accessed: 2026-10-23
  - title: JAN Disclaimer
    url: https://askjan.org/disclaimer.cfm
    accessed: 2026-10-23
  - title: ODEP Resources
    url: https://www.dol.gov/agencies/odep/resources
    accessed: 2026-10-23
---

# Workplace accommodation resources (JAN, ODEP)

## TL;DR
- **JAN (askjan.org)** is the main free source of accommodation ideas, funded by DOL's Office of Disability Employment Policy (ODEP). Its phone line is (800) 526-7234.
- Tools: **SOAR / Accommodation Search** (`askjan.org/soar.cfm`), the **A to Z** (by disability, limitation, work-related function, topic or accommodation), and the **Situations & Solutions Finder** (real examples).
- JAN's copyright page says JAN-created works are U.S. government works that "individuals may use… with impunity." Material JAN cites from others may be copyrighted.
- There's **no API or bulk download**. Link to JAN pages, or hand-curate a small mapping table with citations.

## Key facts
| Dataset | What | Access / API | License / ToS | Refresh | How ERI uses it |
| --- | --- | --- | --- | --- | --- |
| **JAN SOAR (Accommodation Search)** | Search box with popular terms (e.g. "ADHD", "Parking") leading to accommodation ideas for work and education | Web only, `askjan.org/soar.cfm`. No API or download found | JAN works are not copyrightable (government work). Third-party content cited by JAN may need permission | Ongoing, no schedule stated | Link to it from "accommodation ideas" in the matcher |
| **JAN A to Z** | Listings by Disability, Limitation (e.g. Lifting, Reading, Noise Sensitivity), Work-Related Function (e.g. Getting to and From Work, Performing Job Tasks, Tolerating Environment), Topic, Accommodation | Web, `askjan.org/a-to-z.cfm`. Print and MyJAN save. No API | Same as above | Ongoing | Build a small hand-made table: limitation → JAN URL |
| **JAN Situations & Solutions Finder** | Real accommodation examples from JAN customer feedback, filterable by disability, limitation and occupation | Web, `askjan.org/sitsol/index.cfm`. "Copy Filters Link" makes shareable URLs. PDF export | Same as above | Ongoing | Specialist prep: example accommodations for an occupation |
| **ODEP-funded centers** | JAN; EARN / AskEARN (employer recruiting, hiring, retention); PEAT (accessible workplace technology); LEAD Center (WIOA policy); CAPE-Youth | Web resources. URLs for PEAT, LEAD and CAPE-Youth not given on the ODEP page **(verify)** | Federal resources, generally public **(verify each site)** | Varies | Employer-facing pitch material (AskEARN), and accessible tech guidance (PEAT) |

## How it works
- The A to Z's **Limitation** and **Work-Related Function** views line up well with O*NET Work Context (e.g. a job high in "standing" pairs with JAN's standing and stamina limitation ideas).
- JAN's own caution: the A to Z is "a starting point" and examples "may not work for every person or workplace." An example doesn't mean a condition is a disability.
- JAN content was prepared under ODEP grant #26475OD000008-01-00. JAN states the opinions don't necessarily reflect DOL policy.

## Caveats and gotchas
- JAN's homepage menu no longer says "SOAR", but `soar.cfm` still works as "Accommodation Search" and calls itself the front end for SOAR.
- The copyright page sets no attribution rule. Cite JAN anyway: it's good practice and helps users find the source.
- We did not review JAN's `robots.txt` or any rate policy. Don't crawl JAN. Link to it, or copy a handful of entries by hand with citations.
- Accommodations are decided in an interactive process between the worker and the employer. A tool can suggest *ideas to discuss*. It can't say what an employer must provide.

## How ERI / a hackathon tool should use this
- In the matcher, when a job has a demanding work-context flag or a seeker lists an accommodation, show "Ideas to discuss" with 1-3 JAN links. Use plain-language labels.
- Keep the mapping in a small CSV (`limitation, jan_url, plain_label`) committed to the team folder. Cite askjan.org.
- **Must NOT:** label a person's disability from their answers, rank people by accommodation need, or tell an employer an accommodation is or isn't "reasonable." Route ADA questions to JAN (800-526-7234) or Disability Rights Wisconsin.

## Related pages
- [occupations-and-wages.md](occupations-and-wages.md): O*NET work context
- [services-directories.md](services-directories.md)
- [../../domain/accessibility.md](../../domain/accessibility.md)
- [README.md](README.md)

## Sources
- [JAN home page](https://askjan.org/)
- [JAN Accommodation Search (SOAR)](https://askjan.org/soar.cfm)
- [JAN A to Z](https://askjan.org/a-to-z.cfm)
- [JAN Situations and Solutions Finder](https://askjan.org/sitsol/index.cfm)
- [JAN Copyright](https://askjan.org/copyright.cfm)
- [JAN Disclaimer](https://askjan.org/disclaimer.cfm)
- [ODEP Resources](https://www.dol.gov/agencies/odep/resources)
