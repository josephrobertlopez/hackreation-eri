---
title: VR confidentiality and Wisconsin DVR vendor rules
summary: Federal VR confidentiality (34 CFR 361.38) and the Wisconsin DVR provider agreement terms that bind ERI as a DVR vendor, including cyber security, AI consent, record retention, reporting and invoicing.
tags: [dvr, vocational-rehabilitation, confidentiality, 361-38, vendor, supported-employment, ai, wisconsin, compliance]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2027-01-31
review_owner: ERI DVR services program manager
confidence: high
sources:
  - title: 34 CFR 361.38 Protection, use, and release of personal information (eCFR)
    url: https://www.ecfr.gov/current/title-34/subtitle-B/chapter-III/part-361/subpart-B/subject-group-ECFR598a81fff49e46d/section-361.38
    accessed: 2026-10-23
  - title: DVR Service Provider Agreement Terms and Conditions (PDF)
    url: https://www.dwd.wisconsin.gov/dvr/service-providers/agreement-references/pdf/agreement-terms-conditions.pdf
    accessed: 2026-10-23
  - title: DVR Request for Agreement (RFA)
    url: https://www.dwd.wisconsin.gov/dvr/service-providers/agreement-request.htm
    accessed: 2026-10-23
  - title: Information for DVR Vendors and Statewide Service Providers
    url: https://dwd.wisconsin.gov/dvr/service-providers/vendor-service-provider-info.htm
    accessed: 2026-10-23
  - title: DVR Technical Specifications, Supported Employment
    url: https://dwd.wisconsin.gov/dvr/service-providers/tech-specs/se.htm
    accessed: 2026-10-23
  - title: How To Set-Up and Use DVR's Scanning Methods
    url: https://dwd.wisconsin.gov/dvr/service-providers/scanning-methods.htm
    accessed: 2026-10-23
  - title: DVR Service Agreement Reminders (2025-02-13)
    url: https://www.dwd.wisconsin.gov/dvr/service-providers/announcements/2025/service-agreement-reminders.htm
    accessed: 2026-10-23
---

# VR confidentiality and Wisconsin DVR vendor rules

## TL;DR
- 34 CFR 361.38 binds the **state VR agency** (Wisconsin DVR). DVR may share personal information with service providers only if they **agree not to pass it on** further. DVR passes these duties to vendors through its **Service Provider Agreement**.
- The agreement (section 7.3) bars ERI from releasing any DVR consumer's personal information **without the consumer's prior written consent**. It also says the confidentiality and IT security standards **apply to AI**.
- **Attachment A, item l:** "The use of any AI tool requires the prior written or verbal consent of the DVR consumer." This is the most important rule for hackathon tools.
- Other key terms:
  - Report security incidents to DVR **in writing within 24 hours**.
  - Keep records for **3 years after final payment**, then destroy PII.
  - Store consumer data **in the United States**.
  - Use full-disk encryption and only authorized business email accounts.
  - Invoice within **60 days**, with a signed accuracy certification.

## Key facts
| Item | Rule | Source |
|---|---|---|
| State unit policies | Written confidentiality policies for all personal information, including photos and name lists. Data released only under a written agreement | 34 CFR 361.38(a)(1) |
| Use limit | Use only for purposes directly connected with administering the VR program | 361.38(b) |
| Service providers | DVR may get information from providers who agree not to redisclose except as (c)-(e) allow | 361.38(b) |
| Harmful medical or psych information | Released through a third party the person chooses, not directly | 361.38(c)(2) |
| Audit and research | Only under a written agreement with 5 conditions, and no PII in the final product without consent | 361.38(d) |
| Release to other programs | With informed written consent and a written agreement, limited to what the recipient needs | 361.38(e)(1) |
| Provider confidentiality | No release without the consumer's prior written consent. Report unauthorized disclosures immediately. Duty survives termination | Agreement 7.3 |
| AI | Confidentiality and IT security standards apply to AI. **Any AI tool needs prior written or verbal consumer consent.** AI-held records follow 7.1 and 7.3 | Agreement 7.1, 7.3; Att. A (l), (m) |
| Incident notice | To DVR in writing **within 24 hours**, including any police report | Agreement 7.1 |
| Cyber controls | Full-disk encryption; encryption and security apps on mobile devices; weekly backups; passwords of 8+ characters changed every 90 days; auto-lock (e.g., 5 minutes); authorized business email only | Agreement Att. A (e, g, h, n, p) |
| IT updates | 90 days from notice to meet updated security requirements | Agreement 7.1 |
| Data location | All DVR consumer case data stored in the U.S. | RFA 4.1.3 |
| Retention | 3 years after final payment on a case, then destroy PII "immediately" | Agreement 3.7, 7.1 |
| Audit rights | DVR may inspect during the term and up to 3 years after | Agreement 6.3 |
| Documentation on request | Within 15 business days | Agreement 9.3.3 |
| Invoicing | Within 60 days after service. Signed certification that the amount "accurately represents hours expended" and was not already paid | Agreement 9.3.1, 9.3.2 |
| Authorization first | No purchase order (authorization), no pay. Services outside the PO dates are not paid | Vendor info page |
| Report transmission | Upload in the Service Provider Portal (preferred), then URL upload, fax or email | Scanning methods page |
| Monthly SE reports | Generally due within 5 business days after month-end | SE tech spec |
| Background checks | Once per agreement cycle. Notify DVR within 2 business days of a new arrest or investigation | 2025 reminders; RFA 4.1.5 |
| Insurance | At least $1,000,000 general liability | RFA 4.3.5 |

