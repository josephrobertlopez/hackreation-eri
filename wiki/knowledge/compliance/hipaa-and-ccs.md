---
title: HIPAA and ERI's CCS work
summary: Whether ERI is likely a HIPAA covered entity or business associate through Dane County CCS, and what minimum necessary, BAAs and breach notification mean for any tool that touches CCS data.
tags: [hipaa, ccs, medicaid, privacy, phi, business-associate, breach, compliance]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2027-04-23
review_owner: ERI compliance officer (privacy lead)
confidence: medium
sources:
  - title: 45 CFR 160.103 Definitions (eCFR)
    url: https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-160/subpart-A/section-160.103
    accessed: 2026-10-23
  - title: HHS Minimum Necessary Requirement
    url: https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/minimum-necessary-requirement/index.html
    accessed: 2026-10-23
  - title: HHS Sample Business Associate Agreement Provisions
    url: https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions/index.html
    accessed: 2026-10-23
  - title: HHS Breach Notification Rule
    url: https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html
    accessed: 2026-10-23
  - title: HHS Guidance on HIPAA and Cloud Computing
    url: https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html
    accessed: 2026-10-23
  - title: HHS Guidance on De-identification of PHI
    url: https://www.hhs.gov/hipaa/for-professionals/privacy/special-topics/de-identification/index.html
    accessed: 2026-10-23
  - title: Wisconsin DHS, Comprehensive Community Services Provider Resources
    url: https://www.dhs.wisconsin.gov/ccs/providers.htm
    accessed: 2026-10-23
  - title: Wis. Stat. 51.30 Records
    url: https://docs.legis.wisconsin.gov/statutes/statutes/51/30
    accessed: 2026-10-23
---

# HIPAA and ERI's CCS work

## TL;DR
- HIPAA reaches a **health care provider** only if it **transmits health information electronically in connection with a standard transaction** (for example, a claim). An organization that "furnishes, bills, or is paid for health care" is a provider. Whether ERI is a covered entity depends on **who submits the CCS claims and how**. That is a question for ERI's counsel/compliance, not something this page can settle.
- In Wisconsin, CCS is a **county-run, state-certified program** (Wis. Admin. Code ch. DHS 36) that bills Medicaid. A contracted agency like ERI is most likely either (a) a business associate of Dane County, (b) a provider receiving PHI for treatment, or (c) a covered entity in its own right if it bills electronically. **Treat all CCS data as PHI** whichever answer applies.
- Wisconsin's mental health records law (Wis. Stat. 51.30) applies to CCS treatment records **whatever ERI's HIPAA status**. It requires informed written consent for most releases.
- Any tool that stores CCS data in a cloud service needs a **BAA with that vendor**. HHS says this holds even when the vendor only stores encrypted data and has no key.

## Key facts
| Item | Rule | Citation |
|---|---|---|
| Covered entity (provider) | A provider who transmits health information electronically in connection with a covered transaction | 45 CFR 160.103 |
| Health care provider | Any person or organization that "furnishes, bills, or is paid for health care in the normal course of business" | 45 CFR 160.103 |
| Business associate | A person who creates, receives, maintains or transmits PHI on behalf of a covered entity. Subcontractors of a BA are BAs too | 45 CFR 160.103 |
| Workforce | Employees, volunteers and trainees under the entity's direct control, paid or not | 45 CFR 160.103 |
| Minimum necessary | Limit uses, disclosures and requests to the minimum needed. Does not apply to disclosures for treatment, disclosures to the individual, or uses under an authorization | 45 CFR 164.502(b), 164.514(d) |
| BAA contents | 10 required elements, including safeguards, breach reporting, subcontractor flow-down, and return or destruction at termination | 45 CFR 164.502(e), 164.504(e), 164.308(b) |
| Breach presumption | An impermissible use or disclosure is presumed to be a breach unless a 4-factor risk assessment shows a low probability of compromise | 45 CFR 164.402 |
| Notice to individuals | Without unreasonable delay, **no later than 60 days** after discovery | 45 CFR 164.404 |
| Notice to media | If **more than 500** residents of a state are affected | 45 CFR 164.406 |
| Notice to HHS | 500 or more affected: within 60 days. Fewer than 500: annual log, due within 60 days after calendar year-end | 45 CFR 164.408 |
| BA to covered entity | No later than 60 days after discovery (a BAA can set a shorter deadline) | 45 CFR 164.410 |
| "Secured" PHI | PHI that is encrypted or destroyed per HHS guidance. Only unsecured PHI triggers notification | HHS breach guidance |
| De-identification | Safe Harbor (remove 18 identifiers, with no actual knowledge of re-identification) or Expert Determination | 45 CFR 164.514(b) |
| Wisconsin treatment records | Confidential. Release needs informed written consent, except in listed situations | Wis. Stat. 51.30(4)(a), (2), (4)(b) |

