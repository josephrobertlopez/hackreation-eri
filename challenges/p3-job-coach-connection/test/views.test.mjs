/*
 * The screens themselves. src/views.js is pure, so these assert on the exact
 * HTML a browser would receive.
 *
 * The escaping tests are not theatre. The employee can type into the message
 * box, the coach can type into the reply box, and both strings are
 * interpolated into markup. An unescaped one is a cross-site scripting hole in
 * a tool built for people who are routinely given the least safe software.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  esc, deco, employeeScreen, requestCard, coachCard, coachInboxScreen,
  EMPLOYEE_SCREEN_NAMES
} from '../src/views.js';
import { createStore } from '../src/store.js';
import { coachView } from '../src/requests.js';
import { STATUS } from '../fixtures/copy.js';
import { COACH, EMPLOYEE } from '../fixtures/people.js';
import { read, fakeStorage, manualClock, COACH_ACTOR } from './helpers.mjs';

const NASTY = '<img src=x onerror="alert(1)"> & \'quote\' "double"';

function answeredWith(text, replyBody) {
  const clock = manualClock();
  const store = createStore({ storage: fakeStorage(), now: clock.now });
  clock.advance(1_000);
  const sent = store.submit({
    needId: 'task', employeeId: EMPLOYEE.id, employeeName: EMPLOYEE.name,
    coachId: COACH.id, text
  });
  clock.advance(1_000);
  return store.reply(sent.id, { actor: COACH_ACTOR, body: replyBody });
}

describe('escaping', () => {
  it('escapes the five characters that matter', () => {
    assert.equal(esc('<&>"\''), '&lt;&amp;&gt;&quot;&#39;');
    assert.equal(esc(null), '');
    assert.equal(esc(undefined), '');
    assert.equal(esc(42), '42');
  });

  it('a message the employee typed cannot become markup', () => {
    const request = answeredWith(NASTY, 'fine');
    const html = requestCard(request);
    assert.ok(!html.includes('<img'), 'a typed message rendered as an element');
    assert.ok(!html.includes('onerror="alert'), 'a typed message rendered an event handler');
    assert.ok(html.includes('&lt;img'), 'the message was dropped rather than escaped');
  });

  it('a reply the coach typed cannot become markup, on either screen', () => {
    const request = answeredWith('hello', NASTY);
    const employee = employeeScreen('sent', { request });
    const coach = coachInboxScreen([coachView(request)], request.id);
    for (const [name, html] of [['employee screen', employee], ['coach dashboard', coach]]) {
      assert.ok(!html.includes('<img'), name + ' rendered a typed reply as an element');
      assert.ok(html.includes('&lt;img'), name + ' dropped the reply instead of escaping it');
    }
  });

  it('an icon beside a label is hidden from assistive tech', () => {
    assert.match(deco('<svg/>'), /^<span aria-hidden="true"><svg\/><\/span>$/);
  });
});

describe('the screens are total: every state renders something', () => {
  it('renders all six named screens', () => {
    for (const name of EMPLOYEE_SCREEN_NAMES) {
      const html = employeeScreen(name, { draft: { needId: 'task' }, requests: [] });
      assert.ok(html.length > 50, name + ' rendered almost nothing');
      assert.match(html, /<h1 tabindex="-1">/, name + ' has no heading to send focus to');
    }
  });

  it('refuses a screen that does not exist, instead of rendering blank', () => {
    assert.throws(() => employeeScreen('nope'), /No screen called "nope"/);
  });

  it('falls back rather than crashing when the state is missing', () => {
    // compose with no need chosen, and the confirmation with nothing to show:
    // both are reachable by a reload, and neither may be a blank page.
    assert.match(employeeScreen('compose', { draft: {} }), /<h1 tabindex="-1">/);
    assert.match(employeeScreen('sent', {}), /<h1 tabindex="-1">/);
    assert.match(employeeScreen('history', {}), /<h1 tabindex="-1">/);
  });

  it('an empty inbox says what to do, rather than nothing', () => {
    const html = coachInboxScreen([], null);
    assert.match(html, /another tab/);
  });
});

describe('the status words come from the fixtures and nowhere else', () => {
  it('no status label is written into the view code', () => {
    const source = read('src/views.js');
    for (const [name, s] of Object.entries(STATUS)) {
      assert.ok(!source.includes("'" + s.label + "'"),
        'src/views.js hard-codes the ' + name + ' label; it must come from fixtures/copy.js');
    }
  });

  it('the view layer never reads the clock to decide anything', () => {
    const source = read('src/views.js').replace(/\/\*[\s\S]*?\*\//g, '');
    assert.ok(!source.includes('Date.now'), 'src/views.js reads the clock');
    // new Date(ms) is formatting a timestamp it was given, which is fine:
    assert.ok(/new Date\(ms\)/.test(source));
    assert.ok(!/new Date\(\)/.test(source), 'src/views.js makes up a time of its own');
  });

  it('a card shows the coach who answered, by name', () => {
    const request = answeredWith('hello', 'Start with step 1.');
    const html = coachCard(coachView(request), request.id);
    assert.ok(html.includes('You answered at'), 'the coach cannot see their own reply');
    assert.ok(requestCard(request).includes(COACH.name + ' answered at'),
      'the employee cannot see who answered');
  });
});
