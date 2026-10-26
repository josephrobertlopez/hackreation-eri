---
title: Draft AI use policy for ERI
summary: A practical draft AI use policy for ERI (data limits, BAAs, DVR consumer consent, human review, disclosure, bias checks), grounded in NIST AI RMF, HHS rules and the DVR provider agreement, plus which AI vendors publish HIPAA BAA terms.
tags: [ai, policy, nist-ai-rmf, hipaa, baa, dvr, bias, governance, hackathon]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2027-01-31
review_owner: ERI executive director with ERI compliance officer
confidence: medium
sources:
  - title: NIST AI Risk Management Framework
    url: https://www.nist.gov/itl/ai-risk-management-framework
    accessed: 2026-10-23
  - title: DVR Service Provider Agreement Terms and Conditions (PDF)
    url: https://www.dwd.wisconsin.gov/dvr/service-providers/agreement-references/pdf/agreement-terms-conditions.pdf
    accessed: 2026-10-23
  - title: HHS Guidance on HIPAA and Cloud Computing
    url: https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html
    accessed: 2026-10-23
  - title: HHS Guidance on De-identification of PHI
    url: https://www.hhs.gov/hipaa/for-professionals/privacy/special-topics/de-identification/index.html
    accessed: 2026-10-23
  - title: 45 CFR 92.210 Nondiscrimination in patient care decision support tools (eCFR)
    url: https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-92/subpart-C/section-92.210
    accessed: 2026-10-23
  - title: 45 CFR 92.1 Effective and compliance dates (eCFR)
    url: https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-92/subpart-A/section-92.1
    accessed: 2026-10-23
  - title: Anthropic, Business Associate Agreements for commercial customers
    url: https://privacy.claude.com/en/articles/8114513-business-associate-agreements-baa-for-commercial-customers
    accessed: 2026-10-23
  - title: OpenAI, How can I get a BAA with OpenAI
    url: https://help.openai.com/en/articles/8660679-how-can-i-get-a-business-associate-agreement-baa-with-openai
    accessed: 2026-10-23
  - title: Google Workspace, HIPAA compliance with Google Workspace and Cloud Identity
    url: https://knowledge.workspace.google.com/admin/compliance/hipaa-compliance-with-google-workspace-and-cloud-identity
    accessed: 2026-10-23
  - title: Microsoft, HIPAA and HITECH offering
    url: https://learn.microsoft.com/en-us/compliance/regulatory/offering-hipaa-hitech
    accessed: 2026-10-23
---

# Draft AI use policy for ERI

> **Status: DRAFT for ERI leadership and counsel review.** It is not legal advice and is not adopted ERI policy.

## TL;DR
- **Default rule:** only **synthetic or properly de-identified data** goes into AI tools. PHI, SUD records, SSNs, school records and DVR case data stay out of AI tools unless all three of these are true: (1) the tool is on an ERI-approved list, (2) a signed **BAA or data agreement** covers that exact product and feature, and (3) every program-specific consent is in place.
- **DVR's provider agreement requires consumer consent for AI.** "The use of any AI tool requires the prior written or verbal consent of the DVR consumer" (Attachment A, item l). This applies *even with* a BAA.
- **A human reviews every AI output** before it reaches a participant, employer, funder or claim. AI never writes service documentation for billing.
- Use **NIST AI RMF 1.0** (released 2023-01-26) and its Generative AI Profile (NIST AI 600-1, 2024-07-26) as the governance frame: **Govern, Map, Measure, Manage**.

## Key facts
| Item | Detail | Source |
|---|---|---|
| NIST AI RMF 1.0 | 2023-01-26, voluntary. Being revised under the White House AI Action Plan | NIST |
| GenAI Profile | NIST AI 600-1, 2024-07-26 | NIST |
| Cloud vendors and PHI | A vendor storing PHI is a business associate even if the data is encrypted and it has no key. A BAA is required | HHS cloud guidance |
| De-identification | Safe Harbor (18 identifiers) or Expert Determination | 45 CFR 164.514(b) |
| Section 1557 AI rule | Covered entities must identify and mitigate discrimination risk from patient care decision support tools. Compliance within 300 days of 2024-07-05 (about 2025-05-01) | 45 CFR 92.210, 92.1 |
| DVR AI rules | Prior written or verbal consumer consent. AI-held records must meet agreement sections 7.1 (security) and 7.3 (confidentiality) | DVR Agreement Att. A (l), (m) |

**Vendor BAA availability (from vendor pages opened 2026-10-23; recheck before relying on it):**

| Vendor | BAA offered? | Scope notes |
|---|---|---|
| Anthropic (Claude) | Yes | First-party API and Claude Enterprise **with the HIPAA configuration enabled**. Many features are excluded (e.g., Console, mobile app, connectors/MCP, Files and Batch API, web fetch). Team plan not addressed. Consumer plans not covered |
| OpenAI | API only | API BAA after review, limited to zero-data-retention-eligible endpoints. "We do not offer a BAA for ChatGPT" at present |
| Google Workspace | Yes | Accepted in the Admin console. Covers "HIPAA Included Functionality," including some Gemini-in-Workspace features. The Gemini app and NotebookLM are not named on the page **(verify)** |
| Microsoft | Yes | Through the Online Services DPA, by default. In-scope services listed include Microsoft 365 services, Copilot and Copilot Chat (Commercial and GCC). Azure OpenAI not named explicitly **(verify)** |

