/*
 * Conformance: the spec and the suite have to agree.
 *
 * Two jobs.
 *
 * 1. Walk ERI's six MVP steps end to end, as one session, and assert the
 *    session completes - the thing their §9 bullet 1 actually asks for.
 * 2. Parse spec/acceptance.md and hold it to its own claims. Every row with
 *    disposition `mvp` or `forbidden` must cite a test file that exists AND
 *    mention an AC id that really appears in a test. Every `stretch` row must
 *    say it is not implemented. Every `human` row must say a human judges it.
 *
 * Job 2 is the one that matters six weeks from now: it is what stops the spec
 * drifting into claiming coverage the suite does not have.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { INDUSTRY_BY_ID } from '../fixtures/industries.js';
import { DEMO } from '../fixtures/candidates.js';
import { parseNeeds, validateNeeds, loadCandidate, suggestMatches } from '../web/match.js';
import { buildActionPlan } from '../web/plan.js';
import { isTraceable, findRankingViolations, findDecisionLanguage } from '../web/guards.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const TEST_FILES = fs.readdirSync(here).filter((f) => f.endsWith('.test.js'));
const ALL_TEST_SOURCE = TEST_FILES.map((f) => fs.readFileSync(path.join(here, f), 'utf8')).join('\n');

/* ----------------------------------------- ERI's six MVP steps, end to end */

describe('ERI’s six MVP steps, in one session (P4-S1)', () => {
  it('P4-S1 an employer can complete the whole assessment and reach a plan', () => {
    /* Step 1: select an industry. */
    const industry = INDUSTRY_BY_ID.get(DEMO.industryId);
    assert.ok(industry, 'step 1: industry');

    /* Step 2: three to five recurring needs. */
    const needs = parseNeeds(DEMO.needs);
    const verdict = validateNeeds(needs);
    assert.equal(verdict.ok, true, `step 2: ${verdict.message}`);
    assert.ok(needs.length >= 3 && needs.length <= 5, 'step 2: three to five');

    /* Step 3: the candidate's skills, interests and preferences - loaded from
     * the profile they shared, which is this build's design call. */
    const candidate = loadCandidate(DEMO.candidateId);
    assert.equal(candidate.entryMode, 'shared-by-candidate', 'step 3: default is the shared profile');
    assert.ok(candidate.skills.length && candidate.interests.length && candidate.preferences.length);

    /* Step 4: suggest matches. */
    const result = suggestMatches({ industryId: industry.id, needs, candidate });
    assert.ok(result.suggestions.length >= 3, `step 4: only ${result.suggestions.length} suggestions`);

    /* Step 5: explain why each one. */
    for (const s of result.suggestions) assert.equal(isTraceable(s).ok, true, `step 5: ${s.id} cannot explain itself`);

    /* Step 6: an action plan with next steps. */
    const plan = buildActionPlan(result);
    assert.ok(plan.steps.length >= 4, 'step 6: next steps');
    assert.ok(plan.questionsForSpecialist.length >= 5, 'step 6: questions for a specialist');
    assert.ok(plan.resources.length >= 3, 'step 6: trusted resources');

    /* And the whole session is still clean under the guards. */
    assert.deepEqual(findRankingViolations({ result, plan }), []);
    assert.deepEqual(findDecisionLanguage({ result, plan }), []);
  });
});

/* ------------------------------------------------ out of scope, by absence */

describe('out of scope stays out (P4-X3, P4-X6)', () => {
  it('P4-X3 nothing claims ADA compliance or manages it', () => {
    const copy = ['web/index.html', 'web/plan.js', 'fixtures/resources.js'].map(read).join('\n').toLowerCase();
    for (const phrase of ['ada compliant', 'ada-compliant', 'fully compliant', 'compliance management', 'compliance checklist', 'meets ada', 'ensures compliance']) {
      assert.ok(!copy.includes(phrase), `found a compliance claim: "${phrase}"`);
    }
  });

  it('P4-X6 one employer and one candidate per session: no cross-organization matchmaking', () => {
    const matchSource = read('web/match.js');
    assert.match(matchSource, /industryId/, 'a session takes a single industry');
    assert.doesNotMatch(matchSource, /industryIds|employers\b|candidates\s*\)/, 'no plural employer or candidate entry point');
    const needs = parseNeeds(DEMO.needs);
    const result = suggestMatches({ industryId: DEMO.industryId, needs, candidate: loadCandidate(DEMO.candidateId) });
    assert.equal(typeof result.candidate.id, 'string', 'exactly one candidate in the output');
    assert.ok(!Array.isArray(result.candidate), 'the output has no candidate list to rank');
  });
});

/* -------------------------------- stretch features really are not built yet */

