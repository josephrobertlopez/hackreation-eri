/*
 * A Gherkin-subset runner, so features/employer_hub.feature really executes.
 *
 * WHY NOT CUCUMBER: `tools/run_project_suite.sh` requires an `npm run bdd`
 * script and suggests `cucumber-js`. This challenge is specified as
 * zero-dependency and zero-build, so the scenarios run here instead. Sixty
 * lines of parser is a smaller liability than a dependency tree, and the
 * scenarios are the artifact that matters - they carry the acceptance IDs.
 *
 * THE ONE RULE THAT MAKES IT HONEST: an unmatched step THROWS. A runner that
 * skipped a step it could not parse would report green for scenarios it never
 * ran. test/features.test.js asserts the total number of steps executed, so a
 * silently empty run fails too.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseNeeds, validateNeeds, loadCandidate, suggestMatches } from '../web/match.js';
import { buildActionPlan } from '../web/plan.js';
import {
  isTraceable, findRankingViolations, findDecisionLanguage, isEmployerOrdered,
  findDisclosureFields, findDisclosureFieldsInProfile
} from '../web/guards.js';
import { DEMO, CANDIDATE_BY_ID } from '../fixtures/candidates.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const FEATURE = fs.readFileSync(path.join(root, 'features', 'employer_hub.feature'), 'utf8');

/* ------------------------------------------------------------------- parser */

function parseFeature(text) {
  const scenarios = [];
  let tags = [];
  let current = null;

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('@')) { tags = line.split(/\s+/).filter((t) => t.startsWith('@')); continue; }
    if (line.startsWith('Feature:')) { tags = []; continue; }
    if (line.startsWith('Scenario:')) {
      current = { name: line.replace('Scenario:', '').trim(), tags, steps: [] };
      scenarios.push(current);
      tags = [];
      continue;
    }
    const step = line.match(/^(Given|When|Then|And)\s+(.*)$/);
    if (step) {
      assert.ok(current, `step outside a scenario: ${line}`);
      current.steps.push(step[2]);
    }
  }
  return scenarios;
}

/* -------------------------------------------------------------------- steps */

let stepsRun = 0;

const STEPS = [
  [/^an employer in the "([\w-]+)" industry$/, (world, industryId) => { world.industryId = industryId; }],

  [/^the shared profile "([\w-]+)"$/, (world, id) => { world.candidate = loadCandidate(id); }],

  [/^a shared profile with no recorded permission$/, (world) => {
    world.lookup = new Map([['cand-noconsent', { ...CANDIDATE_BY_ID.get('cand-avery'), consent: { shareApproved: false } }]]);
  }],

  [/^loading it is refused$/, (world) => {
    assert.throws(() => loadCandidate('cand-noconsent', world.lookup), /no recorded permission/);
  }],

  [/^they describe the 5 recurring needs from ERI's retail example$/, (world) => {
    world.needs = parseNeeds(DEMO.needs);
    assert.equal(world.needs.length, 5);
    world.verdict = validateNeeds(world.needs);
  }],

  [/^they describe (\d+) recurring needs$/, (world, count) => {
    world.needs = parseNeeds(Array.from({ length: Number(count) }, (_, i) => `count the stock in area ${i}`));
    world.verdict = validateNeeds(world.needs);
  }],

  [/^they describe a need the vocabulary does not recognise$/, (world) => {
    world.needs = parseNeeds([...DEMO.needs.slice(0, 3), 'The vibe in here needs a total rethink.']);
    world.verdict = validateNeeds(world.needs);
    world.oddNeedText = 'The vibe in here needs a total rethink.';
  }],

  [/^the needs assessment is accepted$/, (world) => {
    assert.equal(world.verdict.ok, true, world.verdict.message || 'refused');
  }],

  [/^the needs assessment is refused with a message saying "([^"]+)"$/, (world, phrase) => {
    assert.equal(world.verdict.ok, false, 'should have been refused');
    assert.ok(world.verdict.message.includes(phrase), `message was: ${world.verdict.message}`);
  }],

  [/^matches are suggested$/, (world) => {
    world.result = suggestMatches({ industryId: world.industryId, needs: world.needs, candidate: world.candidate });
  }],

  [/^an action plan is built$/, (world) => { world.plan = buildActionPlan(world.result); }],

  [/^at least (\d+) suggestions are produced$/, (world, n) => {
    assert.ok(world.result.suggestions.length >= Number(n), `only ${world.result.suggestions.length}`);
  }],

  [/^at least (\d+) distinct workplace tasks are named$/, (world, n) => {
    assert.ok(world.result.meta.distinctTaskShapes.length >= Number(n), world.result.meta.distinctTaskShapes.join(' | '));
  }],

  [/^every suggestion uses a skill the candidate shared$/, (world) => {
    for (const s of world.result.suggestions) assert.ok(world.candidate.skills.includes(s.skill.id), s.skill.id);
  }],

  [/^every suggestion quotes the employer's own words$/, (world) => {
    assert.ok(world.result.suggestions.length > 0);
    for (const s of world.result.suggestions) {
      assert.equal(s.citations.need.source, 'employer');
      assert.ok(s.need.text.toLowerCase().includes(s.citations.need.quote.toLowerCase()), s.id);
    }
  }],

  [/^every suggestion quotes the candidate's own skill$/, (world) => {
    for (const s of world.result.suggestions) {
      assert.equal(s.citations.skill.source, 'candidate');
      assert.ok(s.citations.skill.quote, s.id);
    }
  }],

  [/^every suggestion's explanation contains both quotes$/, (world) => {
    for (const s of world.result.suggestions) {
      const verdict = isTraceable(s);
      assert.ok(verdict.ok, `${s.id}: ${verdict.problems.join('; ')}`);
    }
  }],

  [/^that need is reported as a gap$/, (world) => {
    const gap = world.result.unmatchedNeeds.find((u) => u.text === world.oddNeedText);
    assert.ok(gap, 'the unrecognised need should be listed');
    assert.equal(gap.reason, 'no-vocabulary-hit');
  }],

  [/^no suggestion is invented for it$/, (world) => {
    for (const s of world.result.suggestions) assert.notEqual(s.need.text, world.oddNeedText);
  }],

  [/^no part of the output is a score or a rank$/, (world) => {
    const violations = findRankingViolations({ result: world.result, plan: buildActionPlan(world.result) });
    assert.deepEqual(violations, [], violations.map((v) => `${v.path}: ${v.reason}`).join('\n'));
  }],

  [/^the output order is the employer's own entry order$/, (world) => {
    assert.equal(isEmployerOrdered(world.result.suggestions, world.needs).ok, true);
  }],

  [/^no part of the output reads as a decision$/, (world) => {
    const hits = findDecisionLanguage({ result: world.result, plan: buildActionPlan(world.result) });
    assert.deepEqual(hits, [], hits.map((h) => h.path).join('\n'));
  }],

  [/^no part of the output names a disability or a diagnosis$/, (world) => {
    const hits = findDisclosureFieldsInProfile({ result: world.result, plan: buildActionPlan(world.result) });
    assert.deepEqual(hits, [], hits.map((h) => `${h.path}: ${h.reason}`).join('\n'));
  }],

  [/^the page has no field asking for one$/, () => {
    const hits = findDisclosureFields(fs.readFileSync(path.join(root, 'web', 'index.html'), 'utf8'));
    assert.deepEqual(hits, []);
  }],

  [/^the plan has at least (\d+) next steps$/, (world, n) => {
    assert.ok(world.plan.steps.length >= Number(n), `only ${world.plan.steps.length}`);
  }],

  [/^the plan names questions for an employment specialist$/, (world) => {
    assert.ok(world.plan.questionsForSpecialist.length >= 5);
    assert.ok(world.plan.steps.some((s) => /employment specialist/i.test(s.heading + s.detail)));
  }],

  [/^the plan names a trusted resource with a link or a phone number$/, (world) => {
    assert.ok(world.plan.resources.length > 0);
    for (const r of world.plan.resources) assert.ok(r.url || r.phone, r.id);
  }],

  [/^the plan refers legal questions to a qualified professional$/, (world) => {
    assert.match(world.plan.legalReferral.body, /qualified professional/);
    assert.match(world.plan.legalReferral.body, /JAN/);
  }]
];

