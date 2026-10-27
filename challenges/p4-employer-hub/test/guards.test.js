/*
 * The guards are ERI's §10 as code. A guard that has never been shown to fail
 * has not been shown to work, so every test here has two halves:
 *   1. a POSITIVE CONTROL - a deliberately broken input the guard must catch
 *   2. the real output - which the guard must pass
 * Half 1 is not padding. Without it, a guard with a typo'd regex is a green
 * test that enforces nothing, which is exactly the fake-green this whole
 * challenge is written against.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  findRankingViolations, isEmployerOrdered, isTraceable, enforceTraceability,
  findDisclosureFields, findDisclosureFieldsInProfile, findAdviceProse,
  findDecisionLanguage, DISCLOSURE_WORD_PATTERN
} from '../web/guards.js';
import { parseNeeds, loadCandidate, suggestMatches } from '../web/match.js';
import { buildActionPlan } from '../web/plan.js';
import { CANDIDATES, DEMO } from '../fixtures/candidates.js';
import { RESOURCES, LEGAL_REFERRAL, DECISION_NOTICE } from '../fixtures/resources.js';
import { INDUSTRIES } from '../fixtures/industries.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function demoSession() {
  const needs = parseNeeds(DEMO.needs);
  const candidate = loadCandidate(DEMO.candidateId);
  const result = suggestMatches({ industryId: DEMO.industryId, needs, candidate });
  return { needs, candidate, result, plan: buildActionPlan(result) };
}

/* --------------------------------------------------------- P4-V3 no ranking */

describe('no ranking or scoring (P4-V3, P4-X2)', () => {
  it('P4-V3 the ranking guard catches a score, a rank, a percentage and a fraction', () => {
    assert.equal(findRankingViolations({ fitScore: 72 }).length > 0, true, 'fitScore must be caught');
    assert.equal(findRankingViolations({ rank: 1 }).length > 0, true, 'rank must be caught');
    assert.equal(findRankingViolations({ note: 'a 72% fit for this role' }).length > 0, true, 'a percentage in prose must be caught');
    assert.equal(findRankingViolations({ note: 'scored 8/10 on organisation' }).length > 0, true, 'a fraction in prose must be caught');
    assert.equal(findRankingViolations({ note: 'rated 4 out of 5' }).length > 0, true, '"4 out of 5" must be caught');
    assert.equal(findRankingViolations({ confidence: 0.91 }).length > 0, true, 'a bare probability must be caught');
    assert.equal(findRankingViolations({ nested: [{ deep: { candidateRating: 3 } }] }).length > 0, true, 'nesting must not hide it');
  });

  it('P4-V3 the real output contains no score, rank, percentage or stray number', () => {
    const { result, plan } = demoSession();
    const violations = findRankingViolations({ result, plan });
    assert.deepEqual(violations, [], violations.map((v) => `${v.path}: ${v.reason}`).join('\n'));
  });

  it('P4-V3 output order is the employer’s entry order, and the guard notices when it is not', () => {
    const { needs, result } = demoSession();
    assert.equal(isEmployerOrdered(result.suggestions, needs).ok, true);

    const reversed = [...result.suggestions].reverse();
    assert.equal(isEmployerOrdered(reversed, needs).ok, false, 'a reordered list must be caught');
    assert.match(isEmployerOrdered(reversed, needs).problem, /entry order/);
  });

  it('P4-V3 shuffling the candidate’s skill list does not change the order of suggestions', () => {
    const needs = parseNeeds(DEMO.needs);
    const candidate = loadCandidate(DEMO.candidateId);
    const forwards = suggestMatches({ industryId: DEMO.industryId, needs, candidate });
    const shuffled = suggestMatches({
      industryId: DEMO.industryId,
      needs,
      candidate: { ...candidate, skills: [...candidate.skills].reverse() }
    });
    assert.deepEqual(
      shuffled.suggestions.map((s) => s.id),
      forwards.suggestions.map((s) => s.id),
      'order must follow the employer’s needs, not anything about the person'
    );
  });

  it('P4-V3 adding more overlapping skills does not promote a later need', () => {
    const needs = parseNeeds([
      'We need the stock counted every Monday.',
      'The shelves need facing and restocking before we open.',
      'New stock sits in the back room with no price tags.'
    ]);
    const candidate = loadCandidate('cand-avery');
    const result = suggestMatches({ industryId: 'retail', needs, candidate });
    const firstNeedIds = result.suggestions.map((s) => s.need.id);
    assert.deepEqual([...firstNeedIds].sort(), firstNeedIds, 'need ids must come out already in entry order');
  });

  it('P4-X1 the matching module exposes no way to compare, rank or shortlist people', () => {
    const source = read('web/match.js');
    const exported = [...source.matchAll(/export (?:function|const) (\w+)/g)].map((m) => m[1]);
    assert.ok(exported.length > 0);
    for (const name of exported) {
      assert.doesNotMatch(name, /compare|rank|shortlist|screen|applicants|leaderboard|best/i, `${name} is the wrong shape for this tool`);
    }
  });
});

