// view.js — turns a task plus its state into a plain description of what
// the screen should say. No DOM here either, so every screen claim in
// spec/acceptance.md can be tested with `node --test`.
//
// Spec: spec/acceptance.md — P2-M1, P2-M3, P2-M5, P2-A2, P2-S3, P2-S5

import {
  currentStep,
  nextStep,
  isComplete,
  progress
} from './step-machine.js';

/** The day's task list. ERI section 6 step 1, section 4 "Daily routine". */
export function buildTaskListView(tasks, statesById = {}) {
  return tasks.map((task) => {
    const state = statesById[task.id];
    const p = state
      ? progress(task, state)
      : { done: 0, total: task.steps.length, percent: 0, allDone: false };
    let statusText = 'Not started';
    if (p.allDone) statusText = 'All steps done';
    else if (p.done > 0) statusText = `${p.done} of ${p.total} steps done`;
    return {
      id: task.id,
      title: task.title,
      where: task.where,
      summary: task.summary,
      stepCount: task.steps.length,
      done: p.done,
      total: p.total,
      statusText,
      // What the button says out loud to a screen reader.
      openLabel: `Open task: ${task.title}. ${task.steps.length} steps. ${statusText}.`
    };
  });
}

/** One step at a time, with everything that step carries. */
export function buildStepView(task, state) {
  const step = currentStep(task, state);
  const p = progress(task, state);
  const after = nextStep(task, state);
  const last = task.steps.length - 1;

  const formats = [];
  if (step.text) formats.push('text');
  if (step.image && step.image.svg) formats.push('picture');
  if (step.audioTranscript) formats.push('audio transcript');

  return {
    taskId: task.id,
    taskTitle: task.title,
    where: task.where,

    stepId: step.id,
    stepNumber: state.stepIndex + 1,
    stepCount: task.steps.length,
    stepTitle: step.title,
    // The words are always here. Audio is an extra, never a replacement.
    stepText: step.text,
    imageSvg: step.image.svg,
    imageTitle: step.image.title,
    imageDesc: step.image.desc,
    transcript: step.audioTranscript,
    formats,

    positionLabel: `Step ${state.stepIndex + 1} of ${task.steps.length}`,
    // Ends in a full stop either way, so a screen reader pauses the same
    // on the last step as on any other.
    nextLabel: after ? `Next: ${after.title}.` : 'This is the last step.',

    stepIsComplete: isComplete(state, step.id),
    completeLabel: isComplete(state, step.id)
      ? 'This step is done'
      : 'Mark this step done',

    canGoBack: state.stepIndex > 0,
    canGoNext: state.stepIndex < last,

    progress: p,
    progressLabel: `${p.done} of ${p.total} steps done`,
    finished: p.allDone,
    finishedMessage: p.allDone
      ? `You finished all ${p.total} steps of ${task.title}.`
      : '',

    // Both are always true, everywhere. ERI section 8: repeat or request help.
    repeatAvailable: true,
    helpAvailable: true
  };
}

/** One short sentence for the live region, after something happens. */
export function buildAnnouncement(task, state, action) {
  const v = buildStepView(task, state);
  if (action === 'completed') {
    if (v.finished) return v.finishedMessage;
    return `Step marked done. ${v.progressLabel}. Now ${v.positionLabel}: ${v.stepTitle}.`;
  }
  if (action === 'undone') {
    return `Step is not done. ${v.progressLabel}. ${v.positionLabel}: ${v.stepTitle}.`;
  }
  if (action === 'restarted') {
    return `Starting over. ${v.positionLabel}: ${v.stepTitle}.`;
  }
  if (action === 'opened') {
    return `${task.title} opened. ${v.positionLabel}: ${v.stepTitle}.`;
  }
  return `${v.positionLabel}: ${v.stepTitle}. ${v.nextLabel}`;
}

/**
 * The help panel. This tool does not send anything anywhere, so help is
 * the worker's own options plus the words to say. Sending a request to a
 * coach is ERI project 3, not this one.
 */
export const HELP_OPTIONS = [
  {
    id: 'read-again',
    label: 'Show me this step again',
    detail: 'The step stays on the screen. Nothing is lost.'
  },
  {
    id: 'hear-again',
    label: 'Read this step out loud again',
    detail: 'If you hear nothing, the words are still on the screen.'
  },
  {
    id: 'start-over',
    label: 'Start this task over',
    detail: 'Your marks are cleared. You can start at step one.'
  },
  {
    id: 'ask-person',
    label: 'I want to ask a person',
    detail: 'You can say: "I need help with this task, please."'
  }
];
