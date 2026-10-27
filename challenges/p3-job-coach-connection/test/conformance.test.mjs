/*
 * One test per MVP-disposition requirement in spec/acceptance.md, named with
 * its ID so a failure says which line of ERI's brief just broke.
 *
 * Most of these assert on the real rendered markup, because src/views.js is
 * pure: `employeeScreen('compose', {draft})` returns exactly the HTML a
 * browser would get. Where a test reads source or CSS instead, it is a proxy
 * and spec/acceptance.md says so in its Kind column.
 *
 * The two suites that matter most are at the bottom:
 *
 *   "P3-P3 nothing here reports presence or promises a reply" - ERI section 10
 *   forbids implying a job coach is always there the moment you need one. That
 *   sentence is in their privacy paragraph, not the MVP list and not the
 *   success criteria, so it is the requirement most likely to be skipped by a
 *   prototype that still demos well. It is enforced as a scan of every shipped
 *   file AND of every rendered screen.
 *
 *   "P3-P4 routine and emergency are different paths" - same paragraph, same
 *   risk, plus a shape check, because a help button that looks like it summons
 *   help is harmful in a real emergency.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { ICONS } from '../fixtures/icons.js';
import { COACH, EMPLOYEE } from '../fixtures/people.js';
import { SUPPORT_NEEDS, SUPPORT_NEED_IDS } from '../fixtures/support-needs.js';
import { EMPLOYEE_MESSAGES, messagesFor } from '../fixtures/employee-messages.js';
import { COACH_REPLIES } from '../fixtures/coach-replies.js';
import { EMERGENCY } from '../fixtures/emergency.js';
import { APP, DISCLOSURE, STATUS, EMPLOYEE_UI, COACH_UI } from '../fixtures/copy.js';
import { employeeScreen, coachInboxScreen, EMPLOYEE_SCREEN_NAMES } from '../src/views.js';
import { createStore } from '../src/store.js';
import { COACH_VIEW_KEYS } from '../src/requests.js';
import { read, shippedSources, fakeStorage, manualClock, resolvesFrom, COACH_ACTOR } from './helpers.mjs';

const indexHtml = read('web/index.html');
const coachHtml = read('web/coach.html');
const employeeJs = read('web/employee.js');
const coachJs = read('web/coach.js');
const css = read('web/style.css');

const words = (s) => s.trim().split(/\s+/).length;
const count = (haystack, needle) => haystack.split(needle).length - 1;

/* One real request, carried all the way to answered, so the screens can be
   rendered in every state they have. */
function scenario() {
  const clock = manualClock();
  const store = createStore({ storage: fakeStorage(), now: clock.now });
  clock.advance(1_000);
  const sent = store.submit({
    needId: 'task', employeeId: EMPLOYEE.id, employeeName: EMPLOYEE.name,
    coachId: COACH.id, messageId: 't1', text: messagesFor('task')[0].text
  });
  clock.advance(60_000);
  const seen = store.open(sent.id, COACH_ACTOR);
  clock.advance(60_000);
  const answered = store.reply(sent.id, {
    actor: COACH_ACTOR, body: COACH_REPLIES[0].text, replyId: COACH_REPLIES[0].id
  });
  return { store, sent, seen, answered, clock };
}

const S = scenario();
const DRAFT = { needId: 'task', messageId: 't1', text: messagesFor('task')[0].text };
const STATE = { draft: DRAFT, request: S.answered, requests: [S.answered] };

const SCREEN = Object.fromEntries(EMPLOYEE_SCREEN_NAMES.map((n) => [n, employeeScreen(n, STATE)]));
const SCREENS_ALL = Object.entries(SCREEN);
const CLOSED_INBOX = coachInboxScreen(S.store.coachInbox(), null);
const OPEN_INBOX = coachInboxScreen(S.store.coachInbox(), S.sent.id);

