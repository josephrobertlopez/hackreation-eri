---
title: AI in hiring, online assessments and disability
summary: How the ADA applies to algorithmic hiring tools and online or timed assessments, the status of the 2022 EEOC and DOJ AI guidance after January 2025, state and city AI hiring laws (NYC, Colorado, Illinois), and design rules for an ERI job-matching tool.
tags: [ai, algorithms, hiring, assessments, ada, accommodation, nyc-ll144, colorado, illinois, tool-design]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2027-01-15
review_owner: ERI technology lead
confidence: medium
sources:
  - title: DOJ, Algorithms, Artificial Intelligence, and Disability Discrimination in Hiring (2022-05-12)
    url: https://www.ada.gov/resources/ai-guidance/
    accessed: 2026-10-23
  - title: 29 CFR Part 1630 (incl. 1630.2(o), 1630.13, 1630.14)
    url: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XIV/part-1630
    accessed: 2026-10-23
  - title: EEOC Enforcement Guidance on Reasonable Accommodation (applicants)
    url: https://www.eeoc.gov/laws/guidance/enforcement-guidance-reasonable-accommodation-and-undue-hardship-under-ada
    accessed: 2026-10-23
  - title: NYC DCWP, Automated Employment Decision Tools
    url: https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page
    accessed: 2026-10-23
  - title: Colorado General Assembly, SB24-205 Consumer Protections for Artificial Intelligence
    url: https://leg.colorado.gov/bills/sb24-205
    accessed: 2026-10-23
---

# AI in hiring, online assessments and disability

## TL;DR
- The ADA applies to hiring tools whether a person or software makes the call. Employers are responsible **even when a vendor built the tool**. Tests must measure **job skills, not impaired sensory, manual or speaking abilities** (DOJ 2022).
- Applicants have a right to **reasonable accommodation in the application process**, including online, video and **timed** assessments, unless it would cause undue hardship (29 CFR 1630.2(o); EEOC).
- The **DOJ's 2022 AI guidance was still posted on ada.gov** when we checked on 2026-10-23. The **EEOC's companion 2022 technical assistance** is widely reported to have been removed from eeoc.gov in January 2025; we could not load it **(verify)**. Removing guidance does not change the ADA itself.
- Multistate employers face local AI laws: **NYC Local Law 144** (bias audits, enforced since 2023-07-05), **Colorado SB24-205** (high-risk AI duties), and **Illinois** laws **(verify)** for Illinois details.

## Key facts
| Item | Rule | Source |
|---|---|---|
| DOJ AI guidance | Dated 2022-05-12; non-binding; still on ada.gov as of 2026-10-23 | ada.gov |
| Who enforces | EEOC for private and federal employers; DOJ for state and local government | ada.gov |
| Vendor tools | Employer responsible for tools from other companies | ada.gov |
| Applicant accommodation | Required for the application process unless undue hardship | 29 CFR 1630.2(o); EEOC 2002 |
| Disability inquiries pre-offer | Prohibited (applies to chatbots, questionnaires, games that elicit medical info) | 29 CFR 1630.13(a) |
| Personality/medical-type tests | A test that is a "medical examination" is barred pre-offer | 29 CFR 1630.13(a) **(verify** application to specific tools) |
| NYC Local Law 144 | Bias audit within 1 year before use; public audit summary; notice to candidates (10 business days); DCWP enforcement from 2023-07-05 | NYC DCWP |
| Colorado SB24-205 | Deployers of high-risk AI: risk management policy, impact assessment, consumer notice; AG enforcement with 60-day cure notice period 2025-07-01 to 2026-06-30 | leg.colorado.gov |
| Colorado effective date | Reported delayed to 2026-06-30 by SB25B-004 **(verify)** | not confirmed |
| Illinois | AI Video Interview Act (820 ILCS 42) and 2024 amendment to the Human Rights Act on AI in employment, effective 2026-01-01 **(verify)** | not opened |

