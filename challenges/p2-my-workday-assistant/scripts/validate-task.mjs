// validate-task.mjs — the checker a job coach runs on a task file.
//
// Usage:
//   node scripts/validate-task.mjs fixtures/stock-the-shelves.js
//
// It prints plain-language problems and exits 1 if the guide is not
// usable yet. This is the feedback loop that makes the commented task
// template a real authoring path instead of a hopeful claim — see
// spec/acceptance.md, P2-S1 and the section 6 / section 8 contradiction.

import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

export const MAX_WORDS_PER_SENTENCE = 12;

// Words that would turn a support tool into a stopwatch. ERI section 7
// forbids requiring fast responses; section 10 forbids measuring workers.
const PRESSURE_WORDS = [
  'quickly', 'quick', 'hurry', 'fast', 'faster', 'asap', 'rush',
  'immediately', 'timer', 'stopwatch', 'speed', 'on time', 'behind schedule'
];

// Words that would make the guide a record about the person. ERI
// section 10: no requirement to disclose a disability or diagnosis.
const PERSONAL_WORDS = [
  'disability', 'disabled', 'diagnosis', 'diagnosed', 'impairment',
  'autism', 'autistic', 'adhd', 'iep', 'medication'
];

// Words that would make it an evaluation. ERI section 9 rules out
// automated employee performance evaluation.
const SCORING_WORDS = ['score', 'rating', 'rank', 'grade', 'performance review'];

