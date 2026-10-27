/*
 * The request/status state machine, and the falsifier for the one lie this
 * product could most easily tell.
 *
 * ERI section 4 asks for a status of "sent, seen, or answered". The cheap build
 * is a two-second timer that flips to "seen", because it demos perfectly and
 * nobody in the room can tell. It teaches a disabled employee that their job
 * coach saw a message nobody saw.
 *
 * So the rule is: no status transition without a corresponding real action on
 * the coach side. The tests tagged FALSIFIER below are the ones that fail if
 * anyone implements the timer - including the subtler versions of it (marking
 * everything seen when the dashboard renders, a status set straight onto the
 * object in the view layer, a "simulate coach" helper).
 */

import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';

import {
  createRequest, applyEvent, coachView, COACH_VIEW_KEYS,
  InvalidTransition, NotCoachAction, STATUSES
} from '../src/requests.js';
import { createStore } from '../src/store.js';
import { read, shippedSources, fakeStorage, fakeBus, manualClock, COACH_ACTOR } from './helpers.mjs';

const BASE = { id: 'req-1', needId: 'task', employeeId: 'employee-sam-rivera', employeeName: 'Sam Rivera', coachId: COACH_ACTOR.id };

const newRequest = (over = {}) => createRequest({ ...BASE, at: 1_000, ...over });

