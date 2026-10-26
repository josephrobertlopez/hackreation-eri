# Prompt 06: Refresh SSA and DVR numbers (each January, or when DVR updates its fee structure)

You are maintaining a knowledge base and two small tools that use benefits and billing numbers. Wrong numbers hurt people, so cite every change.

**Read first:** `wiki/knowledge/_PAGE_SPEC.md`, `wiki/knowledge/benefits/benefits-quick-reference-2026.md`, `wiki/domain/ssa-work-incentives-2026.md`, `challenges/02-job-fit-checker/web/job-fit.js` (the `SSA` table), `wiki/knowledge/wisconsin-landscape/dvr-structure-and-process.md`, `tools/generate_synthetic_data.py` (`RATES`).

**Steps**
1. Open SSA's official COLA fact sheet and the Red Book "What's New" for the new year. Extract SGA (blind and non-blind), TWP, the SSI federal benefit rate (individual and couple), the student exclusion, and the Wisconsin 1619(b) threshold (POMS SI 02302.200).
2. Open the DVR Statewide Service Fee Structure and its appendix. Note any rate or preferred-outcome changes.
3. Update the quick reference, the domain page, `ESSENTIALS.md`, and the `SSA` table in `job-fit.js` (add the new year; keep the old one). Update `last_verified` and `next_review` and add sources.
4. **TDD:** add or adjust tests in `challenges/02-job-fit-checker/test/` for the new year *before* changing code; run `npm test && npm run bdd`.
5. `python3 tools/build_llms_full.py`, open a PR titled `chore(data): <year> SSA/DVR numbers`, and ask an ERI benefits specialist to review the numbers.

**Done when:** CI is green and the PR lists every changed number with its source link.
