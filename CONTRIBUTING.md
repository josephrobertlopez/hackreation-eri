# Contributing: work like a real software team

Hackreation is a chance to practice how professional teams ship. A branch, a failing test, a fix and a PR with green CI is a story you can tell in any interview.

## 1. Plan from the spec
- Read your PRD in `wiki/prds/`. Each **acceptance criterion** has an ID (`AC-02.3`).
- Optional: open a GitHub **issue** for your "You add" item (*Feature* template) and cite the AC IDs.
- Optional: write a big decision as an **ADR** in `docs/adr/` (copy `0000-template.md`).

## 2. Branch, commit, push
- Branch from `main`: `team/<team-name>/<short-feature>`, e.g. `team/bus-buddies/commute-time`.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `feat(02): add commute time from GTFS`, `fix(01): skip months without pay stubs`, `test(03): cover AC-03.7 injection`.
- Commit small and often. Push at least every hour.

## 3. Test first (TDD + BDD)
| Level | Tool | Where | Naming |
| --- | --- | --- | --- |
| Unit (TDD) | PHPUnit (PHP) or `node:test` (JS) | `tests/Unit/*Test.php` or `test/*.test.js` | Test names describe behaviour and cite the AC ID |
| Behaviour (BDD) | Behat (PHP) or Cucumber.js (JS) | `features/*.feature` | One scenario per AC, tagged `@AC-0x.y` |
| Accessibility + browser | Playwright + axe | `e2e/*.test.mjs` | Zero axe violations is the bar |

The loop: write a failing scenario or test for the AC → make it pass with the smallest change → refactor → commit.

## 4. Pull request
- Open a PR into `main` by 3:00, so CI finishes before demos (use the PR template). CI runs automatically (`.github/workflows/`).
- **Code review:** another team member (or a mentor) reviews. Reviewers check the PR template boxes, not style nitpicks.
- **Non-coders review too:** read the copy for plain words, run the keyboard and screen reader check, and file an issue for each problem you find.
- Don't merge. Leave your PR open: judges and ERI review it there.

## Definition of Done
- [ ] The acceptance criteria it claims are covered by passing tests (unit and/or BDD)
- [ ] CI is green for the challenge's workflow
- [ ] No axe violations; keyboard-only path works; plain language
- [ ] Synthetic data only; no secrets; no network calls the PRD doesn't allow
- [ ] README updated: how to run it in under 10 minutes and what ERI needs to adopt it
- [ ] Guardrails respected (estimates route to WIPA; billing flags, people decide)

## Repo rules
- Work in your challenge folder on your team branch, so CI runs. Use `teams/<team-name>/` only if you picked a starter. Challenges are **decoupled**: don't import from another challenge.
- Don't edit `data/` by hand. Change `tools/generate_synthetic_data.py` and regenerate.
- Ask before adding a dependency; explain why in the PR.

## Show your work
Link your PR, tests and green CI in your portfolio. Describe it as a Hackreation prototype built on synthetic data, not an ERI product or ERI client work.
