/*
 * ERI's suggested demonstration, executed.
 *
 *   "An employee is assigned a new task but doesn't understand the
 *    instructions. They select 'I Need Help,' followed by 'I don't understand
 *    my task.' The job coach receives the request and responds with
 *    instructions or an offer to connect directly. The employee sees the
 *    response and continues working."
 *
 * Everything else in test/ exercises src/. This file runs web/employee.js and
 * web/coach.js themselves - the real click handlers, the real live-region
 * code, the real cross-tab channel - against a stub DOM small enough to read.
 * Without it the two page scripts would be the only layer in this folder that
 * nothing executes, which is exactly where a prototype rots.
 *
 * The stub is deliberately thin: it does not parse HTML. It hands the real
 * handler a button that answers closest() and getAttribute(), which is all the
 * handler asks of the DOM.
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';

import { fakeStorage } from './helpers.mjs';
import { COACH_REPLIES } from '../fixtures/coach-replies.js';
import { STATUS, EMPLOYEE_UI } from '../fixtures/copy.js';
import { createStore } from '../src/store.js';

/* --------------------------------------------------------------- the stub */

const channels = new Map();

/** BroadcastChannel, synchronous, with nothing holding the event loop open. */
class FakeBroadcastChannel {
  constructor(name) {
    this.name = name;
    this.onmessage = null;
    if (!channels.has(name)) channels.set(name, new Set());
    channels.get(name).add(this);
  }
  postMessage(data) {
    for (const peer of channels.get(this.name)) {
      if (peer !== this && typeof peer.onmessage === 'function') peer.onmessage({ data });
    }
  }
  close() { channels.get(this.name).delete(this); }
}

function stubElement(attrs = {}) {
  const handlers = {};
  return {
    attrs,
    innerHTML: '',
    textContent: '',
    value: '',
    focused: false,
    addEventListener(type, fn) { (handlers[type] = handlers[type] || []).push(fn); },
    dispatch(type, event) { for (const fn of handlers[type] || []) fn(event); },
    focus() { this.focused = true; },
    querySelector() { return null; },
    getAttribute(name) { return name in this.attrs ? this.attrs[name] : null; },
    /* The handlers only ever ask "am I, or is an ancestor, a [data-x]?" */
    closest(selector) {
      const attr = selector.replace(/[[\]]/g, '');
      return attr in this.attrs ? this : null;
    }
  };
}

const elements = new Map();
function el(id, attrs) {
  if (!elements.has(id)) elements.set(id, stubElement(attrs));
  return elements.get(id);
}

const storage = fakeStorage();
const documentListeners = {};

const originalBroadcast = globalThis.BroadcastChannel;
const originalWindow = globalThis.window;
const originalDocument = globalThis.document;

let employeeLive;
let coachLive;
let screenEl;
let inboxEl;

before(() => {
  globalThis.BroadcastChannel = FakeBroadcastChannel;
  globalThis.window = { localStorage: storage };
  globalThis.document = {
    title: '',
    getElementById: (id) => el(id),
    addEventListener(type, fn) { (documentListeners[type] = documentListeners[type] || []).push(fn); }
  };
});

after(() => {
  globalThis.BroadcastChannel = originalBroadcast;
  globalThis.window = originalWindow;
  globalThis.document = originalDocument;
  for (const set of channels.values()) for (const c of [...set]) c.close();
});

/** Press a button with these attributes, the way a real click arrives. */
function press(attrs) {
  const button = stubElement(attrs);
  for (const fn of documentListeners.click || []) fn({ target: button });
}

/** Press a button inside the coach dashboard. */
function pressInInbox(attrs) {
  inboxEl.dispatch('click', { target: stubElement(attrs) });
}

/* --------------------------------------------------------------- the demo */

