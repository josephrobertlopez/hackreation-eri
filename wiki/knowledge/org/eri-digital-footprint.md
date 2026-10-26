---
title: ERI digital footprint (sites, tech, observed issues)
summary: Inventory of websites ERI owns or builds (main site, Training Center, Before Age 18, Transition Discoveries, Explore Work, national TA sites), the observed tech stack, and visible content issues to fix.
tags: [eri, websites, wordpress, lms, accessibility, hackathon]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2027-01-15
review_owner: ERI senior web developer
confidence: medium
sources:
  - title: ERI - Training and Design (project list)
    url: https://eri-wi.org/training-and-design/
    accessed: 2026-10-23
  - title: ERI home page
    url: https://www.eri-wi.org/
    accessed: 2026-10-23
  - title: ERI Training Center
    url: https://training.eri-wi.org/
    accessed: 2026-10-23
  - title: ERI Training Center - WI DHS CIE page
    url: https://training.eri-wi.org/widhs-cie/
    accessed: 2026-10-23
  - title: Before Age 18
    url: https://beforeage18.org/
    accessed: 2026-10-23
  - title: Transition Discoveries
    url: https://transitiondiscoveries.org/
    accessed: 2026-10-23
  - title: NTACT:C
    url: https://transitionta.org/
    accessed: 2026-10-23
  - title: VRTAC-QE
    url: https://tacqe.com/
    accessed: 2026-10-23
  - title: GW-CRCRE
    url: https://gwcrcre.org/
    accessed: 2026-10-23
---

# ERI digital footprint

## TL;DR
- ERI runs a real in-house web and LMS shop: 6 of 29 listed staff are training, web or graphic design roles. It builds and maintains sites for federal TA centers (NTACT:C, VRTAC-QE, GW-CRCRE/CIT-VR), Wisconsin DHS, and its own youth-transition brands.
- The stack is **WordPress**. The Training Center sits on a multisite install (`sites/13` upload path). Skip links target `#x-main`, which suggests the **Themeco X/Pro theme (likely, not confirmed)**.
- The flagship **ERI Training Center has visible placeholder content**: "Time and Date | $XX" on four paid courses, six lorem-ipsum "Organization Name" cards with "#" links, and 2023 trainings still shown as upcoming.
- One client site has wound down: **VRTAC-QE's grant period has ended**, and its resources stay up "through 2026". That is a revenue line to replace.

## Key facts

| Site | Owner / funder (as stated on site) | ERI role | Observed tech | Status / issues |
|---|---|---|---|---|
| eri-wi.org | ERI | Owner | WordPress (`wp-content/uploads`), Candid widget, site search | Active, (c) 2026. Some deep links return a "redirecting" page to automated fetchers |
| training.eri-wi.org (ERI Training Center) | ERI. DHS-funded CIE courses | Owner | WordPress multisite (`sites/13`), `#x-main` (X/Pro likely), `/courses/` LMS structure, LMS plugin unnamed | "$XX" prices, lorem ipsum, 2023 WIBS / Mental Health Forum dates, duplicated sections |
| training.eri-wi.org/widhs-cie/ | WI DHS CIE initiative | Host | same | Last modified 2023-12-15. Typo "pursing". Generic "Image" alt text. Twitter link |
| beforeage18.org | "Created by Employment Resources, Inc." (funder not named) | Built and maintains | WordPress, `x-main`, OG tags | **Family Transition Planning Tool: 5 questions** produce a custom guide by age, graduation plans, health, benefits status, and family comfort. Mislabeled "Action Steps for Teens" button. `/benefits/` vs `/benefits-and-working/` mismatch |
| transitiondiscoveries.org | **PA Developmental Disabilities Council** grant 1801PABSDD (ACL) | "Powered by ERI" | WordPress, **GTranslate** (English/Spanish), Instagram embed | Active, (c) 2026. 150+ gamified resources, Discovery Cards for sale |
| explore-work.com / .org | Not confirmed | Training, web, enrollment (per ERI) | .org redirects to http://explore-work.com | Content not readable by our fetcher **(verify)** |
| transitionta.org (NTACT:C) | U.S. Dept. of Education grant 8236E250006 | Web dev, maintenance, webinars, accessibility (per ERI) | WordPress, Qualtrics TA form | Active. Footer does not credit ERI |
| tacqe.com (VRTAC-QE) | U.S. Dept. of Education grant H264K200003 | "Designed and managed by ERI" | WordPress, Slider Revolution 7.2.0, mixed http/https links | **Grant ended**. Resources up through 2026. Last modified 2026-02-24 |
| gwcrcre.org / TrainVR.org (CIT-VR) | George Washington University CRCRE | Web, events, enrollment (per ERI) | WordPress, LayerSlider 8.4.1, og:locale en_GB | Active. GW site does not mention ERI |
| promisewi.com, projecte3.com | Wisconsin Promise, Project E3 | "Recent" projects | not checked | Past projects |
| WI ADRC training, WDBN, CIE series | WI DHS | Training materials and LMS | ERI LMS | No public URL for ADRC/WDBN |

