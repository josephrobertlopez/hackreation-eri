/*
 * Drives web/app.js for real, under the small DOM in test/dom-stub.js.
 *
 * What this earns: proof the page wiring runs - element ids resolve, the demo
 * button fills the form, submitting renders explanations, and the ethical
 * notices reach the rendered output. Before this file existed, app.js was
 * never executed by any test.
 *
 * What it does not earn: anything about screen readers, layout, contrast or
 * real browser behaviour. spec/acceptance.md keeps P4-A1 to P4-A3 as `human`.
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

import { installDom } from './dom-stub.js';

let dom;

before(async () => {
  dom = installDom();
  await import('../web/app.js');
});

describe('the stub is non-degenerate before anything is trusted', () => {
  it('finds the ids the real page declares', () => {
    for (const id of ['hub-form', 'industry', 'candidate', 'need-1', 'need-5', 'results', 'results-h', 'plan-body', 'error-summary', 'manual-skills', 'template-list']) {
      assert.ok(dom.document.getElementById(id), `stub is missing #${id}, which web/index.html declares`);
    }
  });

  it('the selector engine really resolves: two mode radios, one of them checked', () => {
    assert.equal(dom.document.querySelectorAll('input[name="mode"]').length, 2);
    const checked = dom.document.querySelector('input[name="mode"]:checked');
    assert.ok(checked, 'a selector engine that returned nothing would make every later test vacuous');
    assert.equal(checked.getAttribute('value'), 'shared', 'the shared profile is the default - that is the design call');
  });

  it('the selector engine resolves a descendant-of-id selector', () => {
    const boxes = dom.document.querySelectorAll('#manual-skills input');
    assert.ok(boxes.length >= 20, `app.js should have built the skill checkboxes, found ${boxes.length}`);
    assert.equal(dom.document.querySelectorAll('#manual-skills input:checked').length, 0, 'nothing ticked yet');
  });
});

describe('the page populates itself from the fixtures (P4-M1, P4-M3)', () => {
  it('P4-M1 the industry select is filled from fixtures/industries.js', () => {
    /* Eight, not nine: the "Choose an industry" placeholder is static markup in
     * web/index.html, and the stub only carries elements with an id plus the
     * form controls - it does not parse child options. These eight are the ones
     * app.js appended from the fixture. */
    const options = dom.document.getElementById('industry').children;
    assert.equal(options.length, 8, `expected the eight fixture industries, got ${options.length}`);
    assert.match(dom.document.getElementById('industry').textContent, /Retail store/);
  });

  it('P4-M3 the profile select is filled, and every entry says when it was shared', () => {
    const text = dom.document.getElementById('candidate').textContent;
    assert.match(text, /Avery \(fictional\)/);
    assert.match(text, /shared 2026-/);
  });

  it('P4-F7 the resource list renders with publishers and phone numbers', () => {
    const text = dom.document.getElementById('resource-list').textContent;
    assert.match(text, /Job Accommodation Network/);
    assert.match(text, /1-800-526-7234/);
    assert.match(text, /Wisconsin DVR/);
  });

  it('P4-A1 the figure is placed as inline SVG with a title and a desc', () => {
    const text = dom.document.getElementById('figure-trace').textContent;
    assert.match(text, /<svg/);
    assert.match(text, /<title id="trace-t">/);
    assert.match(text, /<desc id="trace-d">/);
  });
});

describe('ERI’s retail demonstration, driven through the page (P4-S1)', () => {
  it('P4-S1 the demo button fills the industry, the needs and the profile', () => {
    dom.document.getElementById('demo').dispatchEvent(new globalThis.Event('click'));
    assert.equal(dom.document.getElementById('industry').value, 'retail');
    assert.match(dom.document.getElementById('need-1').value, /inventory/);
    assert.equal(dom.document.getElementById('candidate').value, 'cand-avery');
    assert.match(dom.document.getElementById('candidate-preview').textContent, /in their own words/);
    assert.match(dom.document.getElementById('candidate-preview').textContent, /Permission on record/);
  });

  it('P4-M4 submitting renders suggestions, and the results section is revealed', () => {
    dom.document.getElementById('hub-form').dispatchEvent(new globalThis.Event('submit'));
    assert.equal(dom.document.getElementById('error-summary').hidden, true, 'the demo should not error');
    assert.equal(dom.document.getElementById('results').hidden, false);
    assert.ok(dom.document.getElementById('results-h').focusCount > 0, 'focus has to move to the result');
    const body = dom.document.getElementById('results-body').textContent;
    assert.ok(body.length > 400, `results look empty: ${body.slice(0, 120)}`);
  });

  it('P4-M5 every rendered suggestion shows the employer quote and the candidate skill', () => {
    const body = dom.document.getElementById('results-body').textContent;
    assert.match(body, /You wrote:/);
    assert.match(body, /Matched on:/);
    assert.match(body, /They shared:/);
    assert.match(body, /counting stock/);
    assert.match(body, /"counts"/);
  });

  it('P4-S3 the unmatched need is rendered rather than hidden', () => {
    const body = dom.document.getElementById('results-body').textContent;
    assert.match(body, /Needs with no match/);
    assert.match(body, /displays/);
  });

  it('P4-V3 nothing in the rendered output reads as a score or a rank', () => {
    const body = dom.document.getElementById('results-body').textContent;
    assert.doesNotMatch(body, /\d+\s*%/);
    assert.doesNotMatch(body, /\b\d+\s*\/\s*\d+\b/);
    assert.doesNotMatch(body, /\b(score|ranked|rating|best match|top match)\b/i);
    assert.match(body, /nothing here is sorted by goodness/);
  });

  it('P4-M6 the plan renders with steps, specialist questions and the referral', () => {
    assert.equal(dom.document.getElementById('plan-out').hidden, false);
    const body = dom.document.getElementById('plan-body').textContent;
    assert.match(body, /does not decide, rank or score/);
    assert.match(body, /Draft responsibilities/);
    assert.match(body, /employment specialist/);
    assert.match(body, /Legal and accommodation questions go to people/);
    assert.match(body, /askjan|JAN/);
    assert.match(body, /Stored anywhere: no/);
  });
});

describe('the form refuses to proceed on bad input (P4-M2, P4-A5)', () => {
  it('P4-M2 fewer than three needs produces a focused error, not a result', () => {
    for (const n of [2, 3, 4, 5]) dom.document.getElementById(`need-${n}`).value = '';
    const summary = dom.document.getElementById('error-summary');
    const focusBefore = summary.focusCount;

    dom.document.getElementById('hub-form').dispatchEvent(new globalThis.Event('submit'));

    assert.equal(summary.hidden, false, 'the error summary must be shown');
    assert.ok(summary.focusCount > focusBefore, 'and must take focus');
    assert.match(summary.textContent, /at least three/);
    assert.equal(dom.document.getElementById('results').hidden, true, 'no results while the form is wrong');
  });

  it('P4-A5 the needs that are missing are marked aria-invalid', () => {
    assert.equal(dom.document.getElementById('need-2').getAttribute('aria-invalid'), 'true');
    assert.equal(dom.document.getElementById('need-1').getAttribute('aria-invalid'), 'false');
  });
});