const TIME_LIMIT = /\b\d+\s*(seconds?|minutes?|hours?)\b/i;
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function sentences(text) {
  return String(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function wordCount(sentence) {
  return sentence.replace(/[.!?,;:]/g, '').split(/\s+/).filter(Boolean).length;
}

function findWords(text, list) {
  const lower = ` ${String(text).toLowerCase()} `;
  return list.filter((word) => lower.includes(` ${word} `) ||
    lower.includes(` ${word}.`) || lower.includes(` ${word},`));
}

/**
 * @returns {{ok: boolean, errors: string[], notes: string[]}}
 *   errors stop the guide being used; notes are advice.
 */
export function validateTask(task) {
  const errors = [];
  const notes = [];
  const where = (label) => `${label}:`;

  if (!task || typeof task !== 'object') {
    return { ok: false, errors: ['This file does not export a task. Copy TEMPLATE.task.js and try again.'], notes };
  }

  for (const field of ['id', 'title', 'where', 'summary']) {
    if (!task[field] || String(task[field]).trim() === '') {
      errors.push(`The task is missing "${field}". Fill it in near the top of the file.`);
    }
  }
  if (task.id && !KEBAB.test(task.id)) {
    errors.push(`The id "${task.id}" must be lower case with dashes, like stock-the-shelves.`);
  }

  if (!Array.isArray(task.steps) || task.steps.length === 0) {
    errors.push('The task has no steps. A guide needs at least one step.');
    return { ok: false, errors, notes };
  }
  if (task.steps.length < 3) {
    const plural = task.steps.length === 1 ? 'step' : 'steps';
    notes.push(`This guide has ${task.steps.length} ${plural}. Three or more is usually easier to follow.`);
  }
  if (task.steps.length > 7) {
    notes.push(`This guide has ${task.steps.length} steps. More than seven is a lot. Consider splitting the task.`);
  }

  // The summary is shown to the worker, so it obeys the same rule.
  for (const sentence of sentences(task.summary ?? '')) {
    const words = wordCount(sentence);
    if (words > MAX_WORDS_PER_SENTENCE) {
      errors.push(`The summary has a ${words}-word sentence. Keep sentences to ${MAX_WORDS_PER_SENTENCE} words or fewer: "${sentence}"`);
    }
  }

  const seen = new Set();
  task.steps.forEach((step, i) => {
    const label = `Step ${i + 1}`;
    if (!step || typeof step !== 'object') {
      errors.push(`${where(label)} is not filled in.`);
      return;
    }
    if (!step.id) errors.push(`${where(label)} is missing an id.`);
    else if (!KEBAB.test(step.id)) errors.push(`${where(label)} id "${step.id}" must be lower case with dashes.`);
    else if (seen.has(step.id)) errors.push(`${where(label)} uses the id "${step.id}" twice. Each step needs its own id.`);
    else seen.add(step.id);

    if (!step.title) errors.push(`${where(label)} is missing a short title.`);
    if (!step.text) errors.push(`${where(label)} is missing the words that tell the worker what to do.`);
    if (!step.audioTranscript) {
      errors.push(`${where(label)} is missing audioTranscript. Write what the audio says, usually the same words as the text.`);
    }

    const image = step.image ?? {};
    if (!image.title) errors.push(`${where(label)} picture is missing a title.`);
    if (!image.desc) errors.push(`${where(label)} picture is missing a one-sentence description for a screen reader.`);
    if (!image.svg) {
      errors.push(`${where(label)} has no picture. Copy an svg block from an example file.`);
    } else {
      if (!image.svg.includes('<title')) errors.push(`${where(label)} picture needs a <title> line inside the svg.`);
      if (!image.svg.includes('<desc')) errors.push(`${where(label)} picture needs a <desc> line inside the svg.`);
      if (/<(script|foreignObject)/i.test(image.svg)) {
        errors.push(`${where(label)} picture must not contain a script. Pictures are pictures.`);
      }
      if (/https?:\/\//i.test(image.svg)) {
        errors.push(`${where(label)} picture loads something from the internet. Everything must be in the file.`);
      }
    }

    for (const [field, value] of [['text', step.text], ['audioTranscript', step.audioTranscript]]) {
      if (!value) continue;
      for (const sentence of sentences(value)) {
        const words = wordCount(sentence);
        if (words > MAX_WORDS_PER_SENTENCE) {
          errors.push(`${where(label)} ${field} has a ${words}-word sentence. Keep sentences to ${MAX_WORDS_PER_SENTENCE} words or fewer: "${sentence}"`);
        }
      }
    }
  });

  const allWords = [
    task.title, task.summary, task.where,
    ...task.steps.flatMap((s) => [s?.title, s?.text, s?.audioTranscript, s?.image?.title, s?.image?.desc])
  ].filter(Boolean).join(' ');

  for (const word of findWords(allWords, PRESSURE_WORDS)) {
    errors.push(`The guide says "${word}". Nobody is being timed. Take the hurry out of the words.`);
  }
  for (const word of findWords(allWords, PERSONAL_WORDS)) {
    errors.push(`The guide says "${word}". A task guide never records anything about a person's disability or diagnosis.`);
  }
  for (const word of findWords(allWords, SCORING_WORDS)) {
    errors.push(`The guide says "${word}". This tool does not score anybody.`);
  }
  if (TIME_LIMIT.test(allWords)) {
    errors.push('The guide sets a time, like "5 minutes". Steps must not have time limits.');
  }

  return { ok: errors.length === 0, errors, notes };
}

export function formatReport(file, result) {
  const lines = [];
  if (result.ok) {
    lines.push(`${file}: this guide looks good.`);
  } else {
    lines.push(`${file}: ${result.errors.length} thing(s) to fix.`);
    for (const error of result.errors) lines.push(`  - ${error}`);
  }
  for (const note of result.notes) lines.push(`  note: ${note}`);
  return lines.join('\n');
}

async function main(argv) {
  const file = argv[2];
  if (!file) {
    console.log('Usage: node scripts/validate-task.mjs fixtures/your-task.js');
    return 2;
  }
  let task;
  try {
    const module = await import(pathToFileURL(resolve(process.cwd(), file)).href);
    task = module.task;
  } catch (error) {
    console.log(`${file}: this file could not be read.`);
    console.log(`  - ${error.message}`);
    console.log('  - A missing quote mark or comma is the usual cause.');
    return 1;
  }
  const result = validateTask(task);
  console.log(formatReport(file, result));
  return result.ok ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exitCode = await main(process.argv);
}
