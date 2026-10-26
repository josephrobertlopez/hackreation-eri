# ERI's current digital properties

What ERI runs today, from public pages (Oct 2026). Tech details are **inferred** from page structure, not confirmed by ERI.

| Property | What it is | Tech clues |
| --- | --- | --- |
| [eri-wi.org](https://eri-wi.org) | Main site: services, stories, news, donate, job openings | WordPress; skip-link `#x-main` suggests the **Themeco X / Pro theme** (Cornerstone builder) |
| [training.eri-wi.org](https://training.eri-wi.org/) | ERI Training Center: free and paid courses with certificates (benefits and work, CIE, WIBS initial training) | WordPress **multisite** (`/wp-content/uploads/sites/13/`); course catalog + login; LMS plugin not identified; some placeholder text ("$XX", lorem ipsum) still live |
| [beforeage18.org](https://beforeage18.org) | Turning-18 resources for teens with disabilities and families | WordPress; **Family Transition Planning Tool**: 5 questions (age, graduation plans, health, benefits, comfort level) → custom guide you can print, save or email |
| [transitiondiscoveries.org](https://transitiondiscoveries.org/) | Transition curriculum: 9 topics, 150+ gamified tools, Discovery Cards, EN/ES; built for a Pennsylvania DD Council grant | WordPress + **GTranslate**; accounts; "Powered by Employment Resources Inc." |
| Explore Work (explore-work.com) | Online pre-employment curriculum for youth (2018) | Redirects; not inspected |
| [Wisconsin WIPA](https://eri-wi.org/services/wipa/) | WIPA info and referral: 1-877-826-1752 | Part of main site |
| National TA sites | NTACT:C, GW-CRCRE / CIT-VR, VRTAC-QE, Project E3, Wisconsin Promise | ERI builds and maintains web, webinars, LMS enrollment |
| Social | [Facebook](https://www.facebook.com/eri.wi), [LinkedIn](https://www.linkedin.com/company/employment-resources-inc) | |

## What this tells a hacker
- **ERI is a WordPress shop with multisite.** A plugin, shortcode or block drops straight into their world.
- They already build **interactive tools** (the transition planning tool, gamified curricula). A new tool is a natural fit.
- **Accessibility is core.** Every site has an accessibility policy and skip links. Yours must too.
- No public mobile app was found. Expo is in their skill set but not yet in production (as far as public info shows).
- No public case-management system was found. Billing and case notes live in internal tools we can't see, which is why PRD 01 uses synthetic CSVs.
