---
title: Service directories for referrals
summary: Where a tool can link people to help in southern Wisconsin: 211 Wisconsin, ADRCs, DVR offices, Family Care MCOs and IRIS agencies, Ticket to Work Find Help (ENs, WIPA, PABSS), and USA.gov Benefit Finder (formerly Benefits.gov).
tags: [datasets, directories, 211, adrc, dvr, family-care, iris, ticket-to-work, wipa, benefits]
jurisdiction: wisconsin
last_verified: 2026-10-23
next_review: 2027-01-15   # Family Care / IRIS regional reconfiguration (DHS P-03225)
review_owner: ERI client services manager
confidence: medium
sources:
  - title: 211 Wisconsin (CommunityOS site)
    url: https://211wisconsin.communityos.org/
    accessed: 2026-10-23
  - title: Wisconsin DHS, ADRC contacts
    url: https://www.dhs.wisconsin.gov/adrc/contacts.htm
    accessed: 2026-10-23
  - title: Wisconsin DVR home page
    url: https://dwd.wisconsin.gov/dvr/
    accessed: 2026-10-23
  - title: Wisconsin DVR office locations
    url: https://dwd.wisconsin.gov/dvr/about/locations.htm
    accessed: 2026-10-23
  - title: Wisconsin DHS, Family Care MCOs
    url: https://www.dhs.wisconsin.gov/familycare/mcos/index.htm
    accessed: 2026-10-23
  - title: Wisconsin DHS, MCO contact information (PDF)
    url: https://www.dhs.wisconsin.gov/familycare/mcocontacts.pdf
    accessed: 2026-10-23
  - title: Wisconsin DHS, IRIS
    url: https://www.dhs.wisconsin.gov/iris/index.htm
    accessed: 2026-10-23
  - title: Ticket to Work, Find Help
    url: https://choosework.ssa.gov/findhelp
    accessed: 2026-10-23
  - title: USAGov Benefit Finder
    url: https://www.usa.gov/benefit-finder?modal=b-welcome-1899
    accessed: 2026-10-23
---

# Service directories for referrals

## TL;DR
- **Link out. Don't copy.** None of these directories offers a public API or an open data license that we could confirm. A tool should deep-link to them and show a few public phone lines.
- **Key public lines:** DVR (800) 442-3477. ADRC statewide 844-WIS-ADRC (844-947-2372). Ticket to Work Help Line 1-866-968-7842 (TTY 1-866-833-2967). WIPA via the Ticket to Work Find Help tool. Wisconsin WIPA 1-877-826-1752 (per the project wiki).
- **DVR waitlist:** "Effective June 2, 2026, DVR will begin serving individuals from its waitlist" (DVR home page).
- **Benefits.gov** now redirects to **USA.gov Benefit Finder** (`usa.gov/benefit-finder`), which has a "Disabilities" category.