## How it works
**Step 1: Is ERI a covered entity?** The test is about conduct, not organization type. ERI delivers psychosocial rehabilitation, so it is a "health care provider." It becomes a *covered entity* only if it (or a billing agent working for it) sends standard electronic transactions such as 837 claims or eligibility checks. DHS describes CCS as a program that counties and tribes run and DQA certifies. The county program may contract with providers, and the contracted provider must share service documentation for the CCS file. If Dane County submits the Medicaid claims and pays ERI under a contract, ERI may not be a covered entity for that work. If ERI submits claims itself, it likely is.

**Step 2: If not covered, is ERI a business associate?** If ERI creates, receives, maintains or transmits PHI "on behalf of" the county CCS program (documentation, service logs, billing data), it is likely a business associate. Counties often require a BAA from contracted agencies either way. ERI should check its Dane County contract **(verify)**.

**Step 3: Wisconsin law applies either way.** Wis. Stat. 51.30 makes treatment records for mental illness, developmental disabilities, alcoholism or drug dependence confidential. A valid consent must be in writing and name the recipient, the subject, the purpose, the specific information, the effective period and the signing date, and carry a signature. Exceptions without consent include billing and collection, audits and program evaluation, and coordination within county departments. For SUD records, see [42 CFR Part 2](42-cfr-part-2.md).

**Minimum necessary in practice.** Policies must name who in the organization needs access, which categories of PHI each role needs, and on what conditions. Routine disclosures can follow standard protocols. Non-routine ones need individual review. A job developer usually does not need a participant's full diagnosis history.

**BAAs.** Every vendor that stores or processes CCS data for ERI needs a BAA. Cloud vendors are not "conduits," because the conduit exception covers transmission-only services. If ERI is itself a BA, its subcontractors need BAAs that flow down the same terms.

**Breach.** HIPAA has a 60-day outer limit for notice to individuals. BAAs and county contracts may require faster reporting to the county **(verify ERI's contract)**.

## Caveats and gotchas
- "We don't bill Medicaid directly" does not mean "HIPAA doesn't apply." BA status, the county contract and Wis. Stat. 51.30 can each impose obligations. This page does not decide ERI's status. Bring these **questions to ERI's counsel/compliance**:
  1. Who submits CCS claims to ForwardHealth for services ERI delivers: ERI, a billing vendor, or Dane County?
  2. Does ERI's Dane County CCS contract include a BAA, and what is its breach-reporting deadline?
  3. Does ERI conduct any other HIPAA standard transaction electronically, for any program?
  4. Which ERI systems (EHR, email, file share, AI tools) hold CCS data, and does each vendor have a signed BAA?
- Encryption makes PHI "secured" for breach purposes. It does **not** remove the need for a BAA, and it does not by itself satisfy the Security Rule.
- DHS says CCS documentation errors cannot be fixed retroactively. Corrections take effect on the date they are made and must be dated and explained, and backdating is improper. Tools must keep an edit history.
- HHS proposed changes to the HIPAA Security Rule in 2025. Their final status was not confirmed for this page **(verify)**.
- Wisconsin's patient health care records statute (Wis. Stat. 146.81-146.84) may also apply. It was not opened for this page **(verify)**.

## How ERI / a hackathon tool should use this
- **Hackathon:** use **synthetic data only**. Do not put real or "lightly scrubbed" CCS records into any tool, demo or prompt. Data counts as de-identified only if it meets Safe Harbor (all 18 identifiers removed, including dates more specific than the year and ZIP codes beyond the first 3 digits) or has an Expert Determination.
- **Production design requirements** for any tool touching CCS data:
  - The hosting vendor has a signed BAA. Data is encrypted at rest and in transit.
  - Role-based access maps to the minimum-necessary policy, so job developers see employment-relevant fields only.
  - Audit logs record who viewed or changed what, and when.
  - Edits are append-only, with no overwriting of past entries (this matches the DHS correction rule).
  - A consent-tracking field records 51.30 and Part 2 consents with their expiration dates.
  - A breach-response hook tells the privacy lead the same day.
- **A tool must NOT:** send CCS data to consumer AI chat tools, personal email or unapproved cloud storage. It must not export bulk PHI to spreadsheets without a logged purpose. It must not display SUD details to staff who lack a Part 2 need.

## Related pages
- [42 CFR Part 2](42-cfr-part-2.md)
- [Wisconsin breach notification](wisconsin-breach-notification.md)
- [Billing integrity and false claims](billing-integrity-and-false-claims.md)
- [AI use policy](ai-use-policy-for-nonprofits.md)
- [Data classification](data-classification-for-eri.md)

## Sources
- [45 CFR 160.103 Definitions (eCFR)](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-160/subpart-A/section-160.103)
- [HHS Minimum Necessary Requirement](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/minimum-necessary-requirement/index.html)
- [HHS Sample Business Associate Agreement Provisions](https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions/index.html)
- [HHS Breach Notification Rule](https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html)
- [HHS Guidance on HIPAA and Cloud Computing](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html)
- [HHS Guidance on De-identification of PHI](https://www.hhs.gov/hipaa/for-professionals/privacy/special-topics/de-identification/index.html)
- [Wisconsin DHS, CCS Provider Resources](https://www.dhs.wisconsin.gov/ccs/providers.htm)
- [Wis. Stat. 51.30 Records](https://docs.legis.wisconsin.gov/statutes/statutes/51/30)
