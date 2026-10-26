---
title: 42 CFR Part 2 (substance use disorder records)
summary: What the federal SUD confidentiality rule requires after the 2024 final rule (compliance date 2026-02-16), how consent works, and when it may reach ERI's CCS and other work.
tags: [42-cfr-part-2, sud, substance-use, consent, ccs, privacy, hipaa, compliance]
jurisdiction: federal
last_verified: 2026-10-23
next_review: 2027-04-23
review_owner: ERI compliance officer (privacy lead)
confidence: medium
sources:
  - title: HHS Fact Sheet, 42 CFR Part 2 Final Rule
    url: https://www.hhs.gov/hipaa/for-professionals/regulatory-initiatives/fact-sheet-42-cfr-part-2-final-rule/
    accessed: 2026-10-23
  - title: 42 CFR Part 2 (eCFR)
    url: https://www.ecfr.gov/current/title-42/chapter-I/subchapter-A/part-2
    accessed: 2026-10-23
  - title: Wis. Stat. 51.30 Records
    url: https://docs.legis.wisconsin.gov/statutes/statutes/51/30
    accessed: 2026-10-23
  - title: SSA, How SSA-827 Meets Requirements for Authorization to Disclose Information
    url: https://www.ssa.gov/disability/professionals/827requirements.htm
    accessed: 2026-10-23
---

# 42 CFR Part 2 (substance use disorder records)

## TL;DR
- Part 2 protects records that identify a patient of a **federally assisted SUD "program"**. That is an organization that **holds itself out as providing, and provides**, SUD diagnosis, treatment or referral for treatment. It also binds **"lawful holders"**, meaning anyone who receives those records through consent or an exception.
- HHS published the 2024 final rule on 2024-02-08 (fact sheet date). The **compliance date of 2026-02-16 is confirmed** on the HHS fact sheet (updated 2026-01-30).
- The rule moves Part 2 closer to HIPAA:
  - One consent can now cover all future treatment, payment and health care operations (TPO).
  - HIPAA breach notification applies to Part 2 records.
  - HIPAA-style civil and criminal penalties replace the old Part 2 criminal-only penalties.
- What did not change: records **still cannot be used against a patient in legal proceedings** without specific consent or a court order. **SUD counseling notes** need their own separate consent.

## Key facts
| Item | Rule | Citation |
|---|---|---|
| Final rule date | 2024-02-08 (HHS fact sheet header) | HHS fact sheet |
| Effective date | 2024-04-16 **(verify)**, not stated on the fact sheet | 89 FR (Feb. 2024) |
| Compliance date | **2026-02-16** | HHS fact sheet |
| "Program" | A person (other than a general medical facility) that holds itself out as providing, and provides, SUD diagnosis, treatment or referral. Also covers identified SUD units and staff in general medical facilities | 42 CFR 2.11 |
| Federally assisted | Federally conducted, licensed or authorized (e.g., DEA registration), supported (e.g., Medicare or Medicaid participation **(verify scope)**), or tax-assisted | 42 CFR 2.12(b) |
| Lawful holder | Someone bound by Part 2 because they received records through consent with a disclosure notice, or through an exception | 42 CFR 2.11 |
| Qualified service organization (QSO) | A vendor that serves a program (data processing, billing and similar) under a written agreement to be bound by Part 2 | 42 CFR 2.11 |
| SUD counseling notes | A clinician's notes on a private SUD counseling session, kept separate from the record. Need specific consent and cannot ride on a TPO consent | 42 CFR 2.11, 2.31(b) |
| Consent elements | Patient name, discloser, description of the information, recipients, purpose, right to revoke, expiration, signature and date. TPO consents add redisclosure and refusal statements | 42 CFR 2.31 |
| Security | Formal written policies for paper and electronic records covering transfer, destruction, access and de-identification | 42 CFR 2.16 |
| Breach | The HIPAA Breach Notification Rule applies to unsecured Part 2 records | 42 CFR 2.16; HHS fact sheet |
| Segregation | Not required (records do not have to be segmented) | HHS fact sheet |
| Accounting of disclosures | Compliance date deferred until HHS revises the HIPAA accounting rule | HHS fact sheet |