describe('the three legally dangerous features are genuinely absent (P4-F4, P4-F5, P4-F6)', () => {
  const SOURCES = ['web/index.html', 'web/app.js', 'web/match.js', 'web/plan.js', 'fixtures/resources.js', 'fixtures/industries.js', 'fixtures/candidates.js'];
  const corpus = () => SOURCES.map(read).join('\n').toLowerCase();

  it('P4-F4 no disclosure script or scenario text is generated anywhere', () => {
    const text = corpus();
    for (const phrase of ['say to the applicant', 'respond by saying', 'suggested response:', 'sample script', 'you could reply']) {
      assert.ok(!text.includes(phrase), `a disclosure script appeared: "${phrase}"`);
    }
  });

  it('P4-F5 no accommodation is ever named by this tool: accommodation content is linked only', () => {
    const text = corpus();
    for (const phrase of ['provide a stool', 'noise-cancelling', 'noise cancelling', 'screen reader software for them', 'flexible schedule accommodation', 'suggested accommodation']) {
      assert.ok(!text.includes(phrase), `generated accommodation content appeared: "${phrase}"`);
    }
    /* The only accommodation material in the build is a pointer with a URL or
     * a phone number - asserted in test/plan.test.js and test/guards.test.js. */
    assert.ok(read('fixtures/resources.js').includes('askjan.org'));
  });

  it('P4-F6 the onboarding planner is not built: the plan has next steps, not a training curriculum', () => {
    const plan = buildActionPlan(
      suggestMatches({ industryId: DEMO.industryId, needs: parseNeeds(DEMO.needs), candidate: loadCandidate(DEMO.candidateId) })
    );
    assert.equal(plan.onboardingChecklist, undefined, 'if you build this, read the warning in README.md first');
  });
});

/* ------------------------------------------- the spec must match the suite */

describe('spec/acceptance.md is held to its own claims', () => {
  const SPEC = read('spec/acceptance.md');
  const ROW = /^\|\s*(P4-[A-Z]\d+)\s*\|([^|]*)\|([^|]*)\|([^|]*)\|/gm;
  const rows = [...SPEC.matchAll(ROW)].map((m) => ({
    id: m[1],
    source: m[2].trim(),
    disposition: (m[3].match(/mvp|stretch|forbidden|human/) || [null])[0],
    proof: m[4].trim()
  }));

  const EXPECTED = { F: 7, M: 6, A: 7, S: 6, V: 7, X: 6 };

  it('has all 39 rows, one per requirement ERI wrote, with no duplicates', () => {
    assert.equal(rows.length, 39, `parsed ${rows.length} rows: ${rows.map((r) => r.id).join(', ')}`);
    const ids = rows.map((r) => r.id);
    assert.equal(new Set(ids).size, 39, 'duplicate ids');
    for (const [letter, count] of Object.entries(EXPECTED)) {
      for (let n = 1; n <= count; n += 1) {
        assert.ok(ids.includes(`P4-${letter}${n}`), `missing P4-${letter}${n}`);
      }
      const extra = ids.filter((id) => id.startsWith(`P4-${letter}`));
      assert.equal(extra.length, count, `P4-${letter} should have ${count} rows, found ${extra.length}`);
    }
  });

  it('every row has one of the four dispositions', () => {
    for (const row of rows) {
      assert.ok(row.disposition, `${row.id} has no disposition`);
    }
  });

  it('every row quotes or cites the ERI section it comes from', () => {
    for (const row of rows) {
      assert.match(row.source, /§\s*\d+/, `${row.id} does not cite an ERI section: ${row.source}`);
    }
  });

  it('every mvp and forbidden row cites a test file that exists and really mentions it', () => {
    const covered = rows.filter((r) => r.disposition === 'mvp' || r.disposition === 'forbidden');
    assert.ok(covered.length >= 20, `only ${covered.length} rows claim test coverage`);
    for (const row of covered) {
      const cited = [...row.proof.matchAll(/test\/([\w.-]+\.test\.js)/g)].map((m) => m[1]);
      assert.ok(cited.length > 0, `${row.id} is ${row.disposition} but cites no test`);
      for (const file of cited) {
        assert.ok(TEST_FILES.includes(file), `${row.id} cites ${file}, which does not exist`);
        const source = fs.readFileSync(path.join(here, file), 'utf8');
        assert.ok(source.includes(row.id), `${row.id} cites ${file}, but ${file} never mentions ${row.id}`);
      }
    }
  });

  it('every human row says a human judges it, and every stretch row says it is not implemented', () => {
    for (const row of rows.filter((r) => r.disposition === 'human')) {
      assert.match(row.proof, /human/i, `${row.id} is human-judged but does not say who judges it`);
    }
    for (const row of rows.filter((r) => r.disposition === 'stretch')) {
      assert.match(row.proof, /not implemented/i, `${row.id} is stretch but does not say it is unbuilt`);
    }
  });

  it('every AC id a test claims is a real row in the spec', () => {
    const claimed = new Set([...ALL_TEST_SOURCE.matchAll(/P4-[A-Z]\d+/g)].map((m) => m[0]));
    const known = new Set(rows.map((r) => r.id));
    for (const id of claimed) assert.ok(known.has(id), `a test claims ${id}, which is in no spec row`);
  });

  it('the design call on ERI’s §6 step 3 is recorded against P4-M3', () => {
    const m3 = rows.find((r) => r.id === 'P4-M3');
    assert.ok(m3, 'P4-M3 row missing');
    const section = SPEC.slice(SPEC.indexOf('P4-M3'));
    assert.match(SPEC, /design call/i, 'the decision has to be written down, not just implemented');
    /* \s+ not a literal space: the spec is hard-wrapped, so the phrase lands
     * across a line break. The first run of this test failed on exactly that. */
    assert.match(section.slice(0, 5000), /Show\s+Your\s+Skills/, 'the §12 handoff is the reason the ids are shared');
  });
});
