/*
 * Unit tests for the matching and explanation logic.
 * Spec rows: spec/acceptance.md. Each test title starts with the AC id it
 * proves, and test/conformance.test.js fails if an mvp row in the spec claims
 * a test whose AC id appears in no test file.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { INDUSTRIES, INDUSTRY_BY_ID, findTask } from '../fixtures/industries.js';
import { SKILL_BY_ID, PREFERENCE_BY_ID, INTEREST_BY_ID } from '../fixtures/vocabulary.js';
import { CANDIDATES, CANDIDATE_BY_ID, DEMO } from '../fixtures/candidates.js';
import {
  parseNeeds, needFromTask, validateNeeds, skillRefsForNeed,
  loadCandidate, enterCandidateManually, suggestMatches, explain,
  MIN_NEEDS, MAX_NEEDS
} from '../web/match.js';
import { isTraceable } from '../web/guards.js';

/** The session ERI describes in their §7 demonstration. */
function demoSession() {
  const needs = parseNeeds(DEMO.needs);
  const candidate = loadCandidate(DEMO.candidateId);
  return { needs, candidate, result: suggestMatches({ industryId: DEMO.industryId, needs, candidate }) };
}

describe('industries and tasks (P4-M1, P4-F1)', () => {
  it('P4-M1 offers industries, each with recurring tasks an employer could borrow', () => {
    assert.ok(INDUSTRIES.length >= 5, `only ${INDUSTRIES.length} industries`);
    for (const industry of INDUSTRIES) {
      assert.ok(industry.recurringTasks.length >= 3, `${industry.id} has too few tasks`);
      assert.ok(INDUSTRY_BY_ID.get(industry.id) === industry);
    }
  });

  it('P4-M1 every task names only known skills, known traits and known interest areas', () => {
    for (const industry of INDUSTRIES) {
      for (const task of industry.recurringTasks) {
        assert.ok(task.skills.length > 0, `${task.id} declares no skills`);
        for (const skillId of task.skills) {
          assert.ok(SKILL_BY_ID.has(skillId), `${task.id} names unknown skill ${skillId}`);
        }
        for (const interestId of task.area || []) {
          assert.ok(INTEREST_BY_ID.has(interestId), `${task.id} names unknown interest ${interestId}`);
        }
        assert.ok(findTask(task.id).task === task);
      }
    }
  });

  it('P4-F1 a selected task becomes a need in the employer’s list, keeping its order', () => {
    const need = needFromTask('retail-inventory', 2);
    assert.equal(need.order, 2);
    assert.equal(need.fromTaskId, 'retail-inventory');
    assert.match(need.text, /inventory/i);
  });
});

describe('three to five needs (P4-M2)', () => {
  it('P4-M2 refuses fewer than three needs and more than five', () => {
    assert.equal(validateNeeds(parseNeeds(['a thing', 'another thing'])).ok, false);
    assert.equal(validateNeeds(parseNeeds(['a thing', 'another thing'])).code, 'too-few');
    assert.equal(validateNeeds(parseNeeds(['a', 'b', 'c'])).ok, true);
    assert.equal(validateNeeds(parseNeeds(['a', 'b', 'c', 'd', 'e'])).ok, true);
    assert.equal(validateNeeds(parseNeeds(['a', 'b', 'c', 'd', 'e', 'f'])).code, 'too-many');
    assert.equal(MIN_NEEDS, 3);
    assert.equal(MAX_NEEDS, 5);
  });

  it('P4-M2 drops blank lines and keeps entry order', () => {
    const needs = parseNeeds(['  count the stock ', '', '   ', 'face the shelves']);
    assert.equal(needs.length, 2);
    assert.equal(needs[0].text, 'count the stock');
    assert.deepEqual(needs.map((n) => n.order), [0, 1]);
  });

  it('P4-M2 an error message says what to do, in plain words, with no jargon', () => {
    const message = validateNeeds(parseNeeds(['one thing'])).message;
    assert.match(message, /at least three/);
    assert.doesNotMatch(message, /invalid|error|required field/i);
  });
});

describe('the employer’s own words pick the skill (P4-F2, P4-S3)', () => {
  it('P4-F2 matches on a real word out of the employer’s sentence and quotes it back', () => {
    const [need] = parseNeeds(['We never know our real inventory until someone counts it.']);
    const refs = skillRefsForNeed(need);
    const counting = refs.find((r) => r.skillId === 'counting-stock');
    assert.ok(counting, `no counting-stock ref in ${JSON.stringify(refs)}`);
    assert.ok(need.text.includes(counting.quote), `quote ${counting.quote} is not in the employer's sentence`);
    assert.match(counting.quote, /^counts$/i);
  });

  it('P4-F2 whole-word matching: "wipe down the counter" is cleaning, not counting stock', () => {
    const [need] = parseNeeds(['Someone has to wipe down the counter every hour.']);
    const ids = skillRefsForNeed(need).map((r) => r.skillId);
    assert.ok(ids.includes('cleaning'), 'expected cleaning');
    assert.ok(!ids.includes('counting-stock'), '"counter" must not be read as "count" - that false positive is why matching is whole-word');
  });

  it('P4-S3 a need that names nothing in the vocabulary yields nothing: the tool does not guess', () => {
    const [need] = parseNeeds(['The vibe in here needs a total rethink, honestly.']);
    assert.deepEqual(skillRefsForNeed(need), []);
  });

  it('P4-F1 a need borrowed from the industry list carries that task’s skills, quoting the task line', () => {
    const need = needFromTask('retail-price', 0);
    const refs = skillRefsForNeed(need);
    assert.ok(refs.some((r) => r.skillId === 'careful-repetition'), 'template skills should come through');
    for (const ref of refs) assert.ok(need.text.includes(ref.quote));
  });
});