/* -------------------------------------------- P4-S3 traceable reasoning only */

describe('mechanically traceable reasoning (P4-S3, P4-M5)', () => {
  it('P4-S3 the traceability guard rejects a suggestion that cannot cite both sides', () => {
    const { result } = demoSession();
    const good = result.suggestions[0];
    assert.equal(isTraceable(good).ok, true);

    const noQuote = { ...good, citations: { ...good.citations, need: { ...good.citations.need, quote: '' } } };
    assert.equal(isTraceable(noQuote).ok, false, 'a missing employer quote must be caught');

    const lyingExplanation = { ...good, explanation: 'This felt like a good fit to me.' };
    const verdict = isTraceable(lyingExplanation);
    assert.equal(verdict.ok, false, 'free-text reasoning that does not contain its own citations must be caught');
    assert.ok(verdict.problems.some((p) => /does not contain the employer quote/.test(p)));

    const wrongSource = { ...good, citations: { ...good.citations, skill: { ...good.citations.skill, source: 'the tool' } } };
    assert.equal(isTraceable(wrongSource).ok, false, 'a skill not attributed to the candidate must be caught');
  });

  it('P4-S3 enforceTraceability drops the untraceable one, keeps the rest, and reports the drop', () => {
    const { result } = demoSession();
    const good = result.suggestions[0];
    const broken = { ...good, id: 'broken', explanation: 'Trust me.' };
    const { kept, dropped } = enforceTraceability([good, broken]);
    assert.deepEqual(kept.map((s) => s.id), [good.id]);
    assert.equal(dropped.length, 1);
    assert.equal(dropped[0].suggestion.id, 'broken');
    assert.ok(dropped[0].problems.length > 0, 'a drop must say why, or it is a silent filter');
  });

  it('P4-S3 every citation quote is really present in the source it claims', () => {
    const { needs, candidate, result } = demoSession();
    const needText = new Map(needs.map((n) => [n.id, n.text]));
    for (const s of result.suggestions) {
      assert.ok(
        needText.get(s.need.id).toLowerCase().includes(s.citations.need.quote.toLowerCase()),
        `${s.id}: quoted "${s.citations.need.quote}" is not in the employer's need`
      );
      assert.ok(candidate.skills.includes(s.skill.id), `${s.id}: cites a skill the candidate never shared`);
    }
  });
});

/* -------------------------- P4-V1 / P4-V6 no disability information, anywhere */

