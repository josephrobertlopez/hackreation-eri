// app.js — the only file that touches the DOM.
//
// Everything decidable lives in step-machine.js, view.js, speech.js and
// storage.js, which are pure and tested with `node --test`. This file
// paints a view model onto elements and sends clicks back.
//
// Deliberately absent from this file: fetch, XMLHttpRequest, WebSocket,
// sendBeacon, setTimeout, setInterval, Date. No network, no clock. The
// tool must not be able to time or report on a worker.

import { tasks } from '../fixtures/tasks.js';
import {
  initState, reviveState, next, back, markComplete, undoComplete,
  restart, progress, firstIncompleteIndex, goTo
} from './step-machine.js';
import {
  buildTaskListView, buildStepView, buildAnnouncement, HELP_OPTIONS
} from './view.js';
import { createSpeaker, audioHint } from './speech.js';
import { createStore } from './storage.js';

const store = createStore();
const speaker = createSpeaker();

let task = null;    // the open task, or null on the list screen
let state = null;   // its step state

const el = (id) => document.getElementById(id);

const screens = {
  list: el('task-list-screen'),
  step: el('step-screen')
};

function say(message) {
  // Replacing the text in a role="status" region is what makes a screen
  // reader announce it. Clearing first keeps repeat messages distinct.
  const region = el('live-region');
  region.textContent = '';
  region.textContent = message;
}

/* ---------------- screen 1: the day's tasks ---------------- */

function renderTaskList() {
  const states = store.loadAll(tasks.map((t) => t.id));
  const rows = buildTaskListView(tasks, states);
  const list = el('task-list');
  list.textContent = '';

  for (const row of rows) {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'task-open';
    button.setAttribute('aria-label', row.openLabel);

    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = row.title;

    const meta = document.createElement('span');
    meta.className = 'task-meta';
    meta.textContent = `${row.where} — ${row.stepCount} steps — ${row.statusText}`;

    button.append(title, meta);
    button.addEventListener('click', () => openTask(row.id));
    li.append(button);
    list.append(li);
  }
}

function showList() {
  task = null;
  state = null;
  screens.step.hidden = true;
  screens.list.hidden = false;
  renderTaskList();
  el('task-list-heading').setAttribute('tabindex', '-1');
  el('task-list-heading').focus();
}

/* ---------------- screen 2: one step at a time ---------------- */

function openTask(taskId) {
  task = tasks.find((t) => t.id === taskId);
  if (!task) return;
  const saved = store.load(taskId);
  state = saved ? reviveState(task, saved) : initState(task);
  // Come back to where the work stopped, not to a blank slate.
  state = goTo(task, state, firstIncompleteIndex(task, state));
  screens.list.hidden = true;
  screens.step.hidden = false;
  render('opened');
  el('step-task-title').setAttribute('tabindex', '-1');
  el('step-task-title').focus();
}

function render(action) {
  const v = buildStepView(task, state);

  el('step-task-title').textContent = v.taskTitle;
  el('step-where').textContent = v.where;

  el('progress-text').textContent = v.progressLabel;
  const bar = el('progress-bar');
  bar.max = v.progress.total;
  bar.value = v.progress.done;

  el('step-position').textContent = `${v.positionLabel}: ${v.stepTitle}`;

  // The picture is trusted local SVG from fixtures/, and it carries its
  // own <title> and <desc> for screen readers.
  el('step-image').innerHTML = v.imageSvg;
  el('step-image-caption').textContent = v.imageTitle;

  el('step-text').textContent = v.stepText;
  el('transcript').textContent = v.transcript;
  el('audio-hint').textContent = audioHint(speaker);
  el('next-up').textContent = v.nextLabel;

  const done = el('mark-done');
  done.textContent = v.stepIsComplete
    ? 'Done. Press to undo this step.'
    : 'Mark this step done';
  done.setAttribute('aria-pressed', String(v.stepIsComplete));

  el('go-back').disabled = !v.canGoBack;
  el('go-next').disabled = !v.canGoNext;

  const finished = el('finished-message');
  finished.hidden = !v.finished;
  finished.textContent = v.finished
    ? `${v.finishedMessage} You can start it again any time.`
    : '';

  store.save(state);
  if (action) say(buildAnnouncement(task, state, action));
}

