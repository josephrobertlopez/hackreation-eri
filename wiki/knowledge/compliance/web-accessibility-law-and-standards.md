---
title: Web accessibility law and standards
summary: WCAG 2.2, the ADA Title II web rule and its 2026 deadline extension, DOJ's Title III position, Section 508, and why ERI's government web and LMS contracts make accessibility a business requirement.
tags: [accessibility, wcag, ada, title-ii, title-iii, section-508, web, lms, contracts]
jurisdiction: federal
last_verified: 2026-10-23
next_review: 2027-01-15
review_owner: ERI web services director
confidence: high
sources:
  - title: Federal Register, Extension of Compliance Dates (Title II web rule IFR), 2026-04-20
    url: https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web
    accessed: 2026-10-23
  - title: ADA.gov Fact Sheet, New Rule on Accessibility of Web Content and Mobile Apps (state and local governments)
    url: https://www.ada.gov/resources/2024-03-08-web-rule/
    accessed: 2026-10-23
  - title: ADA.gov, Guidance on Web Accessibility and the ADA (2022-03-18)
    url: https://www.ada.gov/resources/web-guidance/
    accessed: 2026-10-23
  - title: W3C, Web Content Accessibility Guidelines (WCAG) 2.2
    url: https://www.w3.org/TR/WCAG22/
    accessed: 2026-10-23
  - title: Section508.gov, IT Accessibility Laws and Policies
    url: https://www.section508.gov/manage/laws-and-policies/
    accessed: 2026-10-23
  - title: Ticket to Work, Qualifications to become an Employment Network
    url: https://yourtickettowork.ssa.gov/node/129
    accessed: 2026-10-23
---

# Web accessibility law and standards

## TL;DR
- **ADA Title II web rule** (28 CFR part 35, subpart H; published 2024-04-24). State and local governments must make web content and mobile apps conform to **WCAG 2.1 Level AA**. The standard is 2.1, not 2.2.
- **DOJ moved the deadlines** in an interim final rule effective **2026-04-20**:
  - Governments with 50,000+ residents: **2027-04-26** (was 2026-04-24).
  - Governments under 50,000 and special districts: **2028-04-26** (was 2027-04-26).
- Content a **contractor or vendor posts for a government is not exempt**. ERI's web and LMS work for Wisconsin DHS, counties and UW campuses is therefore inside the rule. Building to WCAG 2.1 AA is a contract-delivery requirement, not an extra.
- **WCAG 2.2** is the current W3C Recommendation (the dated version opened is 2024-12-12). Building to **2.2 AA** covers 2.1 AA except for the removed 4.1.1 Parsing criterion, and is a sensible default.
- **Title III** (private businesses): DOJ's position (2022-03-18 guidance) is that the ADA covers websites. DOJ has not set a technical standard and points to WCAG and Section 508.

## Key facts
| Item | Detail | Source |
|---|---|---|
| Title II rule published | 2024-04-24 | ADA.gov web guidance note; FR |
| Title II standard | WCAG 2.1 Level AA. Equivalent alternatives are allowed if they give the same or greater access | ADA.gov fact sheet |
| IFR | 91 FR 20902, effective 2026-04-20, comments were due 2026-06-22 | Federal Register |
| New dates | 50k+: **2027-04-26**. Under 50k and special districts: **2028-04-26** | IFR; ADA.gov |
| Standard changed? | No. The IFR changed only the dates | IFR |
| Reason given | DOJ overestimated what entities could do, given staffing, remediation automation and litigation exposure | IFR |
| Exceptions | Archived content; preexisting conventional documents (unless used to access services); third-party content not posted for the government; password-protected individualized documents | ADA.gov fact sheet |
| Contractors | Content posted by vendors or contractors for a government is covered | ADA.gov fact sheet |
| Title III | ADA applies to businesses' web offerings. No regulatory standard | ADA.gov guidance (2022) |
| WCAG 2.2 | W3C Recommendation, current dated version 2024-12-12. Adds 9 success criteria (6 at A or AA). Removes 4.1.1 Parsing | W3C |
| Section 508 | Federal agencies' ICT. Revised standards (final 2017-01-18, effective 2018-01-18) harmonized with WCAG 2.0. Contractors are reached through FAR 39.2 procurement | Section508.gov |
| SSA EN requirement | ENs must have Section 508-compliant electronic information | Ticket to Work EN page |