## How it works
1. **Is there a Part 2 program?** Look at what the organization *holds itself out* as doing. A CCS program that advertises and delivers substance use treatment or referral may be one. So may a unit or staff member whose primary function is SUD care. A supported-employment team that only learns about a person's SUD history in passing is usually not a program. However, it may still be a **lawful holder** of records it received.
2. **Does the record identify a patient as having an SUD,** directly or by inference, and did it come from a program? If yes, Part 2 rules attach to it and follow it to every lawful holder.
3. **Consent.** Since 2026-02-16 a patient can sign one consent for all future TPO uses. HIPAA covered entities and BAs that receive records under that consent may redisclose them as HIPAA allows. A consent for use in legal proceedings must be separate. Every disclosure made under a consent must carry a copy of the consent or a clear description of its scope.
4. **Wisconsin adds its own rule.** Wis. Stat. 51.30 covers "alcoholism or drug dependence" treatment records and requires its own written informed consent. The family-member disclosure exception in 51.30(4)(b)20 **does not apply** to alcohol or drug dependence records.
5. **SSA forms.** The SSA-827 is written to satisfy both HIPAA and Part 2 for disclosures to SSA. SSA says it will not redisclose alcohol and drug information without proper Part 2 consent.

## Caveats and gotchas
- **Whether ERI is a Part 2 program or a lawful holder is unconfirmed.** It depends on what ERI's CCS role publicly offers (for example, SUD counseling or recovery services) and what records ERI receives from Dane County. **Questions for ERI's counsel/compliance:**
  1. Does any ERI service hold itself out as SUD diagnosis, treatment or referral?
  2. Does ERI receive SUD-identifying records from Dane County CCS or other providers? Under what consent?
  3. Does ERI have a QSO agreement, or Part 2 terms in a BAA, with each vendor that touches these records?
  4. Do ERI's consent forms meet both 42 CFR 2.31 and Wis. Stat. 51.30(2)?
  5. Has ERI's Notice of Privacy Practices been updated for Part 2? (The rule aligned Part 2's patient notice with HIPAA's NPP.)
- The single TPO consent is **not** a blanket release. It does not cover legal proceedings or SUD counseling notes, and it does not reach recipients outside TPO, such as an employer.
- Peer recovery support is a covered CCS service (DHS). Notes from peer sessions may carry SUD information, so treat them as Part 2 unless counsel says otherwise.
- Under 42 CFR 2.12, how far "federally assisted" reaches through county Medicaid was not fully read for this page **(verify)**.

## How ERI / a hackathon tool should use this
- **Hackathon:** synthetic data only. Do not build demo personas with real SUD histories. Fake ones should be clearly labeled as fictional.
- **Production:**
  - Tag SUD-derived fields with a `part2: true` flag. Hide them from roles without a documented need, such as job developers and benefits staff.
  - Store consent records as structured data: scope, recipients, expiration, revocation date and whether the consent is TPO.
  - Block any disclosure that has no matching valid consent, and log every disclosure.
  - Attach the required notice or consent copy to every outbound disclosure automatically.
- **A tool must NOT:** infer or flag SUD status from other data, for example by AI classification of case notes. It must not include SUD details in employer-facing outputs. It must not mix SUD counseling notes into general case notes or AI summaries.

## Related pages
- [HIPAA and CCS](hipaa-and-ccs.md)
- [SSA data and consent](ssa-data-and-consent.md)
- [AI use policy](ai-use-policy-for-nonprofits.md)
- [Data classification](data-classification-for-eri.md)

## Sources
- [HHS Fact Sheet, 42 CFR Part 2 Final Rule](https://www.hhs.gov/hipaa/for-professionals/regulatory-initiatives/fact-sheet-42-cfr-part-2-final-rule/)
- [42 CFR Part 2 (eCFR)](https://www.ecfr.gov/current/title-42/chapter-I/subchapter-A/part-2)
- [Wis. Stat. 51.30 Records](https://docs.legis.wisconsin.gov/statutes/statutes/51/30)
- [SSA, How SSA-827 Meets Requirements for Authorization to Disclose Information](https://www.ssa.gov/disability/professionals/827requirements.htm)