describe('candidate input (P4-M3)', () => {
  it('P4-M3 the default is the profile the candidate shared, and it says so', () => {
    const profile = loadCandidate('cand-avery');
    assert.equal(profile.entryMode, 'shared-by-candidate');
    assert.equal(profile.consent.shareApproved, true);
    assert.ok(profile.ownWords, 'a shared profile carries the person’s own words');
  });

  it('P4-V2 refuses a profile with no recorded permission to share it', () => {
    const tampered = new Map([['cand-x', { ...CANDIDATE_BY_ID.get('cand-avery'), id: 'cand-x', consent: { shareApproved: false } }]]);
    assert.throws(() => loadCandidate('cand-x', tampered), /no recorded permission/);

    const missing = new Map([['cand-y', { ...CANDIDATE_BY_ID.get('cand-avery'), id: 'cand-y', consent: undefined }]]);
    assert.throws(() => loadCandidate('cand-y', missing), /no recorded permission/);
  });

  it('P4-M3 manual entry works as the fallback and is stamped as the employer’s account', () => {
    const typed = enterCandidateManually({
      displayName: 'Jo',
      skills: ['organizing', 'counting-stock'],
      preferences: ['routine-work']
    });
    assert.equal(typed.entryMode, 'typed-by-employer');
    assert.match(typed.consent.note, /The employer typed this/);
    assert.deepEqual(typed.skills, ['organizing', 'counting-stock']);
  });

  it('P4-M3 manual entry refuses free-text abilities: skills come from the shared vocabulary', () => {
    assert.throws(
      () => enterCandidateManually({ skills: ['really good with people'] }),
      /unknown skill/
    );
  });

  it('P4-V1 manual entry refuses any field that looks like disability information', () => {
    assert.throws(() => enterCandidateManually({ skills: [], diagnosis: 'anything' }), /does not accept disability information/);
    assert.throws(() => enterCandidateManually({ skills: [], disabilityType: 'anything' }), /does not accept disability information/);
    assert.throws(() => enterCandidateManually({ skills: [], medicalNotes: 'anything' }), /does not accept disability information/);
  });

  it('P4-M3 every fixture profile uses only vocabulary ids, so a sibling portfolio could emit them', () => {
    for (const candidate of CANDIDATES) {
      for (const id of candidate.skills) assert.ok(SKILL_BY_ID.has(id), `${candidate.id}: unknown skill ${id}`);
      for (const id of candidate.preferences) assert.ok(PREFERENCE_BY_ID.has(id), `${candidate.id}: unknown preference ${id}`);
      for (const id of candidate.interests) assert.ok(INTEREST_BY_ID.has(id), `${candidate.id}: unknown interest ${id}`);
    }
  });
});