**New in WCAG 2.2 at Level A and AA:**
- 2.4.11 Focus Not Obscured (Minimum)
- 2.5.7 Dragging Movements
- 2.5.8 Target Size (Minimum)
- 3.2.6 Consistent Help
- 3.3.7 Redundant Entry
- 3.3.8 Accessible Authentication (Minimum)

## How it works
- **ERI as a government web vendor.** DHS, Dane County, the City of Madison and UW are Title II entities. When ERI builds or edits their web content, LMS courses or mobile apps, that content must conform by the entity's compliance date. Large entities such as the State of Wisconsin, Dane County and UW campuses fall under the 2027-04-26 date. Expect contracts to require WCAG 2.1 AA (or 2.2 AA), plus conformance reports and remediation warranties.
- **Federal work.** For federal contracts, Section 508 applies through procurement. Agencies ask for an Accessibility Conformance Report (ACR), usually based on the VPAT template **(verify the format each agency wants)**.
- **ERI's own site and tools.** As a private nonprofit open to the public, ERI falls under Title III. As an SSA EN, its electronic information must be Section 508-compliant. Recipients of HHS funding are also subject to the 2024 HHS Section 504 rule, which adopted WCAG 2.1 AA. Its compliance dates (originally 2026-05-11 for recipients with 15+ employees) and any 2026 extension were not confirmed **(verify)**.
- **Wisconsin.** A state IT accessibility policy from the Wisconsin Department of Administration (Division of Enterprise Technology) was not located or opened for this page **(verify)**.

## Caveats and gotchas
- The task brief cited April 2026 and April 2027 deadlines. **Those were replaced** by the 2026-04-20 IFR. Because it is an interim final rule, DOJ could still change it after reviewing comments **(watch)**.
- Moving deadlines doesn't lower contractual or litigation risk. Title II and Title III lawsuits rely on the ADA's general obligations whatever the rule's dates.
- PDFs and LMS course files posted after the compliance date are not "preexisting." Documents people still use to apply for services are never exempt.
- Automated checkers catch only part of WCAG. Manual and assistive-technology testing is still needed.
- WCAG 2.2's original Recommendation date of 2023-10-05 is from the brief. The version opened was the 2024-12-12 update **(verify the original date on the W3C history page)**.

## How ERI / a hackathon tool should use this
- **Every hackathon UI should target WCAG 2.2 AA:**
  - keyboard-only operation
  - visible focus that is not obscured
  - targets of at least 24x24 CSS px
  - text contrast of at least 4.5:1
  - labeled form fields
  - no drag-only interactions
  - no cognitive-test logins
  - captions for any video
- ERI's users include people with disabilities, so accessibility is core to the service, not just compliance.
- **Deliverables:** an accessibility statement, a test log (automated checks plus manual keyboard and screen reader testing), and known issues.
- **A tool must NOT:** rely on "accessibility overlay" widgets as a fix. It must not post inaccessible PDFs for government clients. It must not use CAPTCHA without an accessible alternative.
- **Questions for ERI's counsel/compliance:** What accessibility warranties and indemnities are in ERI's DHS, county and university contracts? Do any name WCAG 2.2 or a date earlier than the rule's?

## Related pages
- [SSA data and consent](ssa-data-and-consent.md)
- [AI use policy](ai-use-policy-for-nonprofits.md)
- [Compliance index](README.md)

## Sources
- [Federal Register, Extension of Compliance Dates (2026-04-20)](https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web)
- [ADA.gov Fact Sheet, Title II web rule](https://www.ada.gov/resources/2024-03-08-web-rule/)
- [ADA.gov, Guidance on Web Accessibility and the ADA](https://www.ada.gov/resources/web-guidance/)
- [W3C, WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Section508.gov, IT Accessibility Laws and Policies](https://www.section508.gov/manage/laws-and-policies/)
- [Ticket to Work, EN qualifications](https://yourtickettowork.ssa.gov/node/129)