## How it works (draft policy text)
1. **Scope.** This policy covers all staff, contractors, volunteers and hackathon participants, and any AI tool, including features built into other software.
2. **Approved tools.** IT and compliance keep a list showing each tool's allowed data class (see [Data classification](data-classification-for-eri.md)). Unlisted tools may be used with **public or synthetic data only**.
3. **Data rules:**
   - Never enter SSNs, Medicaid IDs, diagnoses, SUD information, IEP content or DVR case data into a consumer AI product (free or personal accounts).
   - For confidential data, use only an approved enterprise tool with a BAA or data agreement, with retention settings checked and the covered features confirmed.
   - Program consents apply on top: DVR AI consent, 42 CFR Part 2, Wis. Stat. 51.30 and FERPA redisclosure limits.
4. **Consent and transparency.** Record DVR consumer AI consent (date, method, staff member). Tell participants when AI helped produce something that affects them. Never present AI output as a human's words.
5. **Human review.** A qualified staff member checks every AI-assisted output for accuracy, tone and privacy before use. **Prohibited uses of AI:**
   - writing or "completing" service notes used for billing
   - choosing billing codes
   - making eligibility or benefits determinations
   - giving individualized benefits or legal advice without a WIPA or CWIC-certified reviewer
6. **Bias and fairness.** Before using AI in matching, screening, prioritizing or assessing people:
   - **Map** the use and who could be harmed (for example, disability, race, age).
   - **Measure** outcomes by group on test data.
   - **Manage** by fixing or dropping the use.
   - Document all of this. Do not use AI to infer disability, diagnosis or SUD status.
7. **Accessibility.** AI-generated content must meet WCAG 2.1 AA or better ([web accessibility](web-accessibility-law-and-standards.md)).
8. **Security.** Use SSO and MFA on approved tools. Do not put credentials in prompts. Report incidents to the privacy lead immediately (DVR's deadline is 24 hours).
9. **Governance.** The compliance contact keeps an AI use register (tool, purpose, data class, owner, review date) and reviews the policy every year.

## Caveats and gotchas
- A BAA covers only the named products and features. Turning on a connector, plugin or file feature can take data outside the BAA (see the Anthropic exclusions above).
- Whether DVR's AI consent rule covers synthetic or de-identified data was not addressed on the DVR pages **(verify with DVR)**.
- Vendor terms change often. The pages above showed "updated" dates of 2025 and 2026 **(recheck before procurement)**.
- HHS has issued other AI-related guidance and strategies. Only 45 CFR 92.210 was opened for this page **(verify any further HHS AI guidance)**.
- **Questions for ERI's counsel/compliance:**
  1. Which data classes may go into which enterprise AI tools?
  2. Does ERI's CCS or Dane County contract restrict AI or offshore processing?
  3. Do ERI's WIPA and EN terms restrict AI use with SSA-derived data?

## How ERI / a hackathon tool should use this
- **Hackathon rules:** synthetic data only. Label demo personas "FICTIONAL." Do not paste real emails, case notes or forms, even redacted ones. Show a human-review step in every demo.
- **Build in:** consent gates, data-class tags on inputs, logging of prompts and outputs (with no PHI in logs), and a visible "AI-assisted" label.
- **A tool must NOT:** send data to an AI service that has no confirmed BAA or data agreement for that data class. It must not make automated decisions about people's services. It must not train or fine-tune models on participant data.

## Related pages
- [Data classification](data-classification-for-eri.md)
- [HIPAA and CCS](hipaa-and-ccs.md)
- [VR confidentiality and DVR vendor rules](vr-confidentiality-34-cfr-361-38.md)
- [Billing integrity](billing-integrity-and-false-claims.md)

## Sources
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [DVR Service Provider Agreement Terms and Conditions (PDF)](https://www.dwd.wisconsin.gov/dvr/service-providers/agreement-references/pdf/agreement-terms-conditions.pdf)
- [HHS Guidance on HIPAA and Cloud Computing](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html)
- [HHS Guidance on De-identification of PHI](https://www.hhs.gov/hipaa/for-professionals/privacy/special-topics/de-identification/index.html)
- [45 CFR 92.210 (eCFR)](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-92/subpart-C/section-92.210)
- [45 CFR 92.1 (eCFR)](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-92/subpart-A/section-92.1)
- [Anthropic, BAAs for commercial customers](https://privacy.claude.com/en/articles/8114513-business-associate-agreements-baa-for-commercial-customers)
- [OpenAI, How can I get a BAA](https://help.openai.com/en/articles/8660679-how-can-i-get-a-business-associate-agreement-baa-with-openai)
- [Google Workspace, HIPAA compliance](https://knowledge.workspace.google.com/admin/compliance/hipaa-compliance-with-google-workspace-and-cloud-identity)
- [Microsoft, HIPAA and HITECH offering](https://learn.microsoft.com/en-us/compliance/regulatory/offering-hipaa-hitech)
