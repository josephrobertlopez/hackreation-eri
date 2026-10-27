// Unit tests for the step machine. Spec: spec/acceptance.md
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  initState, reviveState, clampIndex, goTo, next, back,
  currentStep, nextStep, isComplete, markComplete, undoComplete,
  restart, progress, firstIncompleteIndex
} from '../web/step-machine.js';
import { task as stock } from '../fixtures/stock-the-shelves.js';
import { task as mail } from '../fixtures/sort-the-mail-cart.js';

describe('step machine', () => {
  it('P2-M2 a fresh task starts on step one with nothing completed', () => {
    const state = initState(stock);
    assert.equal(state.taskId, 'stock-the-shelves');
    assert.equal(state.stepIndex, 0);
    assert.deepEqual(state.completedIds, []);
  });

  it('P2-M3 shows exactly one step at a time', () => {
    const state = next(stock, initState(stock));
    assert.equal(currentStep(stock, state).id, 'gather-supplies');
    assert.equal(nextStep(stock, state).id, 'check-labels');
  });

  it('P2-A5 Next stops at the last step instead of wrapping around', () => {
    let state = initState(stock);
    for (let i = 0; i < 20; i += 1) state = next(stock, state);
    assert.equal(state.stepIndex, stock.steps.length - 1);
    assert.equal(nextStep(stock, state), null);
  });

  it('P2-A5 Back stops at the first step instead of wrapping around', () => {
    let state = initState(stock);
    for (let i = 0; i < 20; i += 1) state = back(stock, state);
    assert.equal(state.stepIndex, 0);
  });

  it('clampIndex refuses nonsense indexes', () => {
    assert.equal(clampIndex(stock, -5), 0);
    assert.equal(clampIndex(stock, 99), 4);
    assert.equal(clampIndex(stock, 'two'), 0);
    assert.equal(clampIndex(stock, undefined), 0);
  });

  it('P2-M4 marking a step complete records it and moves to the next step', () => {
    const state = markComplete(stock, initState(stock));
    assert.ok(isComplete(state, 'find-aisle'));
    assert.equal(state.stepIndex, 1);
  });

  it('P2-M4 marking the last step complete stays on the last step', () => {
    let state = goTo(stock, initState(stock), 4);
    state = markComplete(stock, state);
    assert.equal(state.stepIndex, 4);
    assert.ok(isComplete(state, 'clean-up'));
  });

  it('P2-M4 marking the same step twice does not double count', () => {
    let state = markComplete(stock, initState(stock));
    state = markComplete(stock, back(stock, state));
    assert.equal(progress(stock, state).done, 1);
  });

  it('P2-M4 a mistake can be undone and costs nothing', () => {
    let state = markComplete(stock, initState(stock));
    state = back(stock, state);
    state = undoComplete(stock, state);
    assert.equal(isComplete(state, 'find-aisle'), false);
    assert.equal(progress(stock, state).done, 0);
    assert.equal(state.stepIndex, 0);
  });

  it('every function returns a new state and mutates nothing', () => {
    const start = initState(stock);
    const frozen = JSON.stringify(start);
    markComplete(stock, start);
    next(stock, start);
    back(stock, start);
    undoComplete(stock, start);
    assert.equal(JSON.stringify(start), frozen);
  });

  it('P2-M5 progress counts steps done out of the total', () => {
    let state = initState(stock);
    assert.deepEqual(progress(stock, state), {
      done: 0, total: 5, percent: 0, allDone: false, currentNumber: 1
    });
    state = markComplete(stock, state);
    state = markComplete(stock, state);
    const p = progress(stock, state);
    assert.equal(p.done, 2);
    assert.equal(p.total, 5);
    assert.equal(p.percent, 40);
    assert.equal(p.allDone, false);
    assert.equal(p.currentNumber, 3);
  });

  it('P2-S2 a five-step task can be completed end to end', () => {
    let state = initState(stock);
    for (let i = 0; i < stock.steps.length; i += 1) state = markComplete(stock, state);
    const p = progress(stock, state);
    assert.equal(p.done, 5);
    assert.equal(p.percent, 100);
    assert.equal(p.allDone, true);
  });

  it('P2-M5 progress has no field that measures time or speed', () => {
    const state = markComplete(stock, initState(stock));
    assert.deepEqual(
      Object.keys(progress(stock, state)).sort(),
      ['allDone', 'currentNumber', 'done', 'percent', 'total']
    );
  });

  it('restart clears the marks and returns to step one', () => {
    let state = markComplete(stock, markComplete(stock, initState(stock)));
    state = restart(stock);
    assert.deepEqual(state, initState(stock));
  });

  it('reopening a task returns to the first step not yet done', () => {
    let state = markComplete(stock, initState(stock));
    state = markComplete(stock, state);
    assert.equal(firstIncompleteIndex(stock, state), 2);
  });

  it('reopening a finished task lands on the last step, not past the end', () => {
    let state = initState(stock);
    for (let i = 0; i < 5; i += 1) state = markComplete(stock, state);
    assert.equal(firstIncompleteIndex(stock, state), 4);
  });

  it('a saved state from another task is ignored, not crashed on', () => {
    const saved = { taskId: 'sort-the-mail-cart', stepIndex: 2, completedIds: ['read-floor'] };
    assert.deepEqual(reviveState(stock, saved), initState(stock));
    assert.equal(reviveState(mail, saved).stepIndex, 2);
  });

  it('a damaged saved state is repaired instead of trusted', () => {
    const state = reviveState(stock, {
      taskId: 'stock-the-shelves',
      stepIndex: 400,
      completedIds: ['find-aisle', 'find-aisle', 'not-a-real-step', 7]
    });
    assert.equal(state.stepIndex, 4);
    assert.deepEqual(state.completedIds, ['find-aisle']);
  });

  it('works for a task with a different number of steps', () => {
    let state = initState(mail);
    assert.equal(progress(mail, state).total, 3);
    state = markComplete(mail, state);
    assert.equal(progress(mail, state).percent, 33);
  });
});
