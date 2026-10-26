# SSI / SSDI and work: 2026 numbers

The #1 reason people with disabilities turn down work is **fear of losing benefits and health care.** ERI's benefits specialists (WIBS / CWICs) answer "what happens if I take this job?"

Source: [SSA Red Book, What's New in 2026](https://www.ssa.gov/redbook/newfor2026.htm). Verify before you hard-code anything.

| 2026 figure | Amount |
| --- | --- |
| SGA (Substantial Gainful Activity), non-blind | $1,690 / month |
| SGA, blind | $2,830 / month |
| Trial Work Period (TWP) month threshold | $1,210 / month |
| SSI Federal Benefit Rate, individual | $994 / month |
| SSI Federal Benefit Rate, couple | $1,491 / month |
| Student Earned Income Exclusion | $2,410 / month, up to $9,730 / year |

**2027 values are out** (3.6% COLA announced 2026-10-14): SGA $1,770 non-blind and $2,950 blind; TWP $1,270; SSI FBR $1,029 individual and $1,544 couple. The **Wisconsin SSI state supplement** rose to $92.16 (individual) on 2026-05-01. Full table: [benefits quick reference](../knowledge/benefits/benefits-quick-reference-2026.md).

## The two programs, simply
- **SSDI** (Social Security Disability Insurance): based on past work. Earnings over the **TWP** amount use up one of 9 trial months. After the TWP, earning over **SGA** can stop the check (with an extended period of eligibility safety net).
- **SSI** (Supplemental Security Income): needs-based. Roughly, SSA ignores the first $20 of any income and $65 of earnings, then **reduces the check $1 for every $2 earned** above that. Medicaid can continue under **1619(b)** even when the check reaches $0.

Rough SSI estimate (earned income only, individual, no other income):
```
countable = max(0, (gross_wages - 20 - 65) / 2)
ssi_check = max(0, 994 - countable)
```

**Any tool must say "estimate only, talk to a benefits specialist"** and route to Wisconsin WIPA: 1-877-826-1752. Real cases involve IRWEs, PASS plans, student exclusions, Medicaid buy-in, and more. An ERI benefits specialist should check any math.