describe('suggestions (P4-M4, P4-S2)', () => {
  it('P4-M4 ERI’s retail demonstration produces suggestions from the employer’s own needs', () => {
    const { needs, result } = demoSession();
    assert.ok(result.suggestions.length >= 3, `only ${result.suggestions.length} suggestions`);
    const needIds = new Set(needs.map((n) => n.id));
    for (const s of result.suggestions) {
      assert.ok(needIds.has(s.need.id), 'every suggestion cites a need the employer entered');
    }
  });

  it('P4-S2 at least three plausible workplace tasks come out of the demonstration', () => {
    const { result } = demoSession();
    assert.ok(
      result.meta.distinctTaskShapes.length >= 3,
      `only ${result.meta.distinctTaskShapes.length} distinct task shapes: ${result.meta.distinctTaskShapes.join(' | ')}`
    );
  });

  it('P4-M4 only skills the candidate actually shared can appear', () => {
    const { candidate, result } = demoSession();
    const shared = new Set(candidate.skills);
    for (const s of result.suggestions) assert.ok(shared.has(s.skill.id), `${s.skill.id} was never shared`);
  });

  it('P4-S3 a need with no overlap is reported as an honest gap, not filled in', () => {
    const { result } = demoSession();
    const gap = result.unmatchedNeeds.find((u) => /displays/i.test(u.text));
    assert.ok(gap, 'the displays need should be unmatched for this candidate');
    assert.equal(gap.reason, 'no-overlap');
    assert.match(gap.message, /honest gap/);
  });

  it('P4-S3 an unrecognised need is reported as unrecognised, with no invented match', () => {
    const needs = parseNeeds(['count the stock', 'face the shelves', 'The vibe in here needs a total rethink.']);
    const candidate = loadCandidate('cand-avery');
    const result = suggestMatches({ industryId: 'retail', needs, candidate });
    const gap = result.unmatchedNeeds.find((u) => /vibe/i.test(u.text));
    assert.ok(gap);
    assert.equal(gap.reason, 'no-vocabulary-hit');
  });

  it('P4-V3 takes one candidate only: passing a list throws rather than comparing people', () => {
    const needs = parseNeeds(DEMO.needs);
    assert.throws(
      () => suggestMatches({ industryId: 'retail', needs, candidate: [loadCandidate('cand-avery'), loadCandidate('cand-bo')] }),
      /does not compare or rank people/
    );
  });

  it('P4-M4 a candidate whose skills are a different trade gets no invented suggestions', () => {
    const needs = parseNeeds(DEMO.needs);
    const result = suggestMatches({ industryId: 'retail', needs, candidate: loadCandidate('cand-emi') });
    for (const s of result.suggestions) assert.ok(loadCandidate('cand-emi').skills.includes(s.skill.id));
    assert.ok(result.unmatchedNeeds.length > 0, 'the mismatch should surface as gaps, not as filler');
  });
});

describe('explanations (P4-M5, P4-S4)', () => {
  it('P4-M5 every suggestion names the employer need and the candidate skill it came from', () => {
    const { result } = demoSession();
    assert.ok(result.suggestions.length > 0);
    for (const s of result.suggestions) {
      const verdict = isTraceable(s);
      assert.ok(verdict.ok, `${s.id}: ${verdict.problems.join('; ')}`);
      assert.equal(s.citations.need.source, 'employer');
      assert.equal(s.citations.skill.source, 'candidate');
      assert.ok(s.explanation.includes(s.citations.need.quote));
      assert.ok(s.explanation.includes(s.citations.skill.quote));
    }
  });

  it('P4-S4 the explanation is a fixed template over two quotes, not generated prose', () => {
    const [need] = parseNeeds(['We need the stock counted every Monday.']);
    const text = explain({ need, needQuote: 'counted', via: 'the words you typed', candidateName: 'Avery', skillName: 'counting stock' });
    assert.ok(text.includes('"counted"'));
    assert.ok(text.includes('"counting stock"'));
    assert.ok(text.includes(need.text));
    assert.match(text, /not a judgement about anyone/);
  });

  it('P4-S4 nothing is dropped in the demonstration, and drops would be reported if they were', () => {
    const { result } = demoSession();
    assert.deepEqual(result.droppedSuggestions, []);
    assert.ok(Array.isArray(result.droppedSuggestions), 'the drop channel exists so a failure is visible');
  });
});

describe('work preferences are notes, never a tally (P4-V3)', () => {
  it('P4-V3 a preference note carries one of exactly two labels and no number', () => {
    const { result } = demoSession();
    const notes = result.suggestions.flatMap((s) => s.preferenceNotes);
    assert.ok(notes.length > 0, 'the retail demonstration should produce preference notes');
    for (const n of notes) {
      assert.ok(['fits', 'worth discussing'].includes(n.label), `unexpected label ${n.label}`);
      assert.ok(PREFERENCE_BY_ID.has(n.preferenceId));
      assert.doesNotMatch(n.text, /\d/, 'a preference note must not contain a number');
    }
  });

  it('P4-V3 a clash is reachable, names the task, and reads as something to discuss', () => {
    const { result } = demoSession();
    const clashes = result.suggestions.flatMap((s) => s.preferenceNotes).filter((n) => n.label === 'worth discussing');
    assert.ok(
      clashes.length > 0,
      'a clash must be REACHABLE or the two labels are theatre: Avery asked for routine work and ' +
      '"Setting up and maintaining product displays" is marked variable'
    );
    for (const n of clashes) {
      assert.match(n.text, /not a problem to solve for them/);
      assert.ok(n.taskLabel && n.text.includes(n.taskLabel), 'a clash names the task it is about');
    }
  });

  it('P4-V3 notes are per task, so a clash is not washed out by a union of traits', () => {
    const { result } = demoSession();
    const organizing = result.suggestions.find((s) => s.skill.id === 'organizing');
    assert.ok(organizing, 'the demonstration should produce an organizing suggestion');
    const labels = new Set(organizing.preferenceNotes.map((n) => `${n.taskId}:${n.preferenceId}:${n.label}`));
    assert.ok(
      labels.has('retail-displays:routine-work:worth discussing'),
      `expected a per-task clash, got: ${[...labels].join(', ')}`
    );
    assert.ok(labels.has('retail-restock:routine-work:fits'), 'and a fit on the sibling task');
  });
});
