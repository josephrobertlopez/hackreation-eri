---
title: Compliance, privacy and accessibility index
summary: Index of ERI knowledge pages on privacy (HIPAA, Part 2, FERPA, VR, SSA), breach notification, billing integrity, web accessibility, AI use and data classification, with key dates and the hackathon ground rules.
tags: [index, compliance, privacy, accessibility, hackathon]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2027-01-15
review_owner: ERI compliance officer (privacy lead)
confidence: medium
sources:
  - title: HHS Fact Sheet, 42 CFR Part 2 Final Rule
    url: https://www.hhs.gov/hipaa/for-professionals/regulatory-initiatives/fact-sheet-42-cfr-part-2-final-rule/
    accessed: 2026-10-23
  - title: Federal Register, Title II web rule compliance date extension (2026-04-20)
    url: https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web
    accessed: 2026-10-23
  - title: DVR Service Provider Agreement Terms and Conditions (PDF)
    url: https://www.dwd.wisconsin.gov/dvr/service-providers/agreement-references/pdf/agreement-terms-conditions.pdf
    accessed: 2026-10-23
---

# Compliance, privacy and accessibility index

## TL;DR
- **Hackathon ground rule:** synthetic data only. Never use real participant, student, beneficiary or billing data in code, prompts, demos or screenshots.
- **AI and DVR consumers:** the DVR provider agreement requires **prior written or verbal consumer consent for any AI tool**.
- **Key dates:**
  - Part 2 compliance: 2026-02-16
  - ADA Title II web rule: 2027-04-26 for large entities, 2028-04-26 for small entities and special districts (moved by DOJ's 2026-04-20 IFR)
- These pages explain rules. They do **not** give legal advice. Open questions are framed as **questions for ERI's counsel/compliance**.

## Key facts
| Date or number | What | Page |
|---|---|---|
| 2026-02-16 | 42 CFR Part 2 final rule compliance date | [42-cfr-part-2](42-cfr-part-2.md) |
| 60 days | HIPAA breach notice outer limit | [hipaa-and-ccs](hipaa-and-ccs.md) |
| 45 days | Wisconsin 134.98 notice outer limit | [wisconsin-breach-notification](wisconsin-breach-notification.md) |
| 24 hours | Written incident notice to DVR | [vr-confidentiality](vr-confidentiality-34-cfr-361-38.md) |
| 1 hour | SSA contractor incident reporting (applicability to WIPA: verify) | [ssa-data-and-consent](ssa-data-and-consent.md) |
| 3 years | DVR record retention after final payment | [vr-confidentiality](vr-confidentiality-34-cfr-361-38.md) |
| 60 days | DVR invoice window; Medicaid overpayment return | [billing-integrity](billing-integrity-and-false-claims.md) |
| $14,308-$28,619 | FCA penalty per claim (after 2025-07-03) | [billing-integrity](billing-integrity-and-false-claims.md) |
| 2027-04-26 / 2028-04-26 | Title II web rule (WCAG 2.1 AA) | [web-accessibility](web-accessibility-law-and-standards.md) |
| Age 18 | Transfer of IDEA, FERPA and pupil-records rights in Wisconsin | [ferpa-and-youth-records](ferpa-and-youth-records.md) |

## How it works: pages
1. [HIPAA and CCS](hipaa-and-ccs.md): covered entity vs. business associate, minimum necessary, BAAs, breach.
2. [42 CFR Part 2](42-cfr-part-2.md): SUD records, the 2024 rule, consent, when it reaches ERI.
3. [FERPA and youth records](ferpa-and-youth-records.md): school referrals, IEP consent, the age-18 transfer.
4. [VR confidentiality and DVR vendor rules](vr-confidentiality-34-cfr-361-38.md): 34 CFR 361.38 and the DVR provider agreement (AI consent, cyber, retention, invoicing).
5. [SSA data and consent](ssa-data-and-consent.md): SSA-3288, SSA-827, suitability, Ticket Portal, WIPA data security.
6. [Wisconsin breach notification](wisconsin-breach-notification.md): Wis. Stat. 134.98.
7. [Billing integrity and false claims](billing-integrity-and-false-claims.md): FCA, Wisconsin MA fraud, OIG GCPG, upcoding, compliant tool design.
8. [Web accessibility law and standards](web-accessibility-law-and-standards.md): WCAG 2.2, Title II and III, Section 508.
9. [Draft AI use policy](ai-use-policy-for-nonprofits.md): data limits, BAAs, consent, human review, bias checks, vendor BAA table.
10. [Data classification](data-classification-for-eri.md): data types, governing rules, allowed handling.

## Caveats and gotchas
- ERI's exact HIPAA and Part 2 status depends on its Dane County CCS contract and how its billing flows. That is unconfirmed.
- Several statute pages on docs.legis.wisconsin.gov blocked automated reading (49.49, 946.91, 115.807). Items depending on them are marked **(verify)**.
- Each page lists its own **(verify)** items in its Caveats section.

## How ERI / a hackathon tool should use this
- Start with [Data classification](data-classification-for-eri.md) to tag every data field, then read the program page for each tag.
- Every tool needs: synthetic data in demo mode, human review, audit logging, consent gates, and a WCAG 2.2 AA interface.

## Related pages
- [Knowledge page spec](../_PAGE_SPEC.md)

## Sources
- [HHS Fact Sheet, 42 CFR Part 2 Final Rule](https://www.hhs.gov/hipaa/for-professionals/regulatory-initiatives/fact-sheet-42-cfr-part-2-final-rule/)
- [Federal Register, Title II web rule compliance date extension](https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web)
- [DVR Service Provider Agreement Terms and Conditions (PDF)](https://www.dwd.wisconsin.gov/dvr/service-providers/agreement-references/pdf/agreement-terms-conditions.pdf)
