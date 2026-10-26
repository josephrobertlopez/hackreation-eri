---
title: Section 1619(a), 1619(b) and Medicaid while working (Wisconsin)
summary: How SSI recipients in Wisconsin keep SSI cash (1619(a)) and Medicaid (1619(b)) while earning, including the 2026 Wisconsin 1619(b) threshold of $51,711 and what happens to Medicaid.
tags: [benefits, ssi, medicaid, 1619b, wisconsin]
jurisdiction: multi
last_verified: 2026-10-23
next_review: 2027-02-15
review_owner: ERI benefits specialist manager
confidence: high
sources:
  - title: POMS SI 02302.200, Charted Threshold Amounts
    url: https://secure.ssa.gov/poms.nsf/lnx/0502302200
    accessed: 2026-10-23
  - title: SSA Red Book, SSI Only Work Incentives
    url: https://www.ssa.gov/redbook/eng/ssi-only-employment-supports.htm
    accessed: 2026-10-23
  - title: POMS SI 01715.020, Medicaid determinations by state (1634 states)
    url: https://secure.ssa.gov/poms.nsf/lnx/0501715020
    accessed: 2026-10-23
  - title: Wisconsin DHS, SSI-Related Medicaid
    url: https://www.dhs.wisconsin.gov/medicaid/ssi-related.htm
    accessed: 2026-10-23
  - title: Wisconsin DHS Operations Memo 26-12 (SSI state supplement increase)
    url: https://www.dhs.wisconsin.gov/dms/memos/ops/dms-ops-2026-12.pdf
    accessed: 2026-10-23
  - title: SSA 2026 COLA Fact Sheet
    url: https://www.ssa.gov/news/en/cola/factsheets/2026.html
    accessed: 2026-10-23
---

# Section 1619(a), 1619(b) and Medicaid while working (Wisconsin)

## TL;DR
- **1619(a)**: an SSI recipient keeps getting a (reduced) SSI check even when earnings are above SGA, as long as countable income still leaves a payment.
- **1619(b)**: when wages bring the SSI check to $0, Medicaid usually continues if gross earnings stay under the state threshold. For **Wisconsin in 2026 the threshold is $51,711/year** (2025: $49,368).
- Wisconsin is a "1634 state". People eligible for SSI, including those in 1619(b) status, get Wisconsin Medicaid without a separate application.
- Above the threshold, SSA can calculate an individualized threshold. If that fails too, the [Medicaid Purchase Plan (MAPP)](wisconsin-medicaid-purchase-plan-mapp.md) is the main Wisconsin option.

## Key facts
| Item | Value | Citation |
|---|---|---|
| WI 1619(b) threshold 2026 (disabled) | $51,711/yr | POMS SI 02302.200 (chart effective 2026-01-20) |
| Components 2026 | base $26,887 (already includes twice the annual state supplement, $2,011) + Medicaid per capita $24,824 = $51,711 | POMS SI 02302.200 |
| WI 1619(b) threshold 2025 | $49,368/yr | POMS SI 02302.200 |
| Separate WI threshold for blind | none | POMS SI 02302.200 |
| WI Medicaid determination type | 1634 state | POMS SI 01715.020 |
| Federal SSI break-even (wages only) 2026 | about $2,073/mo | our arithmetic from FBR $994 (2 x 994 + 85) |
| Restart SSI/Medicaid without new application | within 12 months (non-work reasons); EXR within 60 months after work-related termination | Red Book, SSI only |

## How it works
**1619(a), cash while over SGA.** SGA does not end SSI after the initial application. SSI keeps paying while countable income is below the FBR plus the state supplement. Requirements: eligible for at least one SSI payment month before working at SGA, still disabled, and meeting other SSI rules. No separate application is needed. The person just reports wages.

**1619(b), Medicaid after the check reaches $0.** SSA lists six conditions:
1. Was eligible for an SSI payment for at least 1 month.
2. Would still be eligible for SSI except for earnings.
3. Still has a disability.
4. Still meets other rules, including the $2,000 resource limit.
5. Needs Medicaid to keep working.
6. Gross earnings are not enough to replace SSI, Medicaid and any publicly funded attendant care. For most people, this means "under the state threshold".

