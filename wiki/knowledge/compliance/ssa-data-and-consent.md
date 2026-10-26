---
title: SSA data, consent forms and Ticket Portal security
summary: How SSA-3288 and SSA-827 consents work, what SSA requires of WIPA and Employment Network staff (suitability, PII handling, encryption), and how a tool may touch SSA-derived data.
tags: [ssa, wipa, ticket-to-work, employment-network, consent, ssa-3288, ssa-827, pii, suitability, compliance]
jurisdiction: federal
last_verified: 2026-10-23
next_review: 2027-04-23
review_owner: ERI benefits specialist manager
confidence: medium
sources:
  - title: Form SSA-3288, Consent for Release of Information (04-2026 edition)
    url: https://www.ssa.gov/forms/ssa-3288.pdf
    accessed: 2026-10-23
  - title: SSA, How SSA-827 Meets Requirements for Authorization to Disclose Information
    url: https://www.ssa.gov/disability/professionals/827requirements.htm
    accessed: 2026-10-23
  - title: POMS GN 03305.005 Who May Consent
    url: https://secure.ssa.gov/apps10/POMS.NSF/lnx/0203305005
    accessed: 2026-10-23
  - title: SSA EN Security and Suitability Guide (May 2024)
    url: https://Yourtickettowork.ssa.gov/Assets/docs/information-center/forms/SSA%20EN%20Security%20and%20Suitability%20Guide_May%202024.pdf
    accessed: 2026-10-23
  - title: Ticket to Work, Ticket Portal
    url: https://yourtickettowork.ssa.gov/node/114
    accessed: 2026-10-23
  - title: Ticket to Work, Qualifications to become an Employment Network
    url: https://yourtickettowork.ssa.gov/node/129
    accessed: 2026-10-23
  - title: SSA WIPA Frequently Asked Questions (2013 competition)
    url: https://www.ssa.gov/oag/grants/faq.for.wipa.pdf
    accessed: 2026-10-23
  - title: SSA Information Security and General Privacy Requirements (acquisition clause)
    url: https://www.ssa.gov/oag/acq/SSA%20Information%20Security%20and%20General%20Privacy%20Requirements.pdf
    accessed: 2026-10-23
---

# SSA data, consent forms and Ticket Portal security

## TL;DR
- **SSA-3288** is how a beneficiary lets SSA release their records to ERI, for example benefit amounts or a BPQY-type summary.
  - The current edition is **04-2026** (OMB 0960-0566).
  - It is good for **one-time use** unless the form says otherwise, and lasts **1 year** from signing. Requests for medical records expire after **90 days**.
  - SSA rejects "any and all records" requests.