function runStep(world, text) {
  for (const [pattern, fn] of STEPS) {
    const m = text.match(pattern);
    if (m) { fn(world, ...m.slice(1)); stepsRun += 1; return; }
  }
  throw new Error(`no step definition matches: "${text}" - an unmatched step is a failure, not a skip`);
}

/* ------------------------------------------------------------------ the run */

const SCENARIOS = parseFeature(FEATURE);

describe('features/employer_hub.feature', () => {
  it('parsed the feature file, and every scenario carries an acceptance ID', () => {
    assert.ok(SCENARIOS.length >= 10, `only ${SCENARIOS.length} scenarios parsed`);
    for (const scenario of SCENARIOS) {
      assert.ok(scenario.steps.length > 0, `${scenario.name} has no steps`);
      const acs = scenario.tags.filter((t) => /^@P4-[A-Z]\d+$/.test(t));
      assert.ok(acs.length > 0, `${scenario.name} carries no @P4-* acceptance tag`);
    }
  });

  it('every acceptance tag is a real row in spec/acceptance.md', () => {
    const spec = fs.readFileSync(path.join(root, 'spec', 'acceptance.md'), 'utf8');
    const tagged = new Set(SCENARIOS.flatMap((s) => s.tags).map((t) => t.slice(1)));
    assert.ok(tagged.size >= 10, `only ${tagged.size} distinct acceptance ids tagged`);
    for (const id of tagged) {
      assert.ok(new RegExp(`^\\|\\s*${id}\\s*\\|`, 'm').test(spec), `@${id} is tagged but is no row in the spec`);
    }
  });

  for (const scenario of SCENARIOS) {
    it(`${scenario.tags.join(' ')} ${scenario.name}`, () => {
      const world = {};
      for (const step of scenario.steps) runStep(world, step);
    });
  }
});

describe('the runner itself', () => {
  it('actually executed every step of every scenario', () => {
    const total = SCENARIOS.reduce((n, s) => n + s.steps.length, 0);
    assert.equal(stepsRun, total, `ran ${stepsRun} of ${total} steps - a partial run must not read as a pass`);
    assert.ok(total >= 40, `only ${total} steps in the feature file`);
  });

  it('refuses a step it has no definition for', () => {
    assert.throws(() => runStep({}, 'the tool decides who to hire'), /no step definition matches/);
  });
});
