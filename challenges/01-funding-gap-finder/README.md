> **RETIRED for Hackreation 2026. Not in scope.** The projects are ERI's four, in [docs/eri-problem-statements.md](../../docs/eri-problem-statements.md). Start at [START-HERE.md](../../START-HERE.md).

# Challenge 01: Funding gap finder (hello world)

**PRD:** [wiki/prds/01-funding-gap-finder.md](../../wiki/prds/01-funding-gap-finder.md)

ERI is paid by several funders, and each pays only for work that was authorized, delivered and claimed. This hello world shows the whole pattern in about 150 lines of PHP:

1. **ETL:** three different exports (DVR, Ticket to Work, a county contract) → one **common ledger** (`ledger.csv`)
2. **One generic check:** expected $ vs claimed $ → under-claimed (review it) or over-claimed (a risk; fix it)

```bash
cd challenges/01-funding-gap-finder
php src/etl.php                     # builds ledger.csv, prints $ at stake per funder
php -S localhost:8080 -t public     # filterable, accessible table
php tests/smoke.php                 # zero-dependency check against the planted data

composer install                    # then, like a real team:
composer test                       # TDD: PHPUnit (tests/Unit/)
composer bdd                        # BDD: Behat (features/), scenarios tagged with AC IDs
```

First 10 minutes: run `composer install && composer test`, read `src/etl.php`, then write the failing test in `tests/Unit/` first.

## Spec → tests (traceability)
| AC | Unit (PHPUnit) | Behaviour (Behat) |
| --- | --- | --- |
| AC-01.1 one ledger | `EtlTest::it_builds_one_ledger…` | `@AC-01.1` |
| AC-01.2 DVR missed months | `FindGapsTest::it_flags_under_claimed…` | `@AC-01.2` |
| AC-01.3 not-employed months | `EtlTest::it_sets_expected_to_zero…` | `@AC-01.3` |
| AC-01.4 Ticket unclaimed | `EtlTest::it_skips_ticket_months_without_a_pay_stub` | `@AC-01.4` |
| AC-01.5 county under-claims | `FindGapsTest::it_flags_under_claimed…` | `@AC-01.5` |
| AC-01.6 over-claims = risk | `FindGapsTest::it_flags_over_claims_as_risk…` | `@AC-01.6` |
| AC-01.7 evidence | `FindGapsTest::it_keeps_the_evidence…` | `@AC-01.7` |

CI: `.github/workflows/challenge-01-funding-gap-finder.yml`. This challenge is self-contained: its data is in `./data/`.

## Your job (pick one; finish it with a test, then pick the next)
- [ ] **DVR Job Development & Hire**, including preferred outcomes ($2,000 / $2,200 rules in `wiki/knowledge/`)
- [ ] **Late reports:** more than 5 business days after service
- [ ] **Missing evidence:** Ticket months with no pay stub become "collect evidence," not "claim"
- [ ] **Review workflow:** mark each flag reviewed / claimed / dismissed, with who and when (audit trail) (big)
- [ ] **WordPress admin page** version (see `starters/wordpress-plugin`). Test site and synthetic data only: billing data never goes on ERI's public sites.
- [ ] Optional: an LLM explains a flag in plain words. **Synthetic data only.** A real version needs ERI's AI policy and DVR consumer consent.

**Guardrails:** flags only. A person decides. Never suggest wording to raise a rate.
