// The three task guides. Spec: spec/acceptance.md — P2-M1, P2-M3, P2-S2, P2-S3
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { tasks } from '../fixtures/tasks.js';
import { validateTask } from '../scripts/validate-task.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(here, '..', 'fixtures');

describe('the task guides', () => {
  it('P2-M1 there are exactly three sample tasks', () => {
    assert.equal(tasks.length, 3);
  });

  it('P2-M1 ERI\'s suggested demo "Stock the Shelves" is one of them', () => {
    const demo = tasks.find((t) => t.id === 'stock-the-shelves');
    assert.ok(demo, 'Stock the Shelves is missing');
    assert.equal(demo.title, 'Stock the Shelves');
  });

  it('P2-S2 at least one task has five steps', () => {
    const fiveStep = tasks.filter((t) => t.steps.length === 5);
    assert.ok(fiveStep.length >= 1, 'no five-step task; ERI section 8 asks for one');
    // ERI's own demo is the five-step one, so the demo and the success
    // criterion are the same run.
    assert.equal(fiveStep[0].id, 'stock-the-shelves');
  });

  it('P2-M3 the demo covers ERI\'s four demo actions plus a finish step', () => {
    const demo = tasks.find((t) => t.id === 'stock-the-shelves');
    assert.deepEqual(demo.steps.map((s) => s.id), [
      'find-aisle', 'gather-supplies', 'check-labels', 'place-product', 'clean-up'
    ]);
  });

  it('the three tasks have different lengths, so the step logic is exercised', () => {
    assert.deepEqual(tasks.map((t) => t.steps.length), [5, 4, 3]);
  });

  it('task ids are unique', () => {
    const ids = tasks.map((t) => t.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it('P2-M3 and P2-S3 every step has text, a picture and an audio transcript', () => {
    for (const task of tasks) {
      for (const step of task.steps) {
        assert.ok(step.text && step.text.trim().length > 0, `${task.id}/${step.id} text`);
        assert.ok(step.audioTranscript && step.audioTranscript.trim().length > 0, `${task.id}/${step.id} transcript`);
        assert.ok(step.image && step.image.svg.includes('<svg'), `${task.id}/${step.id} picture`);
      }
    }
  });

  it('P2-A4 every picture carries a title and a description for a screen reader', () => {
    for (const task of tasks) {
      for (const step of task.steps) {
        assert.match(step.image.svg, /<title id="[^"]+">/, `${task.id}/${step.id}`);
        assert.match(step.image.svg, /<desc id="[^"]+">/, `${task.id}/${step.id}`);
        assert.match(step.image.svg, /role="img"/, `${task.id}/${step.id}`);
        assert.match(step.image.svg, /aria-labelledby="[^"]+ [^"]+"/, `${task.id}/${step.id}`);
      }
    }
  });

  it('every svg id is unique across all guides, so nothing collides', () => {
    const ids = [];
    for (const task of tasks) {
      for (const step of task.steps) {
        for (const match of step.image.svg.matchAll(/id="([^"]+)"/g)) ids.push(match[1]);
      }
    }
    assert.equal(new Set(ids).size, ids.length, `duplicate svg ids: ${ids}`);
  });

  it('pictures are drawn in the file — no binary files, no downloads', () => {
    const files = readdirSync(fixturesDir);
    for (const file of files) {
      assert.ok(/\.(js|md)$/.test(file), `unexpected file in fixtures/: ${file}`);
    }
    for (const task of tasks) {
      for (const step of task.steps) {
        assert.ok(!/https?:\/\//.test(step.image.svg), `${task.id}/${step.id} loads a remote image`);
        assert.ok(!/<image/i.test(step.image.svg), `${task.id}/${step.id} embeds a bitmap`);
      }
    }
  });

  it('P2-A3 every shipped guide passes the checker a job coach would run', () => {
    for (const task of tasks) {
      const result = validateTask(task);
      assert.deepEqual(result.errors, [], `${task.id} failed its own checker`);
      assert.equal(result.ok, true);
    }
  });

  it('P2-S1 the template a coach copies is itself valid and commented', () => {
    const source = readFileSync(join(fixturesDir, 'TEMPLATE.task.js'), 'utf8');
    assert.match(source, /FOR JOB COACHES/);
    assert.match(source, /node scripts\/validate-task\.mjs/);
    // Explained, not just present: a comment for every field a coach fills.
    for (const field of ['id', 'title', 'where', 'summary', 'text', 'audioTranscript']) {
      assert.ok(source.includes(`${field}:`), `template has no ${field}`);
    }
    const commentLines = source.split('\n').filter((l) => l.trim().startsWith('//'));
    assert.ok(commentLines.length > 40, `only ${commentLines.length} comment lines`);
  });

  it('P2-S1 adding a guide is two lines in tasks.js, and that is written down', () => {
    const source = readFileSync(join(fixturesDir, 'tasks.js'), 'utf8');
    assert.match(source, /To ADD a task guide/);
    assert.match(source, /TWO lines/);
  });

  it('P2-A3 no guide uses a word that implies hurry, scoring or diagnosis', () => {
    const words = tasks
      .flatMap((t) => [t.title, t.summary, t.where, ...t.steps.flatMap((s) => [s.title, s.text, s.audioTranscript, s.image.title, s.image.desc])])
      .join(' ')
      .toLowerCase();
    for (const banned of ['quickly', 'hurry', 'as fast as', 'timer', 'score',
      'disability', 'diagnosis', 'performance']) {
      assert.ok(!words.includes(banned), `a guide says "${banned}"`);
    }
  });
});