describe('no disclosure field, by construction (P4-V1, P4-V6)', () => {
  it('P4-V1 the HTML scanner catches a disclosure field when one exists', () => {
    const broken = `
      <label for="dx">Diagnosis</label><input id="dx" name="dx">
      <label for="w">Does the candidate use a wheelchair?</label><input type="checkbox" id="w">
      <fieldset><legend>Medical information</legend></fieldset>`;
    const hits = findDisclosureFields(broken);
    assert.ok(hits.length >= 3, `positive control should trip the scanner, got ${hits.length}`);
  });

  it('P4-V1 web/index.html has no disclosure field, prompt, label or legend', () => {
    const hits = findDisclosureFields(read('web/index.html'));
    assert.deepEqual(hits, [], hits.map((h) => `${h.where}: ${h.snippet}`).join('\n'));
  });

  it('P4-V6 the profile scanner catches a disability label when one is planted', () => {
    const tampered = { ...CANDIDATES[0], disabilityType: 'autism' };
    assert.ok(findDisclosureFieldsInProfile(tampered).length > 0, 'a planted key must be caught');

    const inValue = { ...CANDIDATES[0], ownWords: 'My diagnosis is in the paperwork.' };
    assert.ok(findDisclosureFieldsInProfile(inValue).length > 0, 'a planted value must be caught');
  });

  it('P4-V6 no fixture profile carries a disability key or names a diagnosis', () => {
    for (const candidate of CANDIDATES) {
      const hits = findDisclosureFieldsInProfile(candidate);
      assert.deepEqual(hits, [], `${candidate.id}: ${hits.map((h) => h.path + ' ' + h.reason).join(', ')}`);
    }
  });

  it('P4-V6 the matching output carries no disability field: there is no label to key an accommodation off', () => {
    const { result, plan } = demoSession();
    const keysSeen = new Set();
    const walk = (node) => {
      if (node === null || typeof node !== 'object') return;
      if (Array.isArray(node)) return node.forEach(walk);
      for (const [k, v] of Object.entries(node)) { keysSeen.add(k); walk(v); }
    };
    walk({ result, plan });
    const offenders = [...keysSeen].filter((k) => DISCLOSURE_WORD_PATTERN.test(k));
    assert.deepEqual(offenders, [], `disability-shaped keys reached the output: ${offenders.join(', ')}`);
  });

  it('P4-V6 no task, skill, preference or interest is defined in terms of a person’s condition', () => {
    for (const industry of INDUSTRIES) {
      for (const task of industry.recurringTasks) {
        const hits = findDisclosureFieldsInProfile(task);
        assert.deepEqual(hits, [], `${task.id}: ${JSON.stringify(hits)}`);
      }
    }
  });
});

/* ------------------------------------- P4-V4 no decision, P4-V7 no legal advice */

describe('no automated decision and no generated legal advice (P4-V4, P4-V7)', () => {
  it('P4-V4 the decision-language guard catches decision phrasing', () => {
    assert.ok(findDecisionLanguage({ a: 'We recommend hiring this candidate.' }).length > 0);
    assert.ok(findDecisionLanguage({ a: 'This candidate was rejected.' }).length > 0);
    assert.ok(findDecisionLanguage({ a: 'Accommodation approved.' }).length > 0);
    assert.ok(findDecisionLanguage({ a: 'Not a good fit for the role.' }).length > 0);
    assert.ok(findDecisionLanguage({ a: 'The tool recommends Avery.' }).length > 0);
  });

  it('P4-V4 neither the suggestions nor the plan ever read as a decision', () => {
    const { result, plan } = demoSession();
    const hits = findDecisionLanguage({ result, plan });
    assert.deepEqual(hits, [], hits.map((h) => `${h.path}: ${h.reason}`).join('\n'));
    assert.equal(result.meta.decides, 'nothing');
    assert.equal(plan.provenance.decides, 'nothing');
  });

  it('P4-V7 the advice-prose guard catches legal advice', () => {
    assert.ok(findAdviceProse({ a: 'You must provide this accommodation.' }).length > 0);
    assert.ok(findAdviceProse({ a: 'It is illegal to ask that question.' }).length > 0);
    assert.ok(findAdviceProse({ a: 'You should not ask about a diagnosis.' }).length > 0);
    assert.ok(findAdviceProse({ a: 'The law requires a written response.' }).length > 0);
  });

  it('P4-V7 the resource list points at sources and gives no advice of its own', () => {
    const hits = findAdviceProse({ RESOURCES, LEGAL_REFERRAL, DECISION_NOTICE });
    assert.deepEqual(hits, [], hits.map((h) => `${h.path}: ${h.reason}`).join('\n'));
    for (const r of RESOURCES) {
      assert.ok(r.url || r.phone, `${r.id} is not a pointer to anything`);
      assert.ok(r.publisher, `${r.id} does not say who published it`);
    }
  });

  it('P4-V7 the plan and suggestions give no advice of their own either', () => {
    const { result, plan } = demoSession();
    const hits = findAdviceProse({ result, plan });
    assert.deepEqual(hits, [], hits.map((h) => `${h.path}: ${h.reason}`).join('\n'));
  });
});
