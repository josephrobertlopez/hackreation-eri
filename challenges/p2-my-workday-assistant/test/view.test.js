// What the screen says, tested without a browser. Spec: spec/acceptance.md
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { initState, markComplete, goTo, next } from '../web/step-machine.js';
import {
  buildTaskListView, buildStepView, buildAnnouncement, HELP_OPTIONS
} from '../web/view.js';
import { tasks } from '../fixtures/tasks.js';
import { task as stock } from '../fixtures/stock-the-shelves.js';

describe('the task list screen', () => {
  it('P2-M1 shows three tasks, each with a labelled way to open it', () => {
    const rows = buildTaskListView(tasks);
    assert.equal(rows.length, 3);
    for (const row of rows) {
      assert.ok(row.title.length > 0);
      assert.ok(row.openLabel.startsWith('Open task: '));
      assert.match(row.openLabel, /\d+ steps/);
    }
  });

  it('P2-M1 includes ERI\'s suggested demo task', () => {
    const ids = buildTaskListView(tasks).map((r) => r.id);
    assert.ok(ids.includes('stock-the-shelves'));
  });

  it('P2-M5 a part-finished task says how far along it is', () => {
    const state = markComplete(stock, initState(stock));
    const row = buildTaskListView([stock], { 'stock-the-shelves': state })[0];
    assert.equal(row.statusText, '1 of 5 steps done');
  });

  it('P2-M5 an untouched task says Not started, not zero percent', () => {
    assert.equal(buildTaskListView([stock])[0].statusText, 'Not started');
  });
});

describe('the step screen', () => {
  it('P2-M3 names the current step and what comes next', () => {
    const v = buildStepView(stock, goTo(stock, initState(stock), 2));
    assert.equal(v.positionLabel, 'Step 3 of 5');
    assert.equal(v.stepTitle, 'Check the product labels');
    assert.equal(v.nextLabel, 'Next: Put the product on the shelf.');
  });

  it('P2-S5 on the last step it says so instead of inventing a next step', () => {
    const v = buildStepView(stock, goTo(stock, initState(stock), 4));
    assert.equal(v.nextLabel, 'This is the last step.');
    assert.equal(v.canGoNext, false);
    assert.equal(v.canGoBack, true);
  });

  it('P2-M3 and P2-S3 every step carries text and a picture, at least two formats', () => {
    for (const task of tasks) {
      for (let i = 0; i < task.steps.length; i += 1) {
        const v = buildStepView(task, goTo(task, initState(task), i));
        assert.ok(v.stepText.length > 0, `${task.id} step ${i} has no text`);
        assert.ok(v.imageSvg.includes('<svg'), `${task.id} step ${i} has no picture`);
        assert.ok(v.imageTitle.length > 0);
        assert.ok(v.imageDesc.length > 0);
        assert.ok(v.formats.includes('text'));
        assert.ok(v.formats.includes('picture'));
        assert.ok(v.formats.length >= 2);
      }
    }
  });

  it('P2-A2 the step text is present even though audio may be silent', () => {
    const v = buildStepView(stock, initState(stock));
    assert.equal(v.stepText, 'Walk to aisle 3. The sign hangs above the shelf.');
    assert.equal(v.transcript, v.stepText);
  });

  it('P2-M4 the complete control is labelled and reversible', () => {
    const before = buildStepView(stock, initState(stock));
    assert.equal(before.stepIsComplete, false);
    assert.equal(before.completeLabel, 'Mark this step done');

    const state = markComplete(stock, initState(stock));
    const after = buildStepView(stock, goTo(stock, state, 0));
    assert.equal(after.stepIsComplete, true);
    assert.equal(after.completeLabel, 'This step is done');
  });

  it('P2-M5 progress is shown as steps, in words and as a count', () => {
    const state = markComplete(stock, markComplete(stock, initState(stock)));
    const v = buildStepView(stock, state);
    assert.equal(v.progressLabel, '2 of 5 steps done');
    assert.equal(v.progress.done, 2);
    assert.equal(v.progress.total, 5);
  });

  it('P2-S2 finishing the five-step task gives a plain finished message', () => {
    let state = initState(stock);
    for (let i = 0; i < 5; i += 1) state = markComplete(stock, state);
    const v = buildStepView(stock, state);
    assert.equal(v.finished, true);
    assert.equal(v.finishedMessage, 'You finished all 5 steps of Stock the Shelves.');
  });

  it('P2-M6 and P2-S4 help and repeat are available on every step', () => {
    for (const task of tasks) {
      for (let i = 0; i < task.steps.length; i += 1) {
        const v = buildStepView(task, goTo(task, initState(task), i));
        assert.equal(v.helpAvailable, true);
        assert.equal(v.repeatAvailable, true);
      }
    }
  });

  it('P2-X1 and P2-X3 the view model carries no time, place or score field', () => {
    const v = buildStepView(stock, initState(stock));
    const banned = ['time', 'elapsed', 'duration', 'started', 'deadline',
      'speed', 'score', 'rating', 'location', 'latitude', 'gps'];
    for (const key of Object.keys(v)) {
      for (const word of banned) {
        assert.ok(!key.toLowerCase().includes(word), `view exposes "${key}"`);
      }
    }
  });
});

describe('what the screen reader is told', () => {
  it('P2-M4 completing a step announces progress and the new position', () => {
    const state = markComplete(stock, initState(stock));
    assert.equal(
      buildAnnouncement(stock, state, 'completed'),
      'Step marked done. 1 of 5 steps done. Now Step 2 of 5: Get your supplies.'
    );
  });

  it('P2-S2 completing the last step announces the finish', () => {
    let state = initState(stock);
    for (let i = 0; i < 5; i += 1) state = markComplete(stock, state);
    assert.equal(
      buildAnnouncement(stock, state, 'completed'),
      'You finished all 5 steps of Stock the Shelves.'
    );
  });

  it('P2-S5 moving between steps announces where you are and what is next', () => {
    const state = next(stock, initState(stock));
    assert.equal(
      buildAnnouncement(stock, state, 'moved'),
      'Step 2 of 5: Get your supplies. Next: Check the product labels.'
    );
  });

  it('undoing says the step is not done, without any scolding', () => {
    const message = buildAnnouncement(stock, initState(stock), 'undone');
    assert.match(message, /^Step is not done\./);
  });
});

describe('the help panel', () => {
  it('P2-M6 offers repeat, re-read, start over and ask a person', () => {
    const ids = HELP_OPTIONS.map((o) => o.id);
    assert.deepEqual(ids, ['read-again', 'hear-again', 'start-over', 'ask-person']);
    for (const option of HELP_OPTIONS) {
      assert.ok(option.label.length > 0);
      assert.ok(option.detail.length > 0);
    }
  });

  it('P2-F8 no help option asks about a disability or a diagnosis', () => {
    const words = HELP_OPTIONS.map((o) => `${o.label} ${o.detail}`).join(' ').toLowerCase();
    for (const banned of ['disability', 'diagnosis', 'disabled', 'impairment', 'condition']) {
      assert.ok(!words.includes(banned), `help mentions "${banned}"`);
    }
  });
});
