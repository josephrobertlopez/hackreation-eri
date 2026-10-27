// The coach's checker has to FAIL on bad input, or it proves nothing.
// This is the evidence behind P2-S1: the template is a real authoring
// path because editing it has a feedback loop that catches mistakes.
// Spec: spec/acceptance.md — P2-S1, P2-F1, P2-A3
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { validateTask, formatReport, MAX_WORDS_PER_SENTENCE } from '../scripts/validate-task.mjs';
import { task as stock } from '../fixtures/stock-the-shelves.js';
import { task as template } from '../fixtures/TEMPLATE.task.js';

function good() {
  return JSON.parse(JSON.stringify(stock));
}

function errorsOf(mutate) {
  const task = good();
  mutate(task);
  const result = validateTask(task);
  assert.equal(result.ok, false, 'the checker passed a guide it should have failed');
  return result.errors.join(' | ');
}

describe('the task checker', () => {
  it('passes the three shipped guides and the template', () => {
    assert.equal(validateTask(stock).ok, true);
    assert.equal(validateTask(template).ok, true);
  });

  it('fails a file that exports nothing usable', () => {
    assert.equal(validateTask(undefined).ok, false);
    assert.match(validateTask(undefined).errors[0], /does not export a task/);
  });

  it('catches a missing title in plain words', () => {
    assert.match(errorsOf((t) => { delete t.title; }), /missing "title"/);
  });

  it('catches an id a coach typed with spaces or capitals', () => {
    assert.match(errorsOf((t) => { t.id = 'Stock The Shelves'; }), /lower case with dashes/);
  });

  it('catches a task with no steps', () => {
    assert.match(errorsOf((t) => { t.steps = []; }), /no steps/);
  });

  it('catches a step with no words', () => {
    assert.match(errorsOf((t) => { delete t.steps[2].text; }), /Step 3: is missing the words/);
  });

  it('catches a missing audio transcript', () => {
    assert.match(errorsOf((t) => { delete t.steps[0].audioTranscript; }), /missing audioTranscript/);
  });

  it('catches a picture with no screen-reader description', () => {
    assert.match(errorsOf((t) => { delete t.steps[1].image.desc; }), /missing a one-sentence description/);
  });

  it('catches an svg with no title or desc line inside it', () => {
    assert.match(errorsOf((t) => { t.steps[0].image.svg = '<svg></svg>'; }), /needs a <title> line/);
    assert.match(errorsOf((t) => { t.steps[0].image.svg = '<svg><title>x</title></svg>'; }), /needs a <desc> line/);
  });

  it('refuses a picture that pulls something off the internet', () => {
    assert.match(
      errorsOf((t) => { t.steps[0].image.svg = '<svg><title>a</title><desc>b</desc><image href="https://example.com/a.png"/></svg>'; }),
      /loads something from the internet/
    );
  });

  it('refuses a picture carrying a script', () => {
    assert.match(
      errorsOf((t) => { t.steps[0].image.svg = '<svg><title>a</title><desc>b</desc><script>alert(1)</script></svg>'; }),
      /must not contain a script/
    );
  });

  it('catches two steps sharing an id', () => {
    assert.match(errorsOf((t) => { t.steps[1].id = t.steps[0].id; }), /twice/);
  });

  it(`catches a sentence longer than ${MAX_WORDS_PER_SENTENCE} words`, () => {
    assert.match(
      errorsOf((t) => {
        t.steps[0].text = 'Walk over to aisle three and then look up at the sign that hangs above the shelf.';
      }),
      /word sentence/
    );
  });

  it('holds the task summary to the same sentence rule', () => {
    assert.match(
      errorsOf((t) => {
        t.summary = 'Put all of the new product onto the shelves in aisle three today.';
      }),
      /The summary has a 13-word sentence/
    );
  });

  it('catches hurry words, because nobody is being timed', () => {
    assert.match(errorsOf((t) => { t.steps[0].text = 'Walk quickly to aisle 3.'; }), /Nobody is being timed/);
  });

  it('catches a time limit written into a step', () => {
    assert.match(errorsOf((t) => { t.steps[0].text = 'Finish this in 5 minutes.'; }), /must not have time limits/);
  });

  it('catches any mention of a disability or diagnosis', () => {
    assert.match(errorsOf((t) => { t.summary = 'For a worker with a disability.'; }), /never records anything about/);
  });

  it('catches scoring language', () => {
    assert.match(errorsOf((t) => { t.summary = 'Your score goes up when you finish.'; }), /does not score anybody/);
  });

  it('advises, but does not block, on step count', () => {
    const short = good();
    short.steps = short.steps.slice(0, 2);
    const result = validateTask(short);
    assert.equal(result.ok, true);
    assert.match(result.notes.join(' '), /Three or more/);
  });

  it('the report a coach reads names the file and the fixes', () => {
    const broken = good();
    delete broken.title;
    const text = formatReport('fixtures/mine.js', validateTask(broken));
    assert.match(text, /^fixtures\/mine\.js: 1 thing\(s\) to fix\./);
    assert.match(text, /- The task is missing "title"/);
    assert.match(formatReport('fixtures/mine.js', validateTask(stock)), /looks good/);
  });
});
