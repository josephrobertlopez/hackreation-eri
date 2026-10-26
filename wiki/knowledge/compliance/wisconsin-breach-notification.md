---
title: Wisconsin data breach notification (Wis. Stat. 134.98)
summary: What Wisconsin's breach law treats as personal information, who must give notice, the 45-day deadline, and how it fits alongside HIPAA, DVR and SSA reporting duties.
tags: [breach, wisconsin, 134-98, personal-information, incident-response, compliance]
jurisdiction: wisconsin
last_verified: 2026-10-23
next_review: 2027-04-23
review_owner: ERI compliance officer (privacy lead)
confidence: medium
sources:
  - title: Wis. Stat. 134.98 Notice of unauthorized acquisition of personal information
    url: https://docs.legis.wisconsin.gov/document/statutes/134.98
    accessed: 2026-10-23
  - title: Wisconsin DATCP, Wisconsin's Data Breach Notification Law
    url: https://datcp.wi.gov/Pages/Publications/IDTheftDataBreach607.aspx
    accessed: 2026-10-23
  - title: Wisconsin DATCP fact sheet IDTheftDataBreach607 (rev 10/23)
    url: https://datcp.wi.gov/Documents/IDTheftDataBreach607.pdf
    accessed: 2026-10-23
  - title: HHS Breach Notification Rule
    url: https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html
    accessed: 2026-10-23
  - title: DVR Service Provider Agreement Terms and Conditions (PDF)
    url: https://www.dwd.wisconsin.gov/dvr/service-providers/agreement-references/pdf/agreement-terms-conditions.pdf
    accessed: 2026-10-23
  - title: SSA Information Security and General Privacy Requirements
    url: https://www.ssa.gov/oag/acq/SSA%20Information%20Security%20and%20General%20Privacy%20Requirements.pdf
    accessed: 2026-10-23
---

# Wisconsin data breach notification (Wis. Stat. 134.98)

## TL;DR
- Wisconsin's law protects a person's **name** (last name plus first name or initial) **linked to** any one of these elements, unless the element is public, encrypted, redacted or otherwise unreadable:
  - SSN
  - driver's license or state ID number
  - a financial account or card number, with any code or password that gives access
  - a DNA profile
  - biometric data
