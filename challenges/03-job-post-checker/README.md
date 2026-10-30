> **RETIRED for Hackreation 2026. Not in scope.** The projects are ERI's four, in [docs/eri-problem-statements.md](../../docs/eri-problem-statements.md). Start at [START-HERE.md](../../START-HERE.md).

# Challenge 03: Inclusive job post checker (hello world)

**PRD:** [wiki/prds/03-job-post-checker.md](../../wiki/prds/03-job-post-checker.md)

A free public tool for employers on ERI's website. They paste a job description and get flagged barrier phrases, suggested rewrites, an accommodation statement, and a link to **ERI Business Services**. It's visibility for ERI plus a lead generator. It runs in the browser, and nothing is stored.

```bash
cd challenges/03-job-post-checker
npm ci                       # install test tools
npm start                    # http://localhost:8000
npm test                     # TDD: node:test (test/)
npm run bdd                  # BDD: Cucumber (features/), scenarios tagged with AC IDs
npm run test:a11y            # Playwright + axe accessibility and behaviour (e2e/)
npm run sync:wp              # copy web/ into the WordPress plugin after you change it
```

First 10 minutes: run `npm ci && npm test`, read `web/checker.js`, then write the failing test in `test/` first.

## Spec → tests (traceability)
| AC | Unit (node:test) | Behaviour / browser |
| --- | --- | --- |
| AC-03.1 to AC-03.4 | `test/checker.test.js` | `features/job_post_checker.feature` |
| AC-03.5 ERI link and disclaimer | | `e2e/a11y.test.mjs` |
| AC-03.6 accessibility | | `e2e/a11y.test.mjs` (Playwright + axe) |
| AC-03.7 no HTML injection | | `e2e/a11y.test.mjs` |

CI: `.github/workflows/challenge-03-job-post-checker.yml`. Self-contained: data in `./data/`.

**In WordPress:** copy `wp-plugin/eri-job-post-checker/` into `wp-content/plugins/`, activate it, and add `[eri_job_post_checker]` to a page.

## Your job (pick one; finish it with a test, then pick the next)
- [ ] Better rules: physical demands vs O*NET work context, more phrases, fewer false positives
- [ ] "Rewrite my post" with one click (rules), or an optional LLM rewrite (synthetic or public text only), for the demo only; keep it out of the WordPress plugin
- [ ] An unbranded, accessible "inclusive hiring checklist" page (HTML, not PDF)
- [ ] A "have ERI review my post" link (mailto or ERI's contact page; nothing stored)
- [ ] A reading-level score for the post

**Guardrails:** guidance, not legal advice. The employer decides what's essential. Don't promise tax credits (WOTC lapsed for hires after 2025-12-31).
