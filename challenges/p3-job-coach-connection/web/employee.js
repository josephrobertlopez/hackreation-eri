/*
 * The employee screen: mount, events, focus. Nothing else.
 *
 * All the markup lives in src/views.js as pure functions, so what an employee
 * sees is asserted directly in test/views.test.mjs instead of being inferred
 * from this file. Every button carries a data-action that exists in
 * src/flow.js, every navigation goes through flow.act(), and the interaction
 * count the three-tap promise rests on is therefore a count of real presses -
 * see test/flow.test.mjs.
 *
 * Status never moves here. This screen only reads it. See src/requests.js.
 */

import { createFlow, SCREENS } from '../src/flow.js';
import { createStore } from '../src/store.js';
import { createChannel } from '../src/channel.js';
import { employeeScreen } from '../src/views.js';
import { COACH, EMPLOYEE } from '../fixtures/people.js';
import { messagesFor } from '../fixtures/employee-messages.js';
import { APP, DISCLOSURE, STATUS, EMPLOYEE_UI } from '../fixtures/copy.js';

const flow = createFlow();
const channel = createChannel();
const store = createStore({ storage: window.localStorage, channel });

let draft = { needId: null, messageId: null, text: '' };
let watching = null;          // the request shown on the confirmation screen
const announced = new Map();  // request id -> the last status we said out loud

const screenEl = document.getElementById('screen');
const liveEl = document.getElementById('live');

/* Named recipient, on every screen, from the fixture - so the static copy in
   index.html can never quietly disagree with it. */
document.getElementById('recipient').textContent = DISCLOSURE.recipientBanner;

const mine = () => store.all().filter((r) => r.employeeId === EMPLOYEE.id);

/* focus: 'heading' when the screen changed, {keep, messageId} when it did not,
   anything falsy when the re-render came from the coach's side and must not
   steal the employee's place. */
function render(focus) {
  screenEl.innerHTML = employeeScreen(flow.screen, {
    draft,
    request: watching ? store.get(watching) : null,
    requests: mine()
  });
  document.title = SCREENS[flow.screen].heading + ' - ' + APP.name;
  if (focus === 'heading') {
    const h = screenEl.querySelector('[tabindex="-1"]');
    if (h) h.focus();
  } else if (focus && focus.keep) {
    const same = focus.messageId
      ? screenEl.querySelector('[data-message="' + focus.messageId + '"]')
      : screenEl.querySelector('[data-action="' + focus.keep + '"]');
    const landing = same || screenEl.querySelector('[data-action="send"]');
    if (landing) landing.focus();
  }
}

/* Announce only what actually changed, and only because the coach did
   something. No polling and no timers: this fires on a store event. */
function announceChanges() {
  for (const request of mine()) {
    const before = announced.get(request.id);
    announced.set(request.id, request.status);
    if (before === undefined || before === request.status) continue;
    liveEl.textContent = STATUS[request.status].label + '. ' + STATUS[request.status].detail;
  }
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.getAttribute('data-action');
  if (!flow.can(action)) return;

  if (action === 'pick-need') {
    draft = { needId: button.getAttribute('data-need'), messageId: null, text: '' };
  }
  if (action === 'pick-message') {
    const id = button.getAttribute('data-message');
    const picked = messagesFor(draft.needId).find((m) => m.id === id);
    const unpicking = draft.messageId === id;
    draft = { ...draft, messageId: unpicking ? null : id, text: unpicking ? '' : picked.text };
  }
  if (action === 'clear-message') draft = { ...draft, messageId: null, text: '' };
  if (action === 'send') {
    const typed = document.getElementById('own-text');
    const text = draft.messageId ? draft.text : (typed ? typed.value : '');
    const request = store.submit({
      needId: draft.needId,
      employeeId: EMPLOYEE.id,
      employeeName: EMPLOYEE.name,
      coachId: COACH.id,
      messageId: draft.messageId,
      text
    });
    watching = request.id;
    announced.set(request.id, request.status);
    liveEl.textContent = EMPLOYEE_UI.sentConfirm + ' ' + STATUS.sent.detail;
    draft = { needId: null, messageId: null, text: '' };
  }
  if (action === 'home') { flow.restart(); render('heading'); return; }

  const before = flow.screen;
  flow.act(action);
  /* Picking or removing a message stays on the same screen, so keep the
     employee where they were. Moving focus to a new heading is right when the
     screen changed and wrong when it did not. */
  render(flow.screen === before
    ? { keep: action, messageId: button.getAttribute('data-message') }
    : 'heading');
});

/* Keep what the employee typed when the compose screen re-renders. */
document.addEventListener('input', (event) => {
  if (event.target && event.target.id === 'own-text') {
    draft = { ...draft, messageId: null, text: event.target.value };
  }
});

store.subscribe(() => {
  announceChanges();
  if (flow.screen === 'sent' || flow.screen === 'history') render(false);
});
store.listen();

render(false);
announceChanges();
