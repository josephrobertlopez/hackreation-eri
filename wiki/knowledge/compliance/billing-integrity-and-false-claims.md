---
title: Billing integrity and false claims
summary: Federal False Claims Act basics, Wisconsin Medicaid fraud law, DVR invoicing rules, OIG's 2023 General Compliance Program Guidance for small providers, what upcoding means, and a compliant design for a billing-completeness tool.
tags: [false-claims-act, medicaid-fraud, billing, upcoding, oig, compliance-program, dvr, ccs, audit-trail]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2027-07-15
review_owner: ERI finance director with ERI compliance officer
confidence: medium
sources:
  - title: DOJ Civil Division, The False Claims Act
    url: https://www.justice.gov/civil/false-claims-act
    accessed: 2026-10-23
  - title: 28 CFR 85.5 Civil monetary penalty inflation adjustments (eCFR)
    url: https://www.ecfr.gov/current/title-28/chapter-I/part-85/section-85.5
    accessed: 2026-10-23
  - title: HHS-OIG General Compliance Program Guidance (web page)
    url: https://oig.hhs.gov/compliance/general-compliance-program-guidance/
    accessed: 2026-10-23
  - title: HHS-OIG General Compliance Program Guidance (PDF, Nov. 2023)
    url: https://oig.hhs.gov/documents/compliance-guidance/1135/HHS-OIG-GCPG-2023.pdf
    accessed: 2026-10-23
  - title: Wis JI-Criminal 1870, Medical Assistance Fraud (2015)
    url: https://wilawlibrary.gov/jury/files/criminal/1870.pdf
    accessed: 2026-10-23
  - title: 2013 Wisconsin Act 226 (renumbering MA fraud provisions)
    url: https://docs.legis.wisconsin.gov/2013/related/acts/226/28
    accessed: 2026-10-23
  - title: Wisconsin DHS P-02877, Fraud, Waste, and Abuse in Wisconsin Medicaid (01/2021)
    url: https://www.dhs.wisconsin.gov/publications/p02877.pdf
    accessed: 2026-10-23
  - title: Wisconsin DHS P-02790, Provider Self-Audits
    url: https://www.dhs.wisconsin.gov/publications/p02790.pdf
    accessed: 2026-10-23
  - title: Wisconsin DHS, CCS Provider Resources
    url: https://www.dhs.wisconsin.gov/ccs/providers.htm
    accessed: 2026-10-23
  - title: DVR Service Provider Agreement Terms and Conditions (PDF)
    url: https://www.dwd.wisconsin.gov/dvr/service-providers/agreement-references/pdf/agreement-terms-conditions.pdf
    accessed: 2026-10-23
  - title: Information for DVR Vendors and Statewide Service Providers
    url: https://dwd.wisconsin.gov/dvr/service-providers/vendor-service-provider-info.htm
    accessed: 2026-10-23
---

# Billing integrity and false claims

## TL;DR
- The federal **False Claims Act** (31 U.S.C. 3729-3733) makes anyone who *knowingly* submits, or causes someone to submit, a false claim liable for **3x damages plus a per-claim penalty**. The penalty is **$14,308 to $28,619 per claim** for penalties assessed after 2025-07-03. "Knowingly" includes **reckless disregard and deliberate ignorance**, and no intent to defraud is needed. Whistleblowers (qui tam relators) can sue and share in the recovery.
- In Wisconsin, criminal Medical Assistance fraud moved from Wis. Stat. 49.49 to **Wis. Stat. 946.91** under 2013 Wisconsin Act 226 (effective 2014-04-10, per the jury instruction). Intentionally making a false statement of material fact in a Medicaid claim is the core offense. Many of these offenses are **Class H felonies**.
- Medicaid overpayments must be **reported and returned within 60 days** of identification, even if they came from an innocent error (OIG GCPG). Wisconsin DHS OIG accepts **provider self-audits**.
- A billing-completeness tool may help ERI **bill everything it delivered and documented**. It must never help ERI bill for anything it *didn't* deliver and document. Human review and an audit trail are required.

## Key facts
| Item | Rule | Source |
|---|---|---|
| FCA liability | Knowingly presenting a false claim, using a false record material to a claim, conspiracy, or reverse false claims | 31 USC 3729; DOJ |
| "Knowing" | Actual knowledge, deliberate ignorance or reckless disregard. No specific intent required | OIG GCPG II.C |
| FCA penalty | $14,308 to $28,619 per claim (assessed after 2025-07-03), plus 3x damages | 28 CFR 85.5 |
| FCA recoveries | More than $2.9 billion in FY2024 (DOJ, all sectors) | DOJ |
| 60-day rule | Report and repay identified overpayments within 60 days | OIG GCPG II.C |
| WI MA fraud (criminal) | Intentionally making a false statement of material fact in an MA claim, knowing it is false. Payment need not be received | Wis. Stat. 946.91(2)(a); JI-1870 |
| WI renumbering | 49.49 mostly renumbered to 946.91; many offenses Class H felonies with fines up to $25,000 | 2013 Wis. Act 226 |
| WI fraud examples | Billing for services not rendered, **upcoding**, forging or altering documents, kickbacks | DHS P-02877 |
| WI hotline | 877-865-3432 or reportfraud.wisconsin.gov (anonymous allowed) | DHS P-02877 |
| WI self-audit | Choose claims and scope, check each against rules, document the method, return overpayments. Self-audited claims are excluded from later OIG audits | DHS P-02790 |
| CCS documentation | Corrections take effect from the date made and must be dated and explained. No backdating | DHS CCS page |
| DVR invoicing | Within 60 days. Signed certification that the amount "accurately represents hours expended and/or deliverables that were completed," is from the last 60 days (or the PO timeframe) and is unpaid. No double-billing | DVR Agreement 9.3.1-9.3.2 |
| DVR backup | Timecards and payroll on request within 15 business days. DVR may withhold payment during a discrepancy | DVR Agreement 9.3.3, 9.3.7 |
| DVR authorization | No PO, no pay. Services outside the PO dates or scope are not paid | DVR vendor page |
| OIG GCPG | Published 2023-11-06. Voluntary, nonbinding | OIG |