describe('the request itself', () => {
  it('P3-F5 starts in "sent" and in no other status', () => {
    const r = newRequest();
    assert.equal(r.status, 'sent');
    assert.deepEqual(STATUSES, ['sent', 'seen', 'answered']);
    assert.equal(r.seenAt, null);
    assert.equal(r.seenBy, null);
    assert.deepEqual([...r.replies], []);
  });

  it('P3-M3 sends with no message at all, and records which kind of message it was', () => {
    assert.equal(newRequest().messageSource, 'none');
    assert.equal(newRequest({ text: 'I am not sure what to do first.' }).messageSource, 'typed');
    assert.equal(newRequest({ messageId: 't1' }).messageSource, 'predefined');
  });

  it('refuses to exist without a named recipient and a support need', () => {
    assert.throws(() => createRequest({ ...BASE, coachId: '', at: 1 }), InvalidTransition);
    assert.throws(() => createRequest({ ...BASE, needId: '', at: 1 }), InvalidTransition);
  });

  it('never reads the clock itself - the caller supplies the time it observed', () => {
    assert.throws(() => createRequest({ ...BASE }), InvalidTransition);
    const code = read('src/requests.js').replace(/\/\*[\s\S]*?\*\//g, '');
    assert.ok(!code.includes('Date.now'), 'src/requests.js reads the clock; the state machine must stay pure');
    assert.ok(!code.includes('new Date'), 'src/requests.js reads the clock; the state machine must stay pure');
  });
});

describe('status moves only on a real coach action', () => {
  it('P3-F5 "seen" needs a coach who opened it', () => {
    const r = applyEvent(newRequest(), { type: 'coach-opened', actor: COACH_ACTOR, at: 2_000 });
    assert.equal(r.status, 'seen');
    assert.equal(r.seenAt, 2_000);
    assert.equal(r.seenBy, COACH_ACTOR.id);
  });

  it('P3-F6 "answered" needs words from a coach', () => {
    const r = applyEvent(newRequest(), {
      type: 'coach-replied', actor: COACH_ACTOR, at: 3_000, body: 'Start with step 1.', replyId: 'r1'
    });
    assert.equal(r.status, 'answered');
    assert.equal(r.replies.length, 1);
    assert.equal(r.replies[0].body, 'Start with step 1.');
    assert.equal(r.replies[0].source, 'predefined');
  });

  it('backfills "seen" from the reply itself rather than inventing a time', () => {
    const r = applyEvent(newRequest(), { type: 'coach-replied', actor: COACH_ACTOR, at: 3_000, body: 'ok' });
    assert.equal(r.seenAt, 3_000, 'replying proves it was read; the time is the reply time, not a guess');
  });

  it('re-opening does not rewrite when it was first opened', () => {
    const seen = applyEvent(newRequest(), { type: 'coach-opened', actor: COACH_ACTOR, at: 2_000 });
    const again = applyEvent(seen, { type: 'coach-opened', actor: COACH_ACTOR, at: 9_000 });
    assert.equal(again.seenAt, 2_000);
  });

  it('refuses an empty reply', () => {
    assert.throws(() => applyEvent(newRequest(), {
      type: 'coach-replied', actor: COACH_ACTOR, at: 3_000, body: '   '
    }), InvalidTransition);
  });

  it('never mutates the request it was given', () => {
    const before = newRequest();
    applyEvent(before, { type: 'coach-opened', actor: COACH_ACTOR, at: 2_000 });
    assert.equal(before.status, 'sent');
  });
});

describe('FALSIFIER: a status cannot advance without a coach action', () => {
  // Every shape of "nudge" a faked status would arrive as. None may advance it.
  const IMPOSTORS = [
    { label: 'no actor at all', event: { type: 'coach-opened', at: 2_000 } },
    { label: 'the employee marking their own message seen', event: { type: 'coach-opened', actor: { id: 'employee-sam-rivera', role: 'employee' }, at: 2_000 } },
    { label: 'a "system" actor', event: { type: 'coach-opened', actor: { id: 'system', role: 'system' }, at: 2_000 } },
    { label: 'a timer', event: { type: 'coach-opened', actor: { id: 'timer', role: 'timer' }, at: 2_000 } },
    { label: 'a coach role with no id', event: { type: 'coach-opened', actor: { role: 'coach' }, at: 2_000 } },
    { label: 'a reply with no actor', event: { type: 'coach-replied', at: 2_000, body: 'hello' } },
    { label: 'a reply from the employee', event: { type: 'coach-replied', actor: { id: 'e', role: 'employee' }, at: 2_000, body: 'hello' } }
  ];

  for (const { label, event } of IMPOSTORS) {
    it('refuses: ' + label, () => {
      assert.throws(() => applyEvent(newRequest(), event), NotCoachAction);
    });
  }

  const BOGUS_EVENTS = [
    { type: 'tick' }, { type: 'timeout' }, { type: 'seen' }, { type: 'mark-seen' },
    { type: 'status' }, { type: 'advance' }, { type: 'delivered' }, { type: 'read-receipt' },
    { type: 'render' }, { type: 'poll' }, {}, null, undefined, 'seen'
  ];

  for (const event of BOGUS_EVENTS) {
    it('refuses the invented event ' + JSON.stringify(event), () => {
      assert.throws(() => applyEvent(newRequest(), event), InvalidTransition);
    });
  }

  it('exposes no way to set a status directly', async () => {
    const requests = await import('../src/requests.js');
    const store = createStore({ now: () => 1 });
    const forbidden = /^(set|mark|force|advance|fake|simulate|promote)/i;
    for (const name of Object.keys(requests)) {
      assert.ok(!forbidden.test(name), 'src/requests.js exports "' + name + '", which reads like a status setter');
    }
    for (const name of Object.keys(store)) {
      assert.ok(!/^(setStatus|markSeen|forceStatus|fake|simulate)/i.test(name),
        'the store exposes "' + name + '", which reads like a status setter');
    }
  });

  it('the whole clock can run out and nothing moves', (t) => {
    // The decisive one. Real store, real default clock, mocked time. If anybody
    // adds setTimeout(() => markSeen(), 2000) this test goes red.
    t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'setImmediate', 'Date'] });
    try {
      const store = createStore({ storage: fakeStorage() });
      const request = store.submit(BASE);
      let notifications = 0;
      store.subscribe(() => { notifications += 1; });

      t.mock.timers.tick(2_000);
      t.mock.timers.tick(60_000);
      t.mock.timers.tick(24 * 60 * 60 * 1000);
      t.mock.timers.runAll();

      const after = store.get(request.id);
      assert.equal(after.status, 'sent', 'time passed and the status moved: that is the fake-seen bug');
      assert.equal(after.seenAt, null);
      assert.equal(notifications, 0, 'something re-rendered on a timer');
    } finally {
      t.mock.timers.reset();
    }
  });

  it('no shipped file sets a timer of any kind', () => {
    const timers = /\b(setTimeout|setInterval|setImmediate|requestAnimationFrame|requestIdleCallback)\s*\(/;
    for (const { path, text } of shippedSources()) {
      const offending = text.split('\n')
        .map((line, i) => [i + 1, line])
        .filter(([, line]) => timers.test(line) && !line.trim().startsWith('*') && !line.trim().startsWith('//'));
      assert.deepEqual(offending, [], path + ' sets a timer. Nothing in this product is allowed to happen because time passed.');
    }
  });

  it('only the state machine ever writes the words "seen" or "answered" into a status', () => {
    const assigns = /status\s*[:=]\s*['"](seen|answered)['"]/;
    for (const { path, text } of shippedSources()) {
      if (path === 'src/requests.js') continue; // the one place allowed to
      assert.ok(!assigns.test(text),
        path + ' assigns a status directly. Status changes belong to applyEvent() in src/requests.js.');
    }
  });

  it('the dashboard does not mark anything seen just by rendering', () => {
    const coach = read('web/coach.js');
    const renderBody = coach.slice(coach.indexOf('function render()'), coach.indexOf('inboxEl.addEventListener'));
    assert.ok(!/store\.open\(/.test(renderBody),
      'render() calls store.open(): opening the dashboard would mark every request seen');
    assert.ok(/data-open/.test(coach) && /store\.open\(/.test(coach),
      'the coach still needs an explicit button that opens a request');
  });
});

describe('the coach sees requests, not people', () => {
  it('P3-X4 the dashboard projection has exactly the fields ERI asked for', () => {
    const r = applyEvent(newRequest({ text: 'I am confused.' }), {
      type: 'coach-opened', actor: COACH_ACTOR, at: 2_000
    });
    assert.deepEqual(Object.keys(coachView(r)).sort(), [...COACH_VIEW_KEYS].sort());
  });

  it('P3-X4 no monitoring field can slip into the projection', () => {
    const banned = /(activity|location|geo|idle|keystroke|screen|productiv|minutesWorked|onTime|attendance|disab|diagnos|impair)/i;
    for (const key of COACH_VIEW_KEYS) {
      assert.ok(!banned.test(key), 'coachView() exposes "' + key + '"');
    }
  });
});

describe('two tabs, one handoff', () => {
  it('P3-M4 P3-M5 P3-M6 the coach tab answers and the employee tab sees it', () => {
    const storage = fakeStorage();
    const bus = fakeBus();
    const clock = manualClock();

    const employeeTab = createStore({ storage, channel: bus.endpoint(), now: clock.now });
    const coachTab = createStore({ storage, channel: bus.endpoint(), now: clock.now });
    employeeTab.listen();
    coachTab.listen();

    // 1. the employee sends
    clock.advance(1_000);
    const sent = employeeTab.submit(BASE);
    assert.equal(sent.status, 'sent');

    // 2. it is in the coach's inbox, with the kind of help visible
    const inbox = coachTab.coachInbox();
    assert.equal(inbox.length, 1);
    assert.equal(inbox[0].needId, 'task');

    // 3. the employee's screen still says sent, because nobody opened it
    assert.equal(employeeTab.get(sent.id).status, 'sent');

    // 4. the coach opens it, and only now does the employee see "seen"
    clock.advance(5_000);
    coachTab.open(sent.id, COACH_ACTOR);
    assert.equal(employeeTab.get(sent.id).status, 'seen');

    // 5. the coach replies, and the answer lands on the employee's screen
    clock.advance(5_000);
    coachTab.reply(sent.id, { actor: COACH_ACTOR, body: 'Start with step 1.', replyId: 'r1' });
    const onEmployeeScreen = employeeTab.get(sent.id);
    assert.equal(onEmployeeScreen.status, 'answered');
    assert.equal(onEmployeeScreen.replies[0].body, 'Start with step 1.');
  });

  it('P3-F7 the employee can review the session’s messages, newest first', () => {
    const clock = manualClock();
    const store = createStore({ storage: fakeStorage(), now: clock.now });
    clock.advance(1_000); store.submit({ ...BASE, id: undefined, needId: 'question' });
    clock.advance(1_000); store.submit({ ...BASE, id: undefined, needId: 'schedule' });
    const all = store.all();
    assert.equal(all.length, 2);
    assert.equal(all[0].needId, 'schedule');
  });
});
