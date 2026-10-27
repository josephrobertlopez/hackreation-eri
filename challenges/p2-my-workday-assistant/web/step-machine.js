// step-machine.js — the rules for moving through a task's steps.
//
// Pure functions only. No DOM, no storage, no clocks, no timers.
// Every function takes a state and returns a NEW state; nothing is
// mutated, so the UI can always re-render from the value it holds.
//
// There is no clock in this file on purpose. ERI's problem statement
// forbids requiring fast responses (section 7) and forbids the tool
// being a way to measure workers (section 10). A step machine with no
// clock cannot time anybody.
//
// Spec: spec/acceptance.md — P2-M2, P2-M3, P2-M4, P2-M5, P2-A5, P2-S2, P2-S5

/** Fresh state for a task: on step one, nothing completed. */
export function initState(task) {
  return { taskId: task.id, stepIndex: 0, completedIds: [] };
}

/** Keep an index inside the task. Never wraps around. */
export function clampIndex(task, index) {
  const last = task.steps.length - 1;
  if (!Number.isInteger(index) || index < 0) return 0;
  return index > last ? last : index;
}

/** Accept a state from storage, or start fresh if it does not fit. */
export function reviveState(task, raw) {
  if (!raw || raw.taskId !== task.id) return initState(task);
  const known = new Set(task.steps.map((s) => s.id));
  const completedIds = Array.isArray(raw.completedIds)
    ? raw.completedIds.filter((id) => known.has(id))
    : [];
  return {
    taskId: task.id,
    stepIndex: clampIndex(task, raw.stepIndex),
    completedIds: [...new Set(completedIds)]
  };
}

export function goTo(task, state, index) {
  return { ...state, stepIndex: clampIndex(task, index) };
}

export function next(task, state) {
  return goTo(task, state, state.stepIndex + 1);
}

export function back(task, state) {
  return goTo(task, state, state.stepIndex - 1);
}

export function currentStep(task, state) {
  return task.steps[clampIndex(task, state.stepIndex)];
}

/** The step after the current one, or null on the last step. */
export function nextStep(task, state) {
  return task.steps[state.stepIndex + 1] ?? null;
}

export function isComplete(state, stepId) {
  return state.completedIds.includes(stepId);
}

/**
 * Mark the current step complete and move to the next step.
 * On the last step it marks complete and stays put, so the worker sees
 * the finished message instead of being thrown somewhere new.
 */
export function markComplete(task, state) {
  const step = currentStep(task, state);
  const completedIds = isComplete(state, step.id)
    ? state.completedIds
    : [...state.completedIds, step.id];
  const atLast = state.stepIndex >= task.steps.length - 1;
  return {
    ...state,
    completedIds,
    stepIndex: atLast ? state.stepIndex : state.stepIndex + 1
  };
}

/** Undo the current step. Mistakes must cost nothing. Stays on the step. */
export function undoComplete(task, state) {
  const step = currentStep(task, state);
  return {
    ...state,
    completedIds: state.completedIds.filter((id) => id !== step.id)
  };
}

/** Start the task over. Nothing is kept, nothing is reported. */
export function restart(task) {
  return initState(task);
}

/** How far along the task is. Counts steps only — never time. */
export function progress(task, state) {
  const total = task.steps.length;
  const done = task.steps.filter((s) => isComplete(state, s.id)).length;
  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
    allDone: total > 0 && done === total,
    currentNumber: clampIndex(task, state.stepIndex) + 1
  };
}

/** The first step not yet marked complete, for "pick up where I left off". */
export function firstIncompleteIndex(task, state) {
  const i = task.steps.findIndex((s) => !isComplete(state, s.id));
  return i === -1 ? task.steps.length - 1 : i;
}