## How it works
- ERI sells this work three ways: fee for service, grant collaboration (ERI as subrecipient), and agency contracts (per the Training and Design page).
- One team maintains many WordPress sites. A multisite install lowers hosting cost, but each premium plugin (sliders, LMS, translation) adds patching and licensing work.
- The Training Center doubles as the public storefront for ERI's paid trainings (WIBS, Ticket to Work, WPA, Positive Behavior Supports). Placeholder prices make that storefront unusable for buyers.

## Caveats and gotchas
- Theme and plugin identification is from page markup only. "X/Pro" is inferred from `#x-main` **(verify)**. The LMS plugin is not named **(verify)**.
- The tech-stack observations come from an automated reader. Confirm in wp-admin before planning any upgrade.
- Before Age 18's funder is not named on the home page **(verify)**. Transition Discoveries is Pennsylvania-funded, not Wisconsin-funded.
- Plugin versions (Slider Revolution 7.2.0, LayerSlider 8.4.1) should be checked against current security advisories **(verify)**.
- Don't confuse attribution with ownership. ERI's page lists NTACT:C and GW-CRCRE as clients, but those sites don't name ERI.

## How ERI / a hackathon tool should use this
- **Quick wins:** fix the Training Center placeholders, past dates and lorem ipsum. Add real prices or "contact for pricing". Remove empty "Related Training" cards. Fix the Before Age 18 button and link mismatches. Run an accessibility pass on alt text.
- A hackathon project can export the Before Age 18 5-question logic as an open, documented rules file so other sites can reuse it. ERI must approve and own the content.
- Any new tool should plug into the existing WordPress multisite or run as a static add-on. Don't bring a new stack the 6-person team can't maintain.
- Do NOT scrape or copy client-owned (federal TA center) content into hackathon repos without that client's permission.

## Related pages
- [ERI programs deep dive](eri-programs-deep-dive.md)
- [Hackathon value plan](hackathon-value-plan.md)
- [Consulting brief](consulting-brief.md)

## Sources
- [ERI - Training and Design](https://eri-wi.org/training-and-design/); [ERI home](https://www.eri-wi.org/) (accessed 2026-10-23)
- [ERI Training Center](https://training.eri-wi.org/); [WI DHS CIE page](https://training.eri-wi.org/widhs-cie/) (accessed 2026-10-23)
- [Before Age 18](https://beforeage18.org/); [Transition Discoveries](https://transitiondiscoveries.org/) (accessed 2026-10-23)
- [NTACT:C](https://transitionta.org/); [VRTAC-QE](https://tacqe.com/); [GW-CRCRE](https://gwcrcre.org/) (accessed 2026-10-23)
