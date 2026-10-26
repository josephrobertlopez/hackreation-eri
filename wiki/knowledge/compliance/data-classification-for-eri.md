---
title: Data classification for ERI
summary: A table of the data types ERI likely holds, the rule that governs each, and the allowed handling at the hackathon (synthetic only) versus in production.
tags: [data-classification, privacy, phi, pii, sud, ferpa, dvr, ssa, hackathon, security]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2027-04-23
review_owner: ERI compliance officer (privacy lead)
confidence: medium
sources:
  - title: 45 CFR 160.103 Definitions (eCFR)
    url: https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-160/subpart-A/section-160.103
    accessed: 2026-10-23
  - title: 42 CFR Part 2 (eCFR)
    url: https://www.ecfr.gov/current/title-42/chapter-I/subchapter-A/part-2
    accessed: 2026-10-23
  - title: 34 CFR Part 99 (FERPA), eCFR
    url: https://www.ecfr.gov/current/title-34/subtitle-A/part-99
    accessed: 2026-10-23
  - title: 34 CFR 361.38 (eCFR)
    url: https://www.ecfr.gov/current/title-34/subtitle-B/chapter-III/part-361/subpart-B/subject-group-ECFR598a81fff49e46d/section-361.38
    accessed: 2026-10-23
  - title: DVR Service Provider Agreement Terms and Conditions (PDF)
    url: https://www.dwd.wisconsin.gov/dvr/service-providers/agreement-references/pdf/agreement-terms-conditions.pdf
    accessed: 2026-10-23
  - title: SSA Information Security and General Privacy Requirements
    url: https://www.ssa.gov/oag/acq/SSA%20Information%20Security%20and%20General%20Privacy%20Requirements.pdf
    accessed: 2026-10-23
  - title: Wis. Stat. 134.98
    url: https://docs.legis.wisconsin.gov/document/statutes/134.98
    accessed: 2026-10-23
  - title: Wis. Stat. 51.30
    url: https://docs.legis.wisconsin.gov/statutes/statutes/51/30
    accessed: 2026-10-23
  - title: Wis. Stat. 118.125
    url: https://docs.legis.wisconsin.gov/statutes/statutes/118/125
    accessed: 2026-10-23
---

# Data classification for ERI

## TL;DR
- ERI's data falls into four classes. Some records carry rules from several programs at once. **Always apply the strictest rule that touches a record.**
- **At the hackathon, every class except Public is synthetic only.** No real participant data goes into any repo, demo, prompt or screenshot.
- **Production** needs four things for any Restricted or Confidential data: an approved system, a BAA or data agreement where required, consent tracking, and access logging.

## Key facts: classes
| Class | Meaning | Examples |
|---|---|---|
| **R: Restricted** | A program-specific federal or state rule plus breach exposure. Harm if leaked is severe | SUD records, CCS clinical records, SSNs, SSA system data, IEPs |
| **C: Confidential** | Personal data under contract or statute | DVR case data, benefits amounts, employment history, billing |
| **I: Internal** | Non-personal business data | Fee schedules, staffing plans, aggregate counts (n of 11 or more) |
| **P: Public** | Already published | Program descriptions, public rules, this wiki |

## Key facts: data types
| Data type | Likely source | Governing rule(s) | Class | Hackathon | Production needs |
|---|---|---|---|---|---|
| SUD diagnosis or treatment info | CCS, referrals | 42 CFR Part 2; Wis. Stat. 51.30; HIPAA | R | Synthetic only | Part 2 consent tracking, `part2` flag, role limits, QSO or BAA with vendors, separate counseling notes |
| Mental health diagnoses, CCS notes and plans | CCS (Dane County) | HIPAA (as CE or BA, see [page](hipaa-and-ccs.md)); Wis. Stat. 51.30; DHS 36 | R | Synthetic only | BAA-covered host, minimum-necessary roles, append-only edits, audit log |
| CCS billing and service units | CCS | HIPAA; Medicaid rules; FCA and Wis. Stat. 946.91 | R | Synthetic only | Reconciliation against signed documentation, human approval, 60-day overpayment queue |
| SSNs | All programs | Wis. Stat. 134.98; SSA rules; HIPAA identifier | R | Fake 9XX numbers only | Encrypted at rest, masked in UI, never in logs or AI prompts |
| SSA records (benefit amounts, BPQY, Ticket status) | WIPA, EN, SSA-3288 | SSA award or agreement terms; Privacy Act (SSA side); SSA-3288 scope | R/C | Synthetic only | Suitability-cleared staff, consent expiration tracking, encrypted transfer, incident reporting within 1 hour **(verify)** |
| Ticket Portal and SSA system access | EN, WIPA | SSA suitability, extra-security accounts | R | Never | Named accounts only, SSA-approved equipment |
| DVR case data (IRIS number, plans, reports) | DVR | 34 CFR 361.38; DVR Agreement 7.1, 7.3, Att. A | C | Synthetic only | US hosting, full-disk encryption, consumer consent for any AI, 3-year retention then destroy, 24-hour incident notice |
| DVR invoices and POs | DVR | DVR Agreement 9.3; FCA risk **(verify)** | C | Fake POs | 60-day window, certification signed by a human, backup within 15 business days |
| IEPs, evaluations, school referrals | Schools, youth transition | FERPA redisclosure (34 CFR 99.33); IDEA 300.622; Wis. Stat. 118.125 | R | Synthetic only | Consent by the right signer, age-18 re-consent, purpose limits, no forwarding |
| CLTS waiver youth data | County CLTS | Medicaid HCBS; HIPAA or 51.30 as applicable **(verify)** | R | Synthetic only | Same as CCS until counsel decides otherwise |
| Employer contacts and job placements | All employment programs | DVR or SSA consent before disclosing disability status | C | Fake employers | Consent before sharing any participant information with an employer |
| Financial account and card numbers | Payroll, donors | Wis. Stat. 134.98; PCI DSS (industry) | R | Test numbers | Tokenized, never stored in plain text |
| Staff background checks | DVR, SSA | DVR Agreement; SSA suitability | C | None | HR system only |
| University and DHS LMS learner data | Web and LMS contracts | Contract; possibly FERPA "school official" role **(verify)** | C | Synthetic only | Contract-specified hosting and accessibility |
| Aggregated outcomes (n of 11 or more) | Reporting | Program small-cell rules **(verify threshold)** | I | OK if synthetic | Small-cell suppression |

