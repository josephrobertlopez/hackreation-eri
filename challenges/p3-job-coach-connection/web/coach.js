/*
 * The coach dashboard: mount, events. A separate document in a separate tab.
 *
 * It renders from store.coachInbox() - the coachView() projection in
 * src/requests.js, whose field list is asserted exactly - so there is nowhere
 * here to show what an employee is doing at work. ERI section 9 rules out
 * automated monitoring; that projection is how the code keeps the promise
 * instead of the README making it.
 *
 * "Seen" happens because the coach pressed Open. render() does not touch
 * status: if it did, every request would read as seen the moment this tab was
 * open, which is the same lie by a different route.
 */

import { createStore } from '../src/store.js';
import { createChannel } from '../src/channel.js';
import { coachInboxScreen } from '../src/views.js';
import { COACH, EMPLOYEE } from '../fixtures/people.js';
import { replyById } from '../fixtures/coach-replies.js';
import { COACH_UI } from '../fixtures/copy.js';

const ACTOR = { id: COACH.id, role: 'coach', name: COACH.name };

const channel = createChannel();
const store = createStore({ storage: window.localStorage, channel });

const inboxEl = document.getElementById('inbox');
const liveEl = document.getElementById('live');
document.getElementById('not-monitoring').textContent = COACH_UI.notMonitoring;

let openId = null;

function render() {
  inboxEl.innerHTML = coachInboxScreen(store.coachInbox(), openId);
}

inboxEl.addEventListener('click', (event) => {
  const openBtn = event.target.closest('[data-open]');
  if (openBtn) {
    const id = openBtn.getAttribute('data-open');
    openId = id;
    store.open(id, ACTOR);                       // the real action behind "seen"
    render();
    const area = document.getElementById('text-' + id);
    if (area) area.focus();
    liveEl.textContent = 'Request opened. ' + EMPLOYEE.name + ' can see that you opened it.';
    return;
  }

  const replyBtn = event.target.closest('[data-reply]');
  if (replyBtn) {
    const id = replyBtn.getAttribute('data-reply');
    const picked = document.getElementById('pick-' + id);
    const typed = document.getElementById('text-' + id);
    const written = typed && typed.value.trim() ? typed.value.trim() : '';
    const chosen = picked && picked.value ? replyById(picked.value) : null;
    const body = written || (chosen ? chosen.text : '');
    if (!body) {
      liveEl.textContent = 'Pick a reply or write one first. An empty reply is not sent.';
      return;
    }
    store.reply(id, { actor: ACTOR, body, replyId: written ? null : (chosen && chosen.id) });
    render();
    liveEl.textContent = 'Reply sent. It is on ' + EMPLOYEE.name + '’s screen.';
  }
});

store.subscribe(render);
store.listen();
render();
