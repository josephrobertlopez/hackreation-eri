# Wisconsin DVR: how vendors like ERI get paid

**DVR** = Wisconsin Division of Vocational Rehabilitation (part of the Department of Workforce Development). It's federally funded under the Rehabilitation Act. DVR helps people with disabilities get jobs and **buys services from vendors** like ERI.

Source: [DVR Statewide Service Fee Structure](https://dwd.wisconsin.gov/dvr/service-providers/statewide-service-fee-structure.htm), effective **Jul 1, 2026 to Jun 30, 2028**, and its [appendix](https://dwd.wisconsin.gov/dvr/service-providers/tech-specs/appendix.htm). Always check the source; rates change.

## The flow
1. A DVR counselor and the consumer write an **IPE** (Individualized Plan for Employment).
2. DVR issues a **purchase order (PO)**, which is prior written authorization for a specific service. **No PO, no pay.**
3. The vendor contacts the consumer within **5 days** of receiving the PO.
4. The vendor delivers the service and submits the required **report**, usually within **5 business days**.
5. The vendor invoices; DVR pays. A report returned for missing elements must be fixed within **10 business days**.

## Supported Employment (SE) services
| Code here | Service | Rate | Paid when |
| --- | --- | --- | --- |
| SE-CP | Career Profile | $1,000 | Meeting, plan, long-term care coordination, report ≤ 5 business days; start ≤ 30 days, finish ≤ 90 days |
| SE-JPDP | Job Preparation and Development **Plan** | $350 | Meeting, plan, report ≤ 5 business days; finish ≤ 45 days |
| SE-JDH | Job Development and **Hire** | $1,600 standard; **$2,000 / $2,200 preferred** | Monthly reports, 90-day reviews, **Hire report ≤ 5 business days after hire** |
| SE-JTA | Job and Task Analysis | $275 | Report within 1 week of job start |
| SE-MSI | Monthly Systematic Instruction (incl. retention) | $1,600 / month | **Only months the consumer is employed**; LTC coordination at 60 days; monthly report ≤ 5 business days |
| SE-RET | Retention (when no SI) | $500 / month | Same as above |
| SE-TLTS | Transition to Long-Term Support | $1,300 (≤ 6 months) / $500 (> 6 months) | After 90+ days employed; transition report |

(The codes in the first column are this repo's shorthand, not DVR's activity codes.)

### Preferred outcome for Job Development and Hire
| Rate | Rule |
| --- | --- |
| **$2,200** | 35+ hours/week **and** (health insurance **or** ≥ $16.00/hour) |
| **$2,000** | 20+ hours/week **and** (health insurance **or** ≥ $12.00/hour) |
| $1,600 | Any other qualifying hire |

Ongoing support max: 24 months (age 25+) or 48 months (under 25), unless DVR authorizes more.

## Where revenue leaks (PRD 01)
These are hypotheses that apply to any DVR vendor:
- **Gaps in monthly billing.** A month of support was delivered but never invoiced. Or the person wasn't working that month, in which case it's correctly unbilled.
- **Which milestone does a note support?** The $350 Plan and the $1,600 Hire are **different, sequential services**, each with its own PO. They aren't two codes for the same work. The real risk is a hire that happened but was never invoiced, or invoiced at $1,600 when it met preferred criteria.
- **Late or incomplete reports** can delay or block payment.
- **Do the people who document and the people who bill talk?** Unknown. Ask ERI.

## The compliance line (read this)
DVR money is public, federally funded money. A good tool:
- ✅ finds work that was **authorized and delivered** but not billed, or billed too low
- ✅ tells staff which **required elements are missing** from a note, so it reflects what they actually did
- ✅ warns before report deadlines
- ❌ never suggests wording to qualify for a higher rate than what happened
- ❌ never bills automatically. **A person reviews and approves every flag.**

Billing for services not delivered is fraud (state law and the federal False Claims Act). Building "revenue integrity" is great; building "upcoding" is not.