## How it works
1. **Tag at intake.** Every field or document gets a class and a list of rule sources (e.g., `["part2","51.30","hipaa"]`).
2. **The highest class wins.** A DVR report that mentions SUD treatment is Restricted under Part 2, not just Confidential.
3. **Consent is per rule.** Each rule has its own consent: Part 2 consent, 51.30 consent, SSA-3288, FERPA or IDEA consent, DVR written consent, DVR AI consent. One signature rarely covers everything.
4. **Retention follows the longest legal or contract rule.** Destroy securely after that (DVR: 3 years after final payment). SSA requires NIST SP 800-88 disposal.

## Caveats and gotchas
- This table covers *likely* data types. ERI should check it against an actual data inventory **(verify)**.
- Synthetic data must not be derived from real records by swapping names, because indirect identifiers can remain. Generate it from scratch.
- The n of 11 or more small-cell threshold is a common convention, not a rule confirmed for ERI's funders **(verify)**.
- **Questions for ERI's counsel/compliance:** Is this classification correct for ERI's CCS and CLTS roles? Which systems are approved for each class?

## How ERI / a hackathon tool should use this
- Put a `data_class` and a `rules[]` tag on every data model in hackathon code. Reject non-synthetic input in demo mode.
- Use a shared synthetic dataset with obviously fake markers: "FICTIONAL" names, 9XX SSNs, `TEST-` IRIS numbers.
- **A tool must NOT:** mix classes in one export without the stricter controls. It must not log Restricted fields. It must not send any R or C data to unapproved AI or cloud services.

## Related pages
- [HIPAA and CCS](hipaa-and-ccs.md)
- [42 CFR Part 2](42-cfr-part-2.md)
- [FERPA and youth records](ferpa-and-youth-records.md)
- [VR confidentiality](vr-confidentiality-34-cfr-361-38.md)
- [SSA data and consent](ssa-data-and-consent.md)
- [Wisconsin breach notification](wisconsin-breach-notification.md)
- [Billing integrity](billing-integrity-and-false-claims.md)
- [AI use policy](ai-use-policy-for-nonprofits.md)

## Sources
- [45 CFR 160.103 (eCFR)](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-160/subpart-A/section-160.103)
- [42 CFR Part 2 (eCFR)](https://www.ecfr.gov/current/title-42/chapter-I/subchapter-A/part-2)
- [34 CFR Part 99 (eCFR)](https://www.ecfr.gov/current/title-34/subtitle-A/part-99)
- [34 CFR 361.38 (eCFR)](https://www.ecfr.gov/current/title-34/subtitle-B/chapter-III/part-361/subpart-B/subject-group-ECFR598a81fff49e46d/section-361.38)
- [DVR Service Provider Agreement Terms and Conditions (PDF)](https://www.dwd.wisconsin.gov/dvr/service-providers/agreement-references/pdf/agreement-terms-conditions.pdf)
- [SSA Information Security and General Privacy Requirements](https://www.ssa.gov/oag/acq/SSA%20Information%20Security%20and%20General%20Privacy%20Requirements.pdf)
- [Wis. Stat. 134.98](https://docs.legis.wisconsin.gov/document/statutes/134.98)
- [Wis. Stat. 51.30](https://docs.legis.wisconsin.gov/statutes/statutes/51/30)
- [Wis. Stat. 118.125](https://docs.legis.wisconsin.gov/statutes/statutes/118/125)
