/*
 * The employer action plan: ERI's §6 step 6, §9 bullet 5, §9 bullet 6, and the
 * thing their §7 demonstration ends with - questions for the employer, the
 * candidate and an employment specialist to work through together.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { parseNeeds, loadCandidate, suggestMatches } from '../web/match.js';
import { buildActionPlan, draftTaskBundle, QUESTIONS_FOR_SPECIALIST } from '../web/plan.js';
import { DEMO } from '../fixtures/candidates.js';
import { RESOURCES } from '../fixtures/resources.js';

function demoSession() {
  const needs = parseNeeds(DEMO.needs);
  const candidate = loadCandidate(DEMO.candidateId);
  const result = suggestMatches({ industryId: DEMO.industryId, needs, candidate });
  return { needs, candidate, result, plan: buildActionPlan(result) };
}

describe('draft responsibilities (P4-F3)', () => {
  it('P4-F3 groups the suggestions into draft responsibilities the employer could combine', () => {
    const { result } = demoSession();
    const bundle = draftTaskBundle(result);
    assert.ok(bundle.length >= 3, `only ${bundle.length} draft responsibilities`);
  });

  it('P4-F3 every draft responsibility still names the need and the skill behind it', () => {
    const { result } = demoSession();
    for (const item of draftTaskBundle(result)) {
      assert.ok(item.becauseOf.length > 0, `${item.label} exists for no stated reason`);
      for (const because of item.becauseOf) {
        assert.ok(because.needQuote, 'no employer quote');
        assert.ok(because.skillQuote, 'no candidate quote');
        assert.ok(because.needId, 'no need id to trace back to');
      }
    }
  });

  it('P4-F3 the bundle is in the employer’s need order, not sorted by anything', () => {
    const { needs, result } = demoSession();
    const order = new Map(needs.map((n, i) => [n.id, i]));
    const firstTouch = draftTaskBundle(result).map((b) => order.get(b.becauseOf[0].needId));
    assert.deepEqual(firstTouch, [...firstTouch].sort((a, b) => a - b), 'insertion order should follow the needs');
  });
});

describe('next steps (P4-M6, P4-S5)', () => {
  it('P4-M6 produces a plan with a heading, steps and a stated provenance', () => {
    const { plan } = demoSession();
    assert.match(plan.heading, /Retail store/);
    assert.ok(plan.steps.length >= 4, `only ${plan.steps.length} steps`);
    for (const step of plan.steps) {
      assert.ok(step.heading.length > 10, 'a step needs a real heading');
      assert.ok(step.detail.length > 20, 'a step needs to say what to actually do');
    }
    assert.equal(plan.provenance.storedAnywhere, 'no - this page keeps nothing and sends nothing');
  });

  it('P4-S5 the first step hands control back to the employer', () => {
    const { plan } = demoSession();
    assert.match(plan.steps[0].heading, /cross out/i);
  });

  it('P4-S5 a step shares the draft with the candidate and names them', () => {
    const { plan } = demoSession();
    const share = plan.steps.find((s) => /share the draft/i.test(s.heading));
    assert.ok(share, 'the candidate has to be in the loop');
    assert.match(share.heading, /Avery/);
    assert.match(share.detail, /authority on their own work/);
  });

  it('P4-S5 a step brings an employment specialist in, which ERI’s §7 asks for', () => {
    const { plan } = demoSession();
    assert.ok(plan.steps.some((s) => /employment specialist/i.test(s.heading + s.detail)));
  });

  it('P4-S5 questions are written for three people to answer together, not for the tool to answer', () => {
    assert.ok(QUESTIONS_FOR_SPECIALIST.length >= 5);
    for (const q of QUESTIONS_FOR_SPECIALIST) {
      assert.ok(q.trim().endsWith('?'), `not a question: ${q}`);
      assert.doesNotMatch(q, /disabilit|diagnos|condition|impair/i, `a question must not be about disability: ${q}`);
    }
    const { plan } = demoSession();
    assert.deepEqual(plan.questionsForSpecialist, QUESTIONS_FOR_SPECIALIST);
  });

  it('P4-M6 training is planned from what the candidate said about being taught', () => {
    const { plan } = demoSession();
    const teach = plan.steps.find((s) => /taught/i.test(s.heading));
    assert.ok(teach, 'ERI’s §5 asks for practical ideas about how work is taught');
    assert.match(teach.detail, /Avery/);
  });

  it('P4-M6 unmatched needs are carried into the plan as open questions', () => {
    const { result, plan } = demoSession();
    assert.equal(plan.openQuestions.length, result.unmatchedNeeds.length);
    assert.ok(plan.openQuestions.length > 0, 'the retail demonstration leaves one need unmatched on purpose');
    for (const gap of plan.openQuestions) assert.ok(gap.talkAbout.length > 20);
  });
});

describe('resources and referral (P4-F7, P4-S6, P4-V7)', () => {
  it('P4-S6 the plan carries trusted resources, and every one is a real pointer', () => {
    const { plan } = demoSession();
    assert.ok(plan.resources.length >= 3, `only ${plan.resources.length} resources on the plan`);
    for (const r of plan.resources) assert.ok(r.url || r.phone, `${r.id} points nowhere`);
  });

  it('P4-F7 JAN, the EEOC and Wisconsin DVR are all present', () => {
    const publishers = RESOURCES.map((r) => r.publisher).join(' | ');
    assert.match(publishers, /Job Accommodation Network/);
    assert.match(publishers, /Equal Employment Opportunity Commission/);
    assert.match(publishers, /Wisconsin DVR/);
    assert.ok(RESOURCES.some((r) => /askjan\.org/.test(r.url || '')));
    assert.ok(RESOURCES.some((r) => /eeoc\.gov/.test(r.url || '')));
    assert.ok(RESOURCES.some((r) => /dwd\.wisconsin\.gov\/dvr/.test(r.url || '')));
  });

  it('P4-V7 the plan refers legal questions out, naming who to ask', () => {
    const { plan } = demoSession();
    assert.match(plan.legalReferral.body, /does not answer legal questions/);
    assert.match(plan.legalReferral.body, /JAN/);
    assert.match(plan.legalReferral.body, /EEOC/);
    assert.match(plan.legalReferral.body, /DVR/);
    for (const id of plan.legalReferral.resourceIds) {
      assert.ok(RESOURCES.some((r) => r.id === id), `referral points at unknown resource ${id}`);
    }
  });

  it('P4-V4 the plan leads with the notice that it does not decide, rank or score', () => {
    const { plan } = demoSession();
    assert.match(plan.decisionNotice.heading, /does not decide, rank or score/);
    assert.match(plan.decisionNotice.body, /People make those/);
  });
});
