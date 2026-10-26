# Challenge 02: "Is this job right for me?" (hello world)

**PRD:** [wiki/prds/02-job-fit-checker.md](../../wiki/prds/02-job-fit-checker.md)

A public tool for ERI's website. A job seeker enters a job offer and gets a plain-language heads-up on pay, SSI/SSDI and the commute, plus where to get real help. **Everything runs in the browser, and nothing is sent or stored**, which makes it easier for ERI's web team to review and host.

```bash
cd challenges/02-job-fit-checker
npm ci                       # install test tools
npm start                    # http://localhost:8000
npm test                     # TDD: node:test (test/)
npm run bdd                  # BDD: Cucumber (features/), scenarios tagged with AC IDs
npm run test:a11y            # Playwright + axe accessibility and behaviour (e2e/)
npm run sync:wp              # copy web/ into the WordPress plugin after you change it
```

First 10 minutes: run `npm ci && npm test` (all green), read `web/job-fit.js`, then pick one box below and write its failing test in `test/` first.

## Spec → tests (traceability)
| AC | Unit (node:test) | Behaviour / browser |
| --- | --- | --- |
| AC-02.1 to AC-02.6 | `test/job-fit.test.js` | `features/job_fit.feature` |
| AC-02.7 accessibility, focus | | `e2e/a11y.test.mjs` (Playwright + axe) |
| AC-02.8 no network | | `e2e/a11y.test.mjs` |

CI: `.github/workflows/challenge-02-job-fit-checker.yml`. Self-contained: data in `./data/`.

**In WordPress:** copy `wp-plugin/eri-job-fit/` into `wp-content/plugins/`, activate it, and add `[eri_job_fit]` to a page. (Run `npm run sync:wp` after changing `web/`; CI checks they match.)

## Your job (pick one; finish it with a test, then pick the next)
- [ ] Pick a job from `data/job_postings.csv` instead of typing it in
- [ ] A 3-question profile (interests, hours, days) → top 3 sample jobs with "why it fits"
- [ ] Commute time from the MCTS GTFS data (`tools/fetch_public_data.sh`) (big: needs a data download)
- [ ] A "send this to my ERI specialist" button (mailto: or print; no data stored)
- [ ] Spanish version; a 6th-grade reading-level check

Every team: one screen reader pass (it counts in judging).

**Guardrails:** estimate only, always show the WIPA line, never "you will keep your benefits," and collect no personal data.