## How it works
1. DVR issues an **Authorization for Services** (a purchase order) for each consumer and service. ERI does nothing billable before the PO start date.
2. ERI gets consumer information from DVR under the agreement. ERI may use it only to deliver the authorized service.
3. Sharing with employers, a county, CCS or SSA needs the **consumer's prior written consent**. The SE tech spec also says to get consumer permission before contacting employers.
4. Reports go to DVR through the **Service Provider Portal** where possible. Use the specific DVR form for each service and phase (for example, DVR-18212-E for monthly Systematic Instruction).
5. Each invoice carries the accuracy certification. ERI must be able to produce timecards and other backup within 15 business days if asked.
6. Three years after final payment, ERI destroys the consumer's PII, both electronic and paper, in a way that protects confidentiality.

## Caveats and gotchas
- **AI consent is required even for "internal" tools.** Examples include drafting a DVR report with an AI assistant or transcribing a meeting. The agreement treats verbal consent as valid, but ERI should document it. Ask counsel or DVR whether de-identified or synthetic use needs consent at all **(verify)**.
- The agreement PDF shows no revision date. The SE tech spec refers to the **2026-2028** term beginning **2026-07-01**. Confirm that the PDF opened here is the current-term version **(verify)**.
- The agreement does not explicitly require encrypted email. SSA rules do (see [SSA data and consent](ssa-data-and-consent.md)). Prefer the portal.
- Medicaid-eligible services cannot carry cancellation fees (vendor info page).
- **Questions for ERI's counsel/compliance:**
  1. What does ERI's AI consent script and form say, and where is consent recorded?
  2. Which ERI systems hold DVR data, and are they all US-hosted with full-disk encryption?
  3. Who sends the 24-hour incident notice to DVR?

## How ERI / a hackathon tool should use this
- **Hackathon:** synthetic DVR consumers only. A demo that would put *real* DVR data into an AI tool would need documented consent from each consumer, so do not do it.
- **Production:**
  - Add an `ai_consent` field (date, method, staff member) and block AI features for a consumer without it.
  - Check the PO before any billable work.
  - Track report due dates (5 business days after month-end) and the 60-day invoice window.
  - Keep US-only hosting.
  - Run a retention job that flags cases 3 years after final payment for destruction.
- **A tool must NOT:**
  - Run AI on a DVR consumer's data without recorded consent.
  - Generate report content for services that weren't delivered.
  - Auto-submit invoices without human sign-off on the certification.
  - Store DVR data outside the U.S. or in personal email.

## Related pages
- [Billing integrity and false claims](billing-integrity-and-false-claims.md)
- [AI use policy](ai-use-policy-for-nonprofits.md)
- [FERPA and youth records](ferpa-and-youth-records.md)
- [Data classification](data-classification-for-eri.md)

## Sources
- [34 CFR 361.38 (eCFR)](https://www.ecfr.gov/current/title-34/subtitle-B/chapter-III/part-361/subpart-B/subject-group-ECFR598a81fff49e46d/section-361.38)
- [DVR Service Provider Agreement Terms and Conditions (PDF)](https://www.dwd.wisconsin.gov/dvr/service-providers/agreement-references/pdf/agreement-terms-conditions.pdf)
- [DVR Request for Agreement (RFA)](https://www.dwd.wisconsin.gov/dvr/service-providers/agreement-request.htm)
- [Information for DVR Vendors and Statewide Service Providers](https://dwd.wisconsin.gov/dvr/service-providers/vendor-service-provider-info.htm)
- [DVR Technical Specifications, Supported Employment](https://dwd.wisconsin.gov/dvr/service-providers/tech-specs/se.htm)
- [How To Set-Up and Use DVR's Scanning Methods](https://dwd.wisconsin.gov/dvr/service-providers/scanning-methods.htm)
- [DVR Service Agreement Reminders (2025-02-13)](https://www.dwd.wisconsin.gov/dvr/service-providers/announcements/2025/service-agreement-reminders.htm)