function update(nextState, action) {
  state = nextState;
  render(action);
}

/* ---------------- help ---------------- */

function renderHelpOptions() {
  const list = el('help-options');
  list.textContent = '';
  for (const option of HELP_OPTIONS) {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn';

    const label = document.createElement('span');
    label.textContent = option.label;
    const detail = document.createElement('span');
    detail.className = 'help-detail';
    detail.textContent = option.detail;

    button.append(label, detail);
    button.addEventListener('click', () => chooseHelp(option));
    li.append(button);
    list.append(li);
  }
}

function openHelp() {
  el('help-panel').hidden = false;
  el('help-button').setAttribute('aria-expanded', 'true');
  el('help-heading').setAttribute('tabindex', '-1');
  el('help-heading').focus();
}

function closeHelp() {
  el('help-panel').hidden = true;
  el('help-script').hidden = true;
  el('help-button').setAttribute('aria-expanded', 'false');
  el('help-button').focus();
}

function chooseHelp(option) {
  const script = el('help-script');
  if (option.id === 'hear-again' && task) {
    const v = buildStepView(task, state);
    const result = speaker.speak(`${v.stepTitle}. ${v.stepText}`);
    script.textContent = result.invoked
      ? 'Asked this device to read the step out loud. The words are also on the screen.'
      : 'This device cannot read out loud. The words are on the screen.';
  } else if (option.id === 'read-again' && task) {
    closeHelp();
    render();
    el('step-text').scrollIntoView({ block: 'center' });
    return;
  } else if (option.id === 'start-over' && task) {
    update(restart(task), 'restarted');
    closeHelp();
    return;
  } else {
    script.textContent = option.detail;
  }
  script.hidden = false;
}

/* ---------------- wiring ---------------- */

el('help-button').addEventListener('click', () => {
  if (el('help-panel').hidden) openHelp();
  else closeHelp();
});
el('help-close').addEventListener('click', closeHelp);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !el('help-panel').hidden) closeHelp();
});

el('back-to-list').addEventListener('click', showList);

el('say-again').addEventListener('click', () => {
  if (!task) return;
  const v = buildStepView(task, state);
  const result = speaker.speak(`${v.stepTitle}. ${v.stepText}`);
  say(result.invoked
    ? 'Reading the step out loud. The words are also on the screen.'
    : 'This device cannot read out loud. The words are on the screen.');
});

el('mark-done').addEventListener('click', () => {
  if (!task) return;
  const v = buildStepView(task, state);
  if (v.stepIsComplete) update(undoComplete(task, state), 'undone');
  else update(markComplete(task, state), 'completed');
});

el('go-back').addEventListener('click', () => {
  if (task) update(back(task, state), 'moved');
});
el('go-next').addEventListener('click', () => {
  if (task) update(next(task, state), 'moved');
});

el('restart-task').addEventListener('click', () => {
  if (task) update(restart(task), 'restarted');
});

el('forget-all').addEventListener('click', () => {
  store.forgetAll(tasks.map((t) => t.id));
  renderTaskList();
  say('Your progress on this device was erased.');
});

/* ---------------- start ---------------- */

renderHelpOptions();
showList();
if (!store.available()) {
  el('privacy-line').textContent =
    'This browser will not remember your progress. Nothing is sent anywhere.';
}

// Exposed only so a browser console or a future e2e test can poke it.
// Nothing reads it, and nothing sends it.
globalThis.workdayAssistant = {
  tasks,
  current: () => ({ taskId: task?.id ?? null, state }),
  progressOf: () => (task ? progress(task, state) : null)
};