## Key facts
| Dataset | What | Access / API | License / ToS | Refresh | How ERI uses it |
| --- | --- | --- | --- | --- | --- |
| **211 Wisconsin** | Statewide information and referral resource database | `211wisconsin.org` redirects to `211wisconsin.communityos.org` (VisionLink CommunityOS). Pages: Data Collection, Privacy, Database Policy (`/inclusion-exclusion-policy`), 211 Counts (`wi.211counts.org`, which failed to load for us). No API mentioned | No data-sharing or reuse terms found **(verify; ask 211 Wisconsin about data-sharing agreements)**. Operator not named on the page **(verify)** | Live | "Other help near you" link. Don't scrape |
| **ADRC directory** (DHS) | 68 ADRC and Tribal ADRS contacts as cards (name, phone, TTY, email, service area, addresses), filterable by county | `dhs.wisconsin.gov/adrc/contacts.htm` (web) | State public information | As DHS updates | Link from benefits and long-term-care flags. Milwaukee 414-289-6874, Dane 608-240-7400, Waukesha 866-677-2372, Racine 866-219-1043, Kenosha 800-472-8008, Rock 855-741-3600 |
| **DVR office locator** | Statewide map of DVR offices, plus a DVR Staff Directory PDF | `dwd.wisconsin.gov/dvr/about/locations.htm`, `…/contacts.htm`. Central office: 201 E. Washington Ave, Madison. (608) 261-0050 / (800) 442-3477 | State public information | As updated | "Apply to DVR" link. The staff directory has individuals' names, so link to it, don't import it |
| **Family Care MCOs** | MCOs with counties served and member-services lines: Anthem, Community Care, iCare, Inclusa, Lakeland Care, My Choice Wisconsin | `dhs.wisconsin.gov/familycare/mcocontacts.pdf`. Region maps P-01790 and P-01789. Reconfiguration timeline P-03225 | State public information | Changes with regional reconfiguration **(verify the P-03225 timeline)** | Explain who manages long-term care supports. Link only |
| **IRIS** (self-directed) | IRIS consultant agencies (ICA) and fiscal employer agents (FEA) | `dhs.wisconsin.gov/iris/ica.htm`, `/iris/fea.htm`. Whether they list agencies by county is **(verify)** | State public information | As updated | Link only |
| **Ticket to Work Find Help** | Directory of Employment Networks (EN), Workforce ENs, VR agencies, **WIPA** projects and **PABSS** | `choosework.ssa.gov/findhelp`. Search by ZIP, filter by provider type and in-person or virtual. No download or API mentioned | Federal site. Disclaimer and privacy pages only | As SSA updates | "Find a benefits counselor (WIPA)" and "Find an EN" buttons. ERI itself may be listed as an EN **(verify)** |
| **USA.gov Benefit Finder** | Federal benefits screener in 12 categories, incl. "Disabilities". Replaces the Benefits.gov URL (redirect seen 2026-10-23) | Web only. No API mentioned | Federal | As updated | Link from a "Other benefits" section |

## How it works
- Most of these are **directories of organizations**. They are public, but they're maintained by others and change often. A stale copy in an app is worse than a link.
- Medicaid long-term care in Wisconsin runs through ADRCs (the front door), then Family Care (MCOs) or IRIS (self-directed).
- The Family Care MCO counties for our six focus counties come from the DHS PDF. Several MCOs serve each county (e.g. Milwaukee: Anthem, Community Care, Inclusa, My Choice Wisconsin).

## Caveats and gotchas
- The DVR waitlist note (June 2, 2026) is from the DVR home page. Check the Order of Selection FAQ (`dvr/policy-guidance/eligibility/oos-faq.htm`) for current category status **(verify)**.
- The MCO list includes **Anthem** for Family Care in Milwaukee and western counties. That's new compared with older lists. Confirm against DHS P-01790.
- 211 data may be licensed under agreements with Inform USA standards or local partners. Ask before reusing it **(verify)**.

## How ERI / a hackathon tool should use this
- Put a static "Get help" panel in the app: DVR, ADRC (county-specific number), WIPA, Ticket to Work Find Help, 211. Show the source and the date checked.
- **Must NOT:** import staff names or emails from DVR or ADRC directories, decide someone's eligibility, or present a referral as an application.

## Related pages
- [../../domain/ssa-work-incentives-2026.md](../../domain/ssa-work-incentives-2026.md)
- [../../domain/dvr-supported-employment.md](../../domain/dvr-supported-employment.md)
- [accommodations.md](accommodations.md)
- [README.md](README.md)

## Sources
- [211 Wisconsin](https://211wisconsin.communityos.org/)
- [DHS ADRC contacts](https://www.dhs.wisconsin.gov/adrc/contacts.htm)
- [Wisconsin DVR](https://dwd.wisconsin.gov/dvr/)
- [DVR office locations](https://dwd.wisconsin.gov/dvr/about/locations.htm)
- [DHS Family Care MCOs](https://www.dhs.wisconsin.gov/familycare/mcos/index.htm)
- [DHS MCO contact information (PDF)](https://www.dhs.wisconsin.gov/familycare/mcocontacts.pdf)
- [DHS IRIS](https://www.dhs.wisconsin.gov/iris/index.htm)
- [Ticket to Work, Find Help](https://choosework.ssa.gov/findhelp)
- [USAGov Benefit Finder](https://www.usa.gov/benefit-finder?modal=b-welcome-1899)