describe('ERI’s suggested demonstration, run against the real page scripts', () => {
  it('P3-M1 … P3-M6 the whole round trip, in three interactions', async () => {
    screenEl = el('screen');
    employeeLive = el('live');

    // Tab 1: the employee screen mounts.
    await import('../web/employee.js');
    assert.match(screenEl.innerHTML, /I Need Help/, 'the employee screen did not mount');
    assert.match(el('recipient').textContent, /Maria Delgado/, 'the recipient was not named on mount');

    // Interaction 1: "I Need Help".
    press({ 'data-action': 'need-help' });
    assert.match(screenEl.innerHTML, /What do you need help with\?/);

    // Interaction 2: "I do not understand my task".
    press({ 'data-action': 'pick-need', 'data-need': 'task' });
    assert.match(screenEl.innerHTML, /Send this to Maria Delgado\?/);

    // Interaction 3: send. No message typed and none picked - the shortest
    // honest path ERI's success criterion asks for.
    press({ 'data-action': 'send' });
    assert.match(screenEl.innerHTML, /Your message is sent/);
    assert.ok(employeeLive.textContent.includes(EMPLOYEE_UI.sentConfirm),
      'nothing was announced when the message was sent');
    assert.ok(employeeLive.textContent.includes(STATUS.sent.detail),
      'the announcement did not say that nobody has opened it yet');

    // It is in storage, in status sent, and nobody has seen it.
    const inspector = createStore({ storage });
    const request = inspector.all()[0];
    assert.equal(inspector.all().length, 1);
    assert.equal(request.status, 'sent');
    assert.equal(request.seenAt, null);
    assert.equal(request.needId, 'task');

    // Tab 2: the coach dashboard mounts, as a separate document.
    coachLive = stubElement();
    elements.set('live', coachLive);
    inboxEl = el('inbox');
    await import('../web/coach.js');
    assert.match(inboxEl.innerHTML, /Does not understand a task/,
      'the request is not in the dashboard, or not labelled before opening');
    assert.match(inboxEl.innerHTML, /Sam Rivera/);
    assert.match(el('not-monitoring').textContent, /does not show what anyone is doing at work/);

    // Mounting the dashboard must NOT have moved the status.
    assert.equal(createStore({ storage }).all()[0].status, 'sent',
      'opening the dashboard marked the request seen without the coach doing anything');

    // The coach presses Open. Only now does "seen" become true.
    pressInInbox({ 'data-open': request.id });
    assert.equal(createStore({ storage }).all()[0].status, 'seen');
    assert.match(coachLive.textContent, /Request opened/);
    // And the employee's screen heard about it, through the channel.
    assert.ok(employeeLive.textContent.includes(STATUS.seen.label),
      'the employee was not told that the coach opened it');

    // The coach picks a predefined reply and sends it.
    el('pick-' + request.id).value = COACH_REPLIES[0].id;
    pressInInbox({ 'data-reply': request.id });
    const answered = createStore({ storage }).all()[0];
    assert.equal(answered.status, 'answered');
    assert.equal(answered.replies[0].body, COACH_REPLIES[0].text);
    assert.equal(answered.replies[0].source, 'predefined');

    // The employee sees the answer on their own screen, and hears it.
    assert.ok(screenEl.innerHTML.includes(COACH_REPLIES[0].text),
      'the coach’s words never reached the employee’s screen');
    assert.ok(employeeLive.textContent.includes(STATUS.answered.label),
      'the employee was not told that an answer arrived');
  });

  it('P3-P4 the emergency path is reachable from the screen and sends nothing', () => {
    const before = createStore({ storage }).all().length;
    press({ 'data-action': 'open-emergency' });
    assert.match(screenEl.innerHTML, /Is someone hurt or in danger\?/);
    assert.match(screenEl.innerHTML, /911/);
    assert.match(screenEl.innerHTML, /does not send anything/);
    assert.equal(createStore({ storage }).all().length, before, 'the emergency screen sent something');
    press({ 'data-action': 'home' });
    assert.match(screenEl.innerHTML, /I Need Help/, 'the emergency screen is a dead end');
  });

  it('P3-F7 the history lists what was sent, with its status', () => {
    press({ 'data-action': 'open-history' });
    assert.match(screenEl.innerHTML, /My messages/);
    assert.match(screenEl.innerHTML, /I do not understand my task/);
    assert.ok(screenEl.innerHTML.includes(STATUS.answered.label));
  });
});