- **SSA-827** authorizes medical sources to send records **to SSA**. It is valid for **12 months**. It is written to meet HIPAA and 42 CFR Part 2.
- Ticket to Work Employment Network (EN) staff who handle Ticketholder PII must pass **SSA suitability**. Ticket Portal users need a **my Social Security account with extra security**.
- WIPA staff use SSA-issued equipment and SSA's data system. Their award terms carry SSA data-security rules. Those terms are not fully public, so treat SSA's contractor rules (FIPS 140-2 encryption, report incidents **within 1 hour**, US-only storage) as the likely baseline **(verify against ERI's actual WIPA award)**.

## Key facts
| Item | Rule | Source |
|---|---|---|
| SSA-3288 edition | 04-2026, "Discontinue Prior Editions," OMB 0960-0566 | SSA-3288 |
| What 3288 can release | SSN verification, current SSDI or SSI amounts, amounts for a date range, Medicare entitlement, medical records (date range or complete), other named records | SSA-3288 |
| 3288 validity | One-time use unless specified. 1 year from signature. 90 days for medical records | SSA-3288 |
| 3288 minors | A parent or guardian may release only a minor's **non-medical** records, and must explain the best interest | SSA-3288; POMS GN 03305.005 |
| Minors consenting | A minor may consent to their own records if able to decide; age 12 is the baseline, judged case by case | POMS GN 03305.005 |
| Guardians of incompetent adults | Paper only, wet signature, proof of guardianship | POMS GN 03305.005 |
| Electronic consent | Accepted only on SSA-3288-OP1 through SSA's website | POMS GN 03305.005 |
| SSA-827 validity | 12 months from signature. Revocable in writing | SSA-827 page |
| SSA-827 scope | Covers SUD, mental health (not psychotherapy notes), HIV and genetic information. SSA says it won't redisclose SUD information without Part 2 consent | SSA-827 page |
| EN suitability | Required for anyone accessing SSA systems or information. Paperwork goes in 30 business days before work starts. Report an arrest or status change within 1 business day | EN Security and Suitability Guide |
| EN PII | ENs must have "secure systems in place to protect the confidentiality of PII." Staff handling Ticketholder PII need a favorable suitability determination | EN qualifications page |
| EN insurance | At least $500,000 per occurrence | EN qualifications page |
| EN accessibility | ADA-compliant locations and **Section 508-compliant** electronic information | EN qualifications page |
| Sending documents to SSA (EN) | SSA or partner email, GSO account, or a password-protected encrypted attachment | EN Security and Suitability Guide |
| Ticket Portal | Suitability, plus a my Social Security account with extra security | Ticket Portal page |
| WIPA equipment (2013 terms) | Government-issued laptops with two-factor sign-in to the data system (ETO at the time). No thumb drives, no extra software. Destroy beneficiary information at the end of the award | WIPA FAQ |
| SSA contractor baseline | FIPS 140-2 encryption in transit and at rest. Report incidents **≤1 hour** after discovery. US-only storage. NIST SP 800-88 disposal. Confidential information goes only in encrypted attachments from non-SSA email | SSA InfoSec clause |

## How it works
1. **Getting benefit data for WIPA or EN work.** The beneficiary signs an SSA-3288 naming ERI and the specific record types, for example "current monthly SSI payment." Check each box separately and give date ranges. Staff with SSA system access follow their award's rules instead.
2. **Within ERI.** SSA-derived records (benefit amounts, SSN verification, Ticket assignment status) are PII under SSA's rules and under ERI's agreements. They are also often linked to health data.
3. **Ticket Portal.** Only suitability-cleared staff, each with their own extra-security account, may access it. Credentials are never shared.
4. **Sending to SSA.** Use the portal or GSO, or an encrypted attachment with a password sent separately. Never put PII in an email body from ERI's own email system.

## Caveats and gotchas
- The WIPA FAQ opened here is from the **2013** competition. Current WIPA cooperative agreement terms, the data system and the PII rules may differ. The "SSA Information Security and General Privacy Requirements" document is an **acquisition (contract) clause**, and whether it applies word for word to WIPA cooperative agreements is unconfirmed **(verify)**.
- Whether WIPA staff still use SSA-issued laptops and which data system is current were not confirmed **(verify)**.
- Rules on Ticket Portal session limits and credential sharing were not found on the pages opened **(verify the Ticket Program Agreement)**.
- A 3288 from a parent cannot cover a minor's medical records, so youth benefits work needs another route.
- **Questions for ERI's counsel/compliance:**
  1. What PII, incident-reporting and equipment terms are in ERI's current WIPA award and Ticket Program Agreement?
  2. Is the 1-hour reporting rule in ERI's WIPA terms, and who reports?
  3. May WIPA-derived benefits data be shared with ERI's DVR or CCS teams, and under what consent?

## How ERI / a hackathon tool should use this
- **Hackathon:** use synthetic beneficiaries with fake SSNs from the never-issued 900-999 range (for example 9XX-XX-XXXX), and fake benefit amounts. Do not connect to SSA systems or the Ticket Portal, and do not screen-scrape them.
- **Production:**
  - Store SSA-3288 metadata (record types, date range, expiration) and block use after it expires.
  - Mask SSNs everywhere by default.
  - Keep any SSA-system work on SSA-approved equipment only.
  - Encrypt exports to FIPS 140-2 validated standards **(verify the requirement)**.
  - Route incidents to the privacy lead immediately so the 1-hour clock can be met.
- **A tool must NOT:** hold or use Ticket Portal or SSA credentials. It must not send SSA-derived data to AI tools without a confirmed legal basis. It must not use benefits data for purposes the beneficiary didn't consent to.

## Related pages
- [42 CFR Part 2](42-cfr-part-2.md)
- [Web accessibility law and standards](web-accessibility-law-and-standards.md)
- [Wisconsin breach notification](wisconsin-breach-notification.md)
- [Data classification](data-classification-for-eri.md)

## Sources
- [Form SSA-3288 (04-2026)](https://www.ssa.gov/forms/ssa-3288.pdf)
- [SSA, How SSA-827 Meets Requirements](https://www.ssa.gov/disability/professionals/827requirements.htm)
- [POMS GN 03305.005 Who May Consent](https://secure.ssa.gov/apps10/POMS.NSF/lnx/0203305005)
- [SSA EN Security and Suitability Guide (May 2024)](https://Yourtickettowork.ssa.gov/Assets/docs/information-center/forms/SSA%20EN%20Security%20and%20Suitability%20Guide_May%202024.pdf)
- [Ticket to Work, Ticket Portal](https://yourtickettowork.ssa.gov/node/114)
- [Ticket to Work, Qualifications to become an EN](https://yourtickettowork.ssa.gov/node/129)
- [SSA WIPA FAQ (2013)](https://www.ssa.gov/oag/grants/faq.for.wipa.pdf)
- [SSA Information Security and General Privacy Requirements](https://www.ssa.gov/oag/acq/SSA%20Information%20Security%20and%20General%20Privacy%20Requirements.pdf)