- An entity that conducts business in Wisconsin and maintains personal information must notify affected people within a **reasonable time, not more than 45 days** after learning of the unauthorized acquisition.
- No notice is needed if the acquisition creates **no material risk of identity theft or fraud**, or if an employee acted in good faith and used the data lawfully.
- 134.98 is **one of several clocks**:
  - HIPAA: 60 days
  - DVR: **24 hours** to DVR in writing
  - SSA contractor rules: **1 hour** to SSA **(verify for ERI's awards)**
  ERI's incident plan must run all of them in parallel.

## Key facts
| Item | Rule | Citation |
|---|---|---|
| Entity | A non-individual that conducts business in Wisconsin and maintains personal information in the ordinary course. Also state government. DATCP adds cities, villages, towns and counties | 134.98(1)(a); DATCP |
| Personal information | Name plus SSN, DL or state ID, financial account number with access code, DNA profile, or biometric data | 134.98(1)(b); DATCP |
| Exclusions | Element is publicly available, or encrypted, redacted or altered to be unreadable | 134.98(1)(b) |
| Trigger | The entity knows personal information "has been acquired" by an unauthorized person | 134.98(2) |
| Deadline | Reasonable time, **not to exceed 45 days** after learning of the acquisition | 134.98(3)(a) |
| Method | Mail, or a method previously used with the person | 134.98(3) |
| Service providers | A non-owner storing the data notifies the owner as soon as practicable (unless a contract says otherwise) | 134.98(2)(bm) **(verify paragraph letter)** |
| Credit bureaus | If 1,000 or more people need notice from one incident, notify the nationwide consumer reporting agencies | 134.98(2)(br) **(verify paragraph letter)** |
| No-risk exception | No material risk of identity theft or fraud | 134.98(2)(cm) |
| Law enforcement delay | Police may ask for a delay. The clock starts when the delay ends | 134.98(5) |
| GLBA exemption | Financial institutions compliant with 15 USC 6801-6827 (with a breach policy) | 134.98(3m)(a) |
| Health care exemption | DATCP: "Certain health plans and health care providers are not covered by Wisconsin's law." The exact statutory text (likely HIPAA-compliant covered entities) was not visible **(verify)** | DATCP |
| Private lawsuits | Noncompliance is not negligence by itself but may be evidence of it. The annotation says there is no private right of action (*Fox v. Iowa Health System*, 2019) | 134.98(4) |
| Local laws | Preempted (cities, villages, towns and counties may not enact their own) | 134.98(6m) |

## How it works
1. **Find out what was exposed.** A name plus an SSN or account number triggers 134.98. Diagnoses or case notes alone do not, but they likely trigger HIPAA, 51.30, Part 2, DVR or SSA duties.
2. **Was it encrypted?** Properly encrypted data falls outside the definition. Keep proof of encryption.
3. **Assess the risk.** Document the "material risk of identity theft or fraud" analysis, whatever the conclusion.
4. **Notify within 45 days** by mail. Tell people, on request, what was taken.
5. **1,000 or more people:** also notify the credit bureaus.
6. **Run the other clocks** at the same time: DVR within 24 hours, SSA within 1 hour if applicable, and the county or covered entity under the BAA. For HIPAA, individuals within 60 days, and HHS and media if 500 or more.

## Caveats and gotchas
- The DATCP page says "more than 1,000"; the statute text read here says "1,000 or more." Follow the statute.
- The health-care exemption in sub. (3m) could not be read in full. Even if it covers ERI's CCS work, it would **not** cover ERI's non-health data, such as employee SSNs, donor card numbers or DVR and WIPA data **(verify with counsel)**.
- Contract clocks are much shorter than 45 days. Missing the DVR 24-hour notice is a contract breach even when no individual notice is owed.
- **Questions for ERI's counsel/compliance:**
  1. Is ERI exempt from 134.98 for any category of data under sub. (3m)?
  2. Does ERI's incident-response plan list every clock (DVR, SSA, county BAA, HIPAA, 134.98) and who owns each one?
  3. Does ERI have cyber insurance with breach-response services?

## How ERI / a hackathon tool should use this
- **Hackathon:** never load real SSNs, card numbers or ID numbers. Use 9XX SSNs and test card numbers.
- **Production:**
  - Encrypt every store that holds SSNs or account numbers, so a lost laptop may fall outside "personal information."
  - Log access so the scope of an incident can be measured.
  - Provide an "incident" button that starts the clocks and notifies the privacy lead.
- **A tool must NOT:** keep SSNs in plain text, in logs or in AI prompts. It must not decide by itself that "no notice is required." That is a documented human decision with counsel.

## Related pages
- [HIPAA and CCS](hipaa-and-ccs.md)
- [VR confidentiality and DVR vendor rules](vr-confidentiality-34-cfr-361-38.md)
- [SSA data and consent](ssa-data-and-consent.md)
- [Data classification](data-classification-for-eri.md)

## Sources
- [Wis. Stat. 134.98](https://docs.legis.wisconsin.gov/document/statutes/134.98)
- [Wisconsin DATCP, Wisconsin's Data Breach Notification Law](https://datcp.wi.gov/Pages/Publications/IDTheftDataBreach607.aspx)
- [Wisconsin DATCP fact sheet (rev 10/23)](https://datcp.wi.gov/Documents/IDTheftDataBreach607.pdf)
- [HHS Breach Notification Rule](https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html)
- [DVR Service Provider Agreement Terms and Conditions (PDF)](https://www.dwd.wisconsin.gov/dvr/service-providers/agreement-references/pdf/agreement-terms-conditions.pdf)
- [SSA Information Security and General Privacy Requirements](https://www.ssa.gov/oag/acq/SSA%20Information%20Security%20and%20General%20Privacy%20Requirements.pdf)