## How it works
**Screen-out.** A tool "screens out" a person with a disability if the disability causes a lower score or rejection, and the person could do the job with or without accommodation. DOJ says tests should measure job skills, or employers should offer accessible alternatives. Illustrative examples (ours, not quoted from the guidance): a video interview scoring speech patterns or eye contact, a game measuring reaction time, a resume filter penalizing employment gaps, a keyboard-only test.

**Accommodation in online assessments.** Applicants can request accommodations such as these (common examples; the right one depends on the person and the test):
- extra time on timed tests, or untimed versions;
- screen-reader-compatible or alternative formats;
- an alternative assessment, such as a live interview or work sample, instead of an automated one;
- permission to use assistive technology;
- a human review of an automated rejection.

DOJ advises employers to tell applicants what technology is used and how they will be evaluated, and to give a clear way to ask for accommodation. EEOC says employers must accommodate the application process even if they doubt they could accommodate the job.

**Medical inquiries by software.** The pre-offer ban on disability questions applies whether a human or a chatbot asks. A tool that asks about health, medications or diagnoses before an offer creates risk.

**Local AI laws.** NYC requires a bias audit within one year before using an automated employment decision tool, a public audit summary, and candidate notice. Colorado's law targets "high-risk" AI that makes consequential decisions; employment decisions are expected to be covered **(verify)**. These laws sit on top of the ADA. They do not replace it.

## Caveats and gotchas
- **Federal guidance changed after January 2025.** E.O. 14173 (2025-01-21) is confirmed in the Federal Register (see [Rehabilitation Act](rehabilitation-act.md)). Later executive orders reportedly told agencies to deprioritize disparate-impact enforcement **(verify)**. **The ADA's screen-out, accommodation and medical-inquiry rules are statutory and still apply.**
- Neither the EEOC nor the DOJ document is binding. Courts decide.
- Wisconsin has no AI-specific hiring law that we found; the WFEA still applies to discriminatory inquiries and tests **(verify)** for 2026 bills.
- Colorado's law has been amended and delayed more than once; recheck before relying on any date.

## How ERI / a hackathon tool should use this
A job-matching or assessment tool built for ERI must:
- **Never use diagnosis, disability type, medications, SSI/SSDI status or benefits as a matching or ranking feature.** Match on skills, interests, preferences, schedule, location, transportation and needed supports, all entered by the job seeker.
- **Never show employers anything medical** without explicit, recorded consent.
- **Avoid proxies**: gaps in work history, typing speed, speech or video analysis, reaction-time games, and "culture fit" scores can screen out people with disabilities.
- **Make every timed element optional or adjustable**, and offer a human alternative.
- **Keep a human in the loop.** The tool suggests; a job developer and the job seeker decide.
- **Be explainable.** Show why a job was suggested in plain language.
- **Log and audit.** Track match rates by group where data is consented, so ERI can spot screen-out. Be cautious about collecting disability data just for auditing.
- **Meet accessibility basics** (WCAG 2.1 AA as a target **(verify)** the standard ERI adopts).
- Route any complaint about an employer's AI tool to the EEOC, the WI ERD, Disability Rights Wisconsin, or an attorney.

## Related pages
- [ADA Title I](ada-title-i.md)
- [Disclosure and accommodation requests](disclosure-and-accommodation-requests.md)
- [Wisconsin Fair Employment Act](wisconsin-fair-employment-act.md)

## Sources
- [DOJ, Algorithms, AI, and Disability Discrimination in Hiring](https://www.ada.gov/resources/ai-guidance/) (accessed 2026-10-23)
- [29 CFR Part 1630](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XIV/part-1630) (accessed 2026-10-23)
- [EEOC Enforcement Guidance on Reasonable Accommodation](https://www.eeoc.gov/laws/guidance/enforcement-guidance-reasonable-accommodation-and-undue-hardship-under-ada) (accessed 2026-10-23)
- [NYC DCWP, Automated Employment Decision Tools](https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page) (accessed 2026-10-23)
- [Colorado SB24-205](https://leg.colorado.gov/bills/sb24-205) (accessed 2026-10-23)