**The Wisconsin threshold.** SSA adds up:
- the yearly earnings that would bring federal and Wisconsin SSI to zero (the base amount), plus
- Wisconsin's average yearly Medicaid cost per person.
For 2026 that is $51,711 per year of **gross** earnings, about $4,309 per month (our arithmetic).

**Individualized threshold.** If earnings are over $51,711, SSA can figure a personal threshold. It counts the person's actual Medicaid use, IRWE, BWE, PASS-excluded income and publicly funded attendant care. People with high Medicaid costs, such as Family Care or IRIS members, may stay eligible far above the chart amount.

**What happens to Medicaid.** In 1619(b) status, Wisconsin Medicaid continues on the SSI basis. That includes any Family Care, IRIS or other waiver enrollment, if other rules are met. If 1619(b) ends:
- Wisconsin must review the person for other Medicaid categories before closing.
- MAPP (income up to 250% FPL, assets up to $15,000, premiums above 100% FPL) is the usual next step for workers with disabilities.
- SSI-related Medicaid (EBD) with a deductible, or BadgerCare Plus, may also apply.

**Restarting.** If SSI stops for non-work reasons, cash and Medicaid can restart within 12 months without a new application. If it stopped because of earnings, Expedited Reinstatement is available for 5 years.

## Caveats and gotchas
- The threshold is compared with **gross** wages for the year, not with countable income.
- Resources still matter. Saving above $2,000 in countable resources ends 1619(b) even if earnings are low. ABLE accounts (first $100,000 excluded) help here.
- The 2026 chart uses 2023 Medicaid cost data because 2024 data was not available (POMS note).
- The 2026 POMS base amount uses the old Wisconsin supplement ($83.78 x 12 x 2 = $2,011). The supplement rose to $92.16 on 2026-05-01 (DHS Ops Memo 26-12). SSA might not update the 2026 chart. The 2027 chart may be higher. **(verify)** with the next POMS release.
- The 2027 Wisconsin threshold was not published as of 2026-10-23. Expect a new chart in early 2027.
- SSA does an annual 1619(b) review. People must keep reporting wages monthly even when they get no check.

## How ERI / a hackathon tool should use this
- An estimator should compare the person's projected **annual gross earnings** with $51,711 (2026). Below: "Under the 2026 chart amount. Medicaid often continues under 1619(b) if the other conditions are met." Near or above: "You may still qualify through an individualized threshold or MAPP. Talk to WIPA."
- Always label results "Estimate only" and route the user to WIPA **1-877-826-1752**.
- Use year-specific thresholds. Do not hard-code $51,711 past 2026.
- Ask about the resource test (savings, ABLE) along with earnings.
- Do NOT tell someone they "will lose Medicaid" because of a raise. Many people fear this, and it stops them from working. Show the 1619(b) and MAPP paths instead.

## Related pages
- [SSI work rules](ssi-work-rules.md)
- [Wisconsin Medicaid Purchase Plan (MAPP)](wisconsin-medicaid-purchase-plan-mapp.md)
- [Wisconsin Medicaid long-term care](wisconsin-medicaid-long-term-care.md)
- [ABLE accounts](able-accounts.md)
- [Benefits quick reference 2026](benefits-quick-reference-2026.md)

## Sources
- [POMS SI 02302.200, Charted Threshold Amounts](https://secure.ssa.gov/poms.nsf/lnx/0502302200)
- [SSA Red Book, SSI Only Work Incentives](https://www.ssa.gov/redbook/eng/ssi-only-employment-supports.htm)
- [POMS SI 01715.020](https://secure.ssa.gov/poms.nsf/lnx/0501715020)
- [Wisconsin DHS, SSI-Related Medicaid](https://www.dhs.wisconsin.gov/medicaid/ssi-related.htm)
- [Wisconsin DHS Operations Memo 26-12](https://www.dhs.wisconsin.gov/dms/memos/ops/dms-ops-2026-12.pdf)
- [SSA 2026 COLA Fact Sheet](https://www.ssa.gov/news/en/cola/factsheets/2026.html)