## How it works
**What "upcoding" means.** Upcoding is billing for a more expensive service, code, unit count or rate than the one actually delivered and documented. Examples: billing a longer session than happened, or billing a higher milestone than was reached. (This is a working definition. DHS lists upcoding as fraud without defining it.) Related errors include **unbundling** (splitting one service to bill more), **duplicate billing** and **billing undocumented time**.

**OIG's seven elements (GCPG, 2023):**
1. Written policies and procedures
2. Compliance leadership and oversight
3. Training and education
4. Effective lines of communication and disclosure programs
5. Enforcing standards: consequences and incentives
6. Risk assessment, auditing and monitoring
7. Responding to detected offenses and corrective action

**Small entities (GCPG IV.A).** A small organization may name a **compliance contact** instead of a full compliance officer. Where possible, that person should not do billing or coding, and should not provide legal services. The contact reports at least **quarterly** to the CEO, who is ultimately responsible. Templates and training may come from consultants or associations, but they must be tailored to the organization. Routine monitoring includes **monthly screening against the LEIE and state Medicaid exclusion lists**, plus licensure checks.

## Caveats and gotchas
- Whether DVR fee-for-service invoices, which are paid with federal VR grant funds, are "claims" under the FCA is a legal question. Assume federal-funds billing carries FCA risk **(verify with counsel)**.
- The current text of Wis. Stat. 49.49 and 946.91 could not be opened (blocked to automated reading). Penalty details come from the Act 226 summary and the jury instruction **(verify)**. Whether Wisconsin still has a civil Medicaid false-claims statute with qui tam (formerly 20.931) was not confirmed **(verify)**.
- A tool that *suggests* billable items creates risk. If people accept suggestions without checking them against documentation, ERI may be acting with "reckless disregard."
- **Questions for ERI's counsel/compliance:**
  1. Does ERI have a compliance contact or officer, a written plan, and monthly exclusion screening?
  2. How does ERI find and return overpayments within 60 days?
  3. What do Dane County's CCS contract and DVR audits require for documentation before billing?

## How ERI / a hackathon tool should use this
**A compliant billing-completeness tool:**
1. **Source of truth is the service record.** The tool compares *documented, signed, dated* service entries against authorizations (DVR PO, CCS service plan) and invoices already submitted.
2. **It finds gaps both ways.** It flags documented services that were not billed (missed revenue). It also flags billed items with no documentation, which are possible overpayments to return.
3. **It never creates a billable item.** It cannot write or "complete" notes, back-fill times, or pick a higher code or milestone. Missing documentation goes back to the staff member who delivered the service, and late entries are labeled as late.
4. **A human makes every decision.** A named reviewer approves each flagged item. Invoice certification stays a human signature.
5. **Audit trail.** The tool logs who reviewed what, the rule that fired, the decision, and timestamps. History is append-only.
6. **Built-in checks:** PO date windows, the 60-day DVR invoice limit, duplicates across invoices, units capped at time documented, and staff exclusion status.
7. **Reporting:** a monthly compliance summary to the compliance contact, and an overpayment queue with a 60-day countdown.

**A tool must NOT:**
- Optimize for revenue by suggesting higher codes or milestones.
- Auto-submit claims or invoices.
- Edit or backdate notes.
- Hide flagged overpayments.
- Use AI to generate service documentation after the fact.

**Hackathon:** use synthetic service logs and fake POs. Demo the overpayment flag as prominently as the missed-revenue flag.

## Related pages
- [VR confidentiality and DVR vendor rules](vr-confidentiality-34-cfr-361-38.md)
- [HIPAA and CCS](hipaa-and-ccs.md)
- [AI use policy](ai-use-policy-for-nonprofits.md)
- [Data classification](data-classification-for-eri.md)

## Sources
- [DOJ Civil Division, The False Claims Act](https://www.justice.gov/civil/false-claims-act)
- [28 CFR 85.5 (eCFR)](https://www.ecfr.gov/current/title-28/chapter-I/part-85/section-85.5)
- [HHS-OIG General Compliance Program Guidance (web)](https://oig.hhs.gov/compliance/general-compliance-program-guidance/)
- [HHS-OIG GCPG (PDF, Nov. 2023)](https://oig.hhs.gov/documents/compliance-guidance/1135/HHS-OIG-GCPG-2023.pdf)
- [Wis JI-Criminal 1870 (2015)](https://wilawlibrary.gov/jury/files/criminal/1870.pdf)
- [2013 Wisconsin Act 226](https://docs.legis.wisconsin.gov/2013/related/acts/226/28)
- [Wisconsin DHS P-02877](https://www.dhs.wisconsin.gov/publications/p02877.pdf)
- [Wisconsin DHS P-02790](https://www.dhs.wisconsin.gov/publications/p02790.pdf)
- [Wisconsin DHS, CCS Provider Resources](https://www.dhs.wisconsin.gov/ccs/providers.htm)
- [DVR Service Provider Agreement Terms and Conditions (PDF)](https://www.dwd.wisconsin.gov/dvr/service-providers/agreement-references/pdf/agreement-terms-conditions.pdf)
- [Information for DVR Vendors and Statewide Service Providers](https://dwd.wisconsin.gov/dvr/service-providers/vendor-service-provider-info.htm)