/** The markup of one button, so "icon AND text label" is checkable. */
function buttonAround(html, marker) {
  const at = html.indexOf(marker);
  assert.notEqual(at, -1, 'no button matching ' + marker);
  const start = html.lastIndexOf('<button', at);
  return html.slice(start, html.indexOf('</button>', at) + 9);
}

/* ----------------------------------------------------------------- ERI s4 */

describe('ERI section 4: core features', () => {
  it('P3-F1 a clearly labelled "I Need Help" option, large, with an icon and a text label', () => {
    assert.equal(EMPLOYEE_UI.helpButton, 'I Need Help');
    const button = buttonAround(SCREEN.home, 'data-action="need-help"');
    assert.match(button, /I Need Help/, 'the help button has no text label');
    assert.match(button, /<svg/, 'the help button has no icon');
    assert.match(button, /class="big primary-help"/);
    assert.match(css, /button\.primary-help \{[^}]*min-height: 88px/);
    assert.ok(indexHtml.includes('I Need Help'), 'the page ships without the help button in its static markup');
  });

  it('P3-F2 four support needs, including ERI’s three examples', () => {
    assert.equal(SUPPORT_NEEDS.length, 4);
    assert.deepEqual(SUPPORT_NEED_IDS, ['question', 'task', 'schedule', 'unexpected']);
    assert.ok(SUPPORT_NEEDS.some((n) => /have a question/i.test(n.label)));
    assert.ok(SUPPORT_NEEDS.some((n) => /do not understand my task/i.test(n.label)));
    assert.ok(SUPPORT_NEEDS.some((n) => /schedule changed/i.test(n.label)));
    assert.equal(count(SCREEN['choose-need'], 'data-action="pick-need"'), 4);
    for (const need of SUPPORT_NEEDS) {
      const button = buttonAround(SCREEN['choose-need'], 'data-need="' + need.id + '"');
      assert.ok(button.includes(need.label), need.id + ' renders without its text label');
      assert.match(button, /<svg/, need.id + ' renders without its icon');
    }
  });

  it('P3-F3 three ways to say it: predefined message, picture choice, or typing', () => {
    for (const id of SUPPORT_NEED_IDS) {
      assert.ok(messagesFor(id).length >= 3, id + ' has fewer than three predefined messages');
    }
    assert.equal(count(SCREEN.compose, 'data-action="pick-message"'), messagesFor('task').length);
    assert.match(SCREEN.compose, /<textarea id="own-text"/);
    assert.equal(count(SCREEN['choose-need'], '<svg'), 4, 'the needs are not pictures');
  });

  it('P3-F4 a sent request reaches the named coach’s inbox', () => {
    assert.equal(S.sent.coachId, COACH.id);
    assert.equal(S.store.coachInbox().length, 1);
  });

  it('P3-F5 exactly three statuses, each with its own words and its own icon, all rendered', () => {
    assert.deepEqual(Object.keys(STATUS), ['sent', 'seen', 'answered']);
    assert.equal(new Set(Object.values(STATUS).map((s) => s.label)).size, 3, 'two statuses read the same');
    assert.equal(new Set(Object.values(STATUS).map((s) => s.iconName)).size, 3, 'two statuses look the same');
    for (const [name, s] of Object.entries(STATUS)) {
      assert.ok(ICONS[s.iconName], 'no icon called ' + s.iconName);
      const request = { ...S.sent, status: name, replies: [] };
      const html = employeeScreen('sent', { ...STATE, request });
      assert.ok(html.includes(s.label), name + ' does not render its label');
      assert.ok(html.includes(s.detail), name + ' does not render its explanation');
      assert.ok(html.includes('status-' + name), name + ' has no class of its own to style');
    }
  });

  it('P3-F6 the coach can answer with a predefined reply or a short written one', () => {
    assert.ok(COACH_REPLIES.length >= 4);
    assert.match(OPEN_INBOX, /<select id="pick-/);
    assert.equal(count(OPEN_INBOX, '<option value="r'), COACH_REPLIES.length);
    assert.match(OPEN_INBOX, /<textarea id="text-/);
    assert.match(OPEN_INBOX, /data-reply="/);
  });

  it('P3-F7 the employee can review this session’s messages', () => {
    assert.ok(employeeScreen('history', { requests: [] }).includes(EMPLOYEE_UI.historyEmpty));
    const filled = employeeScreen('history', { requests: [S.answered] });
    assert.ok(filled.includes('I do not understand my task'), 'the history does not say what was asked');
    assert.ok(filled.includes(STATUS.answered.label), 'the history does not show the status');
  });
});

/* ----------------------------------------------------------------- ERI s6 */

describe('ERI section 6: the MVP, step by step', () => {
  it('P3-M1 the help option is on the home screen', () => {
    assert.match(indexHtml, /data-action="need-help"/);
    assert.match(SCREEN.home, /data-action="need-help"/);
  });

  it('P3-M2 choosing a need is one press per need', () => {
    assert.equal(count(SCREEN['choose-need'], '<button type="button" class="big" data-action="pick-need"'), 4);
  });

  it('P3-M3 the message is optional, and the screen says so', () => {
    assert.match(EMPLOYEE_UI.pickMessageHeading, /do not have to/);
    assert.match(EMPLOYEE_UI.typeHint, /no message at all/);
    assert.ok(SCREEN.compose.includes(EMPLOYEE_UI.typeHint));
    const store = createStore({ storage: fakeStorage(), now: manualClock().now });
    const sent = store.submit({ needId: 'question', employeeId: EMPLOYEE.id, coachId: COACH.id });
    assert.equal(sent.text, '');
    assert.equal(sent.messageSource, 'none');
  });

  it('P3-M4 the dashboard is a separate document, not a second panel', () => {
    assert.ok(coachHtml.includes('<main id="main">'), 'there is no coach page');
    assert.ok(!indexHtml.includes('coach.js'), 'the employee page loads the coach dashboard: that is one page pretending');
    assert.ok(!coachHtml.includes('employee.js'));
    assert.match(indexHtml, /href="coach\.html"/, 'there is no way to reach the dashboard from the demo');
    assert.match(employeeJs, /createChannel\(\)/);
    assert.match(coachJs, /createChannel\(\)/);
  });

  it('P3-M5 the coach acknowledges with a real press, and replies', () => {
    assert.match(CLOSED_INBOX, /data-open="/, 'there is no button to open a request');
    assert.match(coachJs, /store\.open\(id, ACTOR\)/);
    assert.match(coachJs, /store\.reply\(id, \{ actor: ACTOR/);
  });

  it('P3-M6 the reply is rendered on the employee screen', () => {
    const html = employeeScreen('sent', { ...STATE, request: S.answered });
    assert.ok(html.includes(COACH_REPLIES[0].text), 'the coach’s words are not on the employee screen');
    assert.ok(html.includes(COACH.name + ' answered at'), 'the reply is not attributed to anyone');
    assert.ok(html.includes(STATUS.answered.label));
  });
});

/* ----------------------------------------------------------------- ERI s7 */

describe('ERI section 7: accessibility', () => {
  it('P3-A1 every control is at least 44px tall', () => {
    const heights = [...css.matchAll(/min-height:\s*(\d+)px/g)].map((m) => Number(m[1]));
    assert.ok(heights.length >= 4, 'no control heights declared at all');
    for (const h of heights) assert.ok(h >= 44, 'a control is only ' + h + 'px tall');
  });

  it('P3-A1 no icon is ever read twice, and no icon stands alone', () => {
    for (const [name, html] of [...SCREENS_ALL, ['coach inbox', OPEN_INBOX]]) {
      const icons = count(html, '<svg');
      const hidden = count(html, 'aria-hidden="true"><svg');
      assert.equal(hidden, icons, name + ' renders ' + icons + ' icons but hides only ' + hidden +
        ' from a screen reader; an icon beside a text label must not be announced twice');
    }
    for (const need of SUPPORT_NEEDS) {
      assert.match(need.icon, /<title>.*<\/title>/, need.id + ' has an icon with no <title>');
      assert.match(need.icon, /<desc>.*<\/desc>/, need.id + ' has an icon with no <desc>');
    }
  });

  it('P3-A2 the options are short and plain', () => {
    for (const need of SUPPORT_NEEDS) assert.ok(words(need.label) <= 6, 'need label too long: ' + need.label);
    for (const list of Object.values(EMPLOYEE_MESSAGES)) {
      for (const m of list) assert.ok(words(m.text) <= 14, 'message too long: ' + m.text);
    }
    for (const r of COACH_REPLIES) assert.ok(words(r.text) <= 26, 'reply too long: ' + r.text);
  });

  it('P3-A3 screen reader and keyboard: landmarks, a language, a skip link, a live region', () => {
    for (const [name, html] of [['index.html', indexHtml], ['coach.html', coachHtml]]) {
      assert.match(html, /<html lang="en">/, name + ' declares no language');
      assert.match(html, /class="skip" href="#main"/, name + ' has no skip link');
      assert.match(html, /role="status" aria-live="polite"/, name + ' has no live region');
      assert.match(html, /<main id="main">/, name + ' has no main landmark');
      assert.ok(!/onclick=/i.test(html), name + ' uses an inline onclick');
    }
  });

  it('P3-A3 every control is a real control, labelled, with one focus target per screen', () => {
    for (const [name, html] of [...SCREENS_ALL, ['coach inbox', OPEN_INBOX]]) {
      assert.ok(!/<div[^>]*data-(action|open|reply)=/.test(html), name + ' uses a div as a button');
      assert.ok(!/tabindex="[1-9]/.test(html), name + ' sets a positive tabindex');
      assert.equal(count(html, 'type="button"'), count(html, '<button'), name + ' has a button with no type');
    }
    for (const [name, html] of SCREENS_ALL) {
      assert.equal(count(html, 'tabindex="-1"'), 1, name + ' has ' + count(html, 'tabindex="-1"') +
        ' focus targets; a screen change needs exactly one place to send focus');
    }
    assert.match(SCREEN.compose, /<label for="own-text">/);
    assert.match(OPEN_INBOX, /<label for="pick-/);
    assert.match(OPEN_INBOX, /<label for="text-/);
    // Focus follows the screen change, or a screen reader user is left behind.
    assert.match(employeeJs, /screenEl\.querySelector\('\[tabindex="-1"\]'\)/);
    assert.match(employeeJs, /h\.focus\(\)/);
  });

  it('P3-A4 typing is never the only way', () => {
    assert.ok(SUPPORT_NEEDS.every((n) => n.icon.includes('<svg')));
    assert.ok(Object.values(EMPLOYEE_MESSAGES).every((list) => list.length >= 3));
    const store = createStore({ storage: fakeStorage(), now: manualClock().now });
    const sent = store.submit({
      needId: 'task', employeeId: EMPLOYEE.id, coachId: COACH.id,
      messageId: 't1', text: messagesFor('task')[0].text
    });
    assert.equal(sent.messageSource, 'predefined');
  });

  it('P3-A5 sending says so, on the screen and out loud', () => {
    assert.match(EMPLOYEE_UI.sentConfirm, /Sent to Maria Delgado/);
    assert.ok(SCREEN.sent.includes(EMPLOYEE_UI.sentConfirm), 'the confirmation screen does not confirm');
    assert.match(SCREEN.sent, /class="confirm"/, 'the confirmation is not visually distinct');
    assert.match(css, /\.confirm \{[^}]*border: 3px solid var\(--ok\)/);
    assert.match(employeeJs, /liveEl\.textContent = EMPLOYEE_UI\.sentConfirm/, 'nothing is announced when a message is sent');
  });

  it('P3-A6 previous messages are one press away', () => {
    assert.match(SCREEN.home, /data-action="open-history"/);
    assert.ok(indexHtml.includes('data-action="open-history"'));
    assert.match(SCREEN.sent, /data-action="open-history"/, 'the confirmation screen is a dead end');
  });

  it('P3-A7 no deep menus and nothing hidden behind a widget', () => {
    for (const [name, html] of SCREENS_ALL) {
      assert.ok(!html.includes('<select'), name + ' uses a dropdown');
      assert.ok(!html.includes('<details'), name + ' hides content behind a disclosure widget');
    }
    // Depth itself is measured in test/flow.test.mjs.
  });

  it('P3-A7 nothing moves or expires: no animation, no transition, no timed UI', () => {
    assert.ok(!/@keyframes|animation:|transition:/.test(css), 'the stylesheet animates something');
  });
});

/* ----------------------------------------------------------------- ERI s8 */

describe('ERI section 8: success criteria', () => {
  // P3-S1 (three interactions) is measured in test/flow.test.mjs.

  it('P3-S2 the request is in the dashboard with its type visible before opening', () => {
    const view = S.store.coachInbox()[0];
    assert.equal(view.needId, 'task');
    const closed = coachInboxScreen([{ ...view, status: 'sent', seenAt: null, replies: [] }], null);
    assert.ok(closed.includes('Does not understand a task'), 'the closed card does not say what kind of help it is');
    assert.ok(closed.indexOf('Does not understand a task') < closed.indexOf(COACH_UI.openButton),
      'the coach has to open the request to find out what kind of help it is');
    assert.ok(closed.includes(EMPLOYEE.name), 'the closed card does not say who sent it');
  });

  it('P3-S3 a coach can acknowledge and respond', () => {
    const clock = manualClock();
    const store = createStore({ storage: fakeStorage(), now: clock.now });
    const sent = store.submit({ needId: 'task', employeeId: EMPLOYEE.id, coachId: COACH.id });
    clock.advance(1_000);
    assert.equal(store.open(sent.id, COACH_ACTOR).status, 'seen');
    clock.advance(1_000);
    assert.equal(store.reply(sent.id, { actor: COACH_ACTOR, body: COACH_REPLIES[0].text, replyId: 'r1' }).status, 'answered');
  });

  it('P3-S4 "was it received" has a plain answer, including when the answer is "we cannot tell you"', () => {
    assert.match(STATUS.sent.detail, /has not opened it yet/);
    assert.match(STATUS.sent.detail, /cannot tell you more/);
    assert.match(STATUS.seen.label, /opened/);
    assert.match(STATUS.answered.label, /answered/);
    const justSent = employeeScreen('sent', { ...STATE, request: { ...S.sent, replies: [] } });
    assert.ok(justSent.includes(STATUS.sent.detail), 'the screen does not say that nobody has opened it yet');
  });

  it('P3-S5 at least one alternative to typed communication exists', () => {
    const alternatives = [
      SUPPORT_NEEDS.every((n) => n.icon.includes('<svg')) && 'picture choices',
      Object.values(EMPLOYEE_MESSAGES).every((l) => l.length >= 3) && 'predefined messages'
    ].filter(Boolean);
    assert.ok(alternatives.length >= 1, 'typing is the only way to say anything');
  });
});

/* ----------------------------------------------------------------- ERI s9 */

describe('ERI section 9: out of scope, and provably absent', () => {
  it('P3-X1 P3-X3 nothing talks to a network: no fetch, no socket, no beacon', () => {
    const banned = /\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|RTCPeerConnection|getUserMedia)\s*\(/;
    for (const { path, text } of shippedSources()) {
      const hits = text.split('\n').filter((line) => banned.test(line) && !line.trim().startsWith('*'));
      assert.deepEqual(hits, [], path + ' makes a network call');
    }
    for (const html of [indexHtml, coachHtml]) {
      assert.ok(!/(src|href)="https?:/.test(html), 'a page loads something from the internet');
    }
  });

  it('P3-X2 emergencies are routed to procedures that already exist, not handled here', () => {
    assert.match(EMERGENCY.lead, /Do not use this app/);
    assert.ok(EMERGENCY.steps.some((s) => /911/.test(s.label)), 'the emergency screen never mentions 911');
    assert.ok(EMERGENCY.steps.some((s) => /person in charge/i.test(s.label)));
    assert.ok(EMERGENCY.steps.some((s) => /posted at your worksite/i.test(s.label)));
    assert.ok(SCREEN.emergency.includes('911'));
    assert.ok(SCREEN.emergency.includes(EMERGENCY.sendsNothing));
    assert.ok(!SCREEN.emergency.includes('data-action="send"'), 'the emergency screen can send a request');
    assert.ok(!SCREEN.emergency.includes('data-action="pick-need"'), 'the emergency screen leads into the request flow');
  });

  it('P3-X3 no video calling and no media capture', () => {
    for (const { path, text } of shippedSources()) {
      assert.ok(!/<video|<audio|mediaDevices/.test(text), path + ' ships a media feature');
    }
    for (const [name, html] of SCREENS_ALL) {
      assert.ok(!/<video|<audio/.test(html), name + ' renders a media element');
    }
  });

  it('P3-X4 no monitoring: the dashboard can only show what was sent', () => {
    const banned = /(activity|location|geo|idle|keystroke|screenTime|productiv|minutesWorked|attendance|onTime)/i;
    for (const key of COACH_VIEW_KEYS) assert.ok(!banned.test(key), 'coachView exposes ' + key);
    assert.match(COACH_UI.notMonitoring, /does not show what anyone is doing at work/);
    assert.match(coachJs, /store\.coachInbox\(\)/, 'the dashboard does not render from the projection');
    assert.ok(!/store\.all\(\)/.test(coachJs), 'the dashboard reads the raw request objects');
    assert.ok(coachHtml.includes('id="not-monitoring"'), 'the dashboard never says it is not a monitoring tool');
  });

  it('P3-X5 the prototype says out loud that it is not production case management', () => {
    assert.match(DISCLOSURE.production, /secure sign-in/);
    assert.match(DISCLOSURE.production, /record retention/);
    assert.ok(SCREEN.home.includes(DISCLOSURE.production), 'the home screen does not say what a real version needs');
    assert.ok(indexHtml.includes(APP.demoBanner), 'the employee page does not say it is a demonstration');
    assert.ok(/simulated/.test(coachHtml), 'the dashboard does not say the inbox is simulated');
  });

  it('P3-X6 one coach, no agency directory', () => {
    assert.equal(COACH.name, 'Maria Delgado');
    assert.ok(!/agency|agencies|referral/i.test(employeeJs + coachJs), 'multi-agency coordination has crept in');
    for (const [name, html] of SCREENS_ALL) {
      assert.ok(!/agency|agencies/i.test(html), name + ' mentions another agency');
    }
  });
});

/* ---------------------------------------------------------------- ERI s10 */

describe('ERI section 10: who receives this, and what the product must not imply', () => {
  it('P3-P1 the coach is named, on every screen, by construction', () => {
    assert.equal(COACH.simulated, true);
    assert.ok(indexHtml.includes(DISCLOSURE.recipientBanner), 'the recipient banner does not match the fixture');
    assert.match(indexHtml, /id="recipient"/);
    assert.match(employeeJs, /getElementById\('recipient'\)\.textContent = DISCLOSURE\.recipientBanner/);
    // Outside the element that re-renders, so changing screens cannot drop it.
    assert.ok(indexHtml.indexOf('id="recipient"') < indexHtml.indexOf('<div id="screen">'));
    assert.ok(coachHtml.includes(COACH.name), 'the dashboard does not say whose inbox it is');
    // "your coach" identifies nobody when the inbox is simulated.
    for (const [name, html] of SCREENS_ALL) {
      assert.ok(!/your coach\b/i.test(html), name + ' says "your coach" instead of naming her');
    }
    assert.ok(!/your coach\b/i.test(indexHtml));
    // And the screens where somebody is deciding whether to send do name her.
    for (const name of ['home', 'compose', 'sent']) {
      assert.ok(SCREEN[name].includes(COACH.name), name + ' does not name the recipient');
    }
  });

  it('P3-P2 what is shared, and what is not, is on the screen', () => {
    assert.match(DISCLOSURE.shared, /Your name/);
    assert.match(DISCLOSURE.notShared, /cannot see what you are doing at work/);
    assert.ok(SCREEN.home.includes(DISCLOSURE.shared));
    assert.ok(SCREEN.home.includes(DISCLOSURE.notShared));
  });

  it('P3-P3 nothing here reports presence or promises a reply', () => {
    const FORBIDDEN = [
      [/\bis (currently |now )?(online|offline|away|active|busy|free)\b/i, 'reports presence'],
      [/\b(online|offline) now\b/i, 'reports presence'],
      [/(?<!not )\balways available\b/i, 'claims the coach is always available'],
      [/\bavailable (now|today|24\/7|anytime|any time)\b/i, 'claims availability'],
      [/\b(repl(y|ies)|respond(s)?|answer(s)?) (in|within)\b/i, 'promises a reply time'],
      [/\bwithin \d+\s*(sec|second|min|minute|hour|hr)/i, 'promises a reply time'],
      [/\b(usually|typically|normally|average)\b.{0,24}\b(repl|respond|answer)/i, 'predicts a reply'],
      [/\bresponse time\b/i, 'promises a reply time'],
      [/\bright away\b/i, 'implies immediacy'],
      [/\bimmediately\b/i, 'implies immediacy'],
      [/\basap\b/i, 'implies immediacy'],
      [/\bwill (repl|respond|answer|get back|be with)/i, 'promises a reply'],
      [/\bon[- ]?call\b/i, 'implies a duty roster'],
      [/\blast (seen|active)\b/i, 'reports presence'],
      [/\bis typing\b/i, 'reports presence'],
      [/\bguarantee/i, 'promises'],
      [/\bstanding by\b|\bstandby\b/i, 'implies presence']
    ];
    const targets = [
      ...shippedSources().map(({ path, text }) => [path, text]),
      ...SCREENS_ALL.map(([name, html]) => ['rendered screen: ' + name, html]),
      ['rendered coach inbox', OPEN_INBOX]
    ];
    for (const [where, text] of targets) {
      for (const [pattern, why] of FORBIDDEN) {
        const match = text.match(pattern);
        assert.equal(match, null, where + ' ' + why + ': "' + (match && match[0]) +
          '". ERI section 10 forbids implying a job coach is always there the moment you need one.');
      }
    }
  });

  it('P3-P3 and it says the honest thing instead', () => {
    assert.match(DISCLOSURE.availability, /not always at a computer/);
    assert.match(DISCLOSURE.availability, /does not promise a reply/);
    assert.match(DISCLOSURE.availability, /tell the person in charge at your worksite as well/);
    assert.ok(SCREEN.home.includes(DISCLOSURE.availability), 'the home screen does not say when she might read it');
    assert.ok(SCREEN.sent.includes(DISCLOSURE.availability),
      'the confirmation screen does not say when she might read it, and that is where somebody is waiting');
  });

  it('P3-P4 routine and emergency are different paths, and not only by colour', () => {
    assert.match(indexHtml, /class="emergency-rail"/, 'there is no emergency path on the home screen');
    assert.match(indexHtml, /data-action="open-emergency"/);
    assert.ok(indexHtml.includes(EMERGENCY.triggerLabel));
    // Different shape and border, so the difference survives greyscale and
    // Windows High Contrast.
    assert.match(css, /\.emergency-rail \{[^}]*border-top: 4px double var\(--danger\)/);
    assert.match(css, /\.emergency-rail button \{[^}]*border-radius: 0/);
    assert.match(css, /\.emergency-screen \{[^}]*border: 4px solid var\(--danger\)/);
    assert.match(css, /^button \{[^}]*border-radius: 10px/m, 'the routine button is not a different shape');
    // The emergency words appear on the emergency screen and nowhere else.
    assert.ok(SCREEN.emergency.includes(EMERGENCY.heading));
    for (const [name, html] of SCREENS_ALL) {
      if (name === 'emergency') continue;
      assert.ok(!html.includes('911'), name + ' mixes emergency copy into the request flow');
      assert.ok(!html.includes(EMERGENCY.heading), name + ' mixes emergency copy into the request flow');
    }
  });

  it('P3-P5 there is no field, column or fixture key for a disability or a diagnosis', () => {
    const fieldish = /(?:id|name|for|data-field|placeholder)="[^"]*(disab|diagnos|impair|condition|medicat)/i;
    for (const { path, text } of shippedSources()) {
      assert.equal(text.match(fieldish), null, path + ' has an input for a disability or diagnosis');
    }
    for (const [name, html] of [...SCREENS_ALL, ['coach inbox', OPEN_INBOX]]) {
      assert.equal(html.match(fieldish), null, name + ' renders an input for a disability or diagnosis');
    }
    const keys = new Set();
    (function walk(value) {
      if (!value || typeof value !== 'object') return;
      for (const [k, v] of Object.entries(value)) { keys.add(k); walk(v); }
    })({ COACH, EMPLOYEE, SUPPORT_NEEDS, EMPLOYEE_MESSAGES, COACH_REPLIES, EMERGENCY, DISCLOSURE, STATUS });
    for (const key of keys) {
      assert.ok(!/disab|diagnos|impair|medicat|iep|caseNumber/i.test(key), 'a fixture has a "' + key + '" field');
    }
    assert.match(COACH_UI.noDiagnosis, /no place here to record a disability or a diagnosis/);
    assert.ok(OPEN_INBOX.includes(COACH_UI.noDiagnosis), 'the dashboard never says it on screen');
  });
});

/* ------------------------------------------------- the browser can load it */

describe('nothing in node imports the two screens, so check their paths by hand', () => {
  it('every import in every shipped module resolves to a file that exists', () => {
    for (const { path, text } of shippedSources()) {
      if (!path.endsWith('.js')) continue;
      const specs = [...text.matchAll(/(?:^|\n)\s*import[^'"]*['"]([^'"]+)['"]/g)].map((m) => m[1]);
      for (const spec of specs) {
        assert.ok(resolvesFrom(path, spec), path + ' imports "' + spec + '", which does not exist');
        assert.ok(!spec.startsWith('/') && !spec.startsWith('http'),
          path + ' imports "' + spec + '" by absolute path, which breaks on any host with a prefix');
      }
    }
  });

  it('every script and stylesheet the two pages name exists', () => {
    for (const [page, html] of [['web/index.html', indexHtml], ['web/coach.html', coachHtml]]) {
      const refs = [
        ...[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]),
        ...[...html.matchAll(/<link[^>]+href="([^"]+)"/g)].map((m) => m[1])
      ];
      assert.ok(refs.length >= 2, page + ' loads neither a script nor a stylesheet');
      for (const ref of refs) {
        assert.ok(resolvesFrom(page, './' + ref), page + ' loads "' + ref + '", which does not exist');
      }
    }
  });

  it('the pages link to each other, because the demo needs both tabs', () => {
    assert.match(indexHtml, /href="coach\.html"/);
    assert.match(coachHtml, /href="index\.html"/);
  });
});
