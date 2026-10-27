// Step definitions for features/workday.feature.
//
// Each step drives the real modules — the same step machine, view model,
// speaker and storage the browser uses. Nothing here is a stub.

import assert from 'node:assert/strict';

import { tasks } from '../fixtures/tasks.js';
import {
  initState, next, back, markComplete, undoComplete, progress
} from '../web/step-machine.js';
import { buildStepView, buildTaskListView, buildAnnouncement, HELP_OPTIONS } from '../web/view.js';
import { createSpeaker } from '../web/speech.js';
import { createStore } from '../web/storage.js';
import { validateTask } from '../scripts/validate-task.mjs';

function view(world) {
  return buildStepView(world.task, world.state);
}

export const defs = [
  {
    pattern: /^the worker opens the app$/,
    fn: (world) => {
      world.tasks = tasks;
      world.rows = buildTaskListView(tasks);
    }
  },
  {
    pattern: /^they see (\d+) tasks$/,
    fn: (world, count) => assert.equal(world.rows.length, Number(count))
  },
  {
    pattern: /^one of the tasks is called "(.+)"$/,
    fn: (world, title) =>
      assert.ok(world.rows.some((r) => r.title === title), `no task called ${title}`)
  },
  {
    pattern: /^every task says how many steps it has$/,
    fn: (world) => {
      for (const row of world.rows) assert.match(row.openLabel, /\d+ steps/);
    }
  },
  {
    pattern: /^they open the task "(.+)"$/,
    fn: (world, title) => {
      world.task = tasks.find((t) => t.title === title);
      assert.ok(world.task, `no task called ${title}`);
      world.state = initState(world.task);
      world.announcement = buildAnnouncement(world.task, world.state, 'opened');
    }
  },
  {
    pattern: /^they are on step (\d+) of (\d+)$/,
    fn: (world, step, total) =>
      assert.equal(view(world).positionLabel, `Step ${step} of ${total}`)
  },
  {
    pattern: /^the step shows the words "(.+)"$/,
    fn: (world, words) => assert.equal(view(world).stepText, words)
  },
  {
    pattern: /^the step shows a picture described as "(.+)"$/,
    fn: (world, title) => {
      const v = view(world);
      assert.equal(v.imageTitle, title);
      assert.match(v.imageSvg, /<desc id="[^"]+">/);
    }
  },
  {
    pattern: /^they are told what comes next: "(.+)"$/,
    fn: (world, label) => assert.equal(view(world).nextLabel, label)
  },
  {
    pattern: /^they press Back$/,
    fn: (world) => { world.state = back(world.task, world.state); }
  },
  {
    pattern: /^they press Next$/,
    fn: (world) => { world.state = next(world.task, world.state); }
  },
  {
    pattern: /^they mark the step done$/,
    fn: (world) => {
      world.state = markComplete(world.task, world.state);
      world.announcement = buildAnnouncement(world.task, world.state, 'completed');
    }
  },
  {
    pattern: /^they mark (\d+) steps done$/,
    fn: (world, count) => {
      for (let i = 0; i < Number(count); i += 1) {
        world.state = markComplete(world.task, world.state);
      }
      world.announcement = buildAnnouncement(world.task, world.state, 'completed');
    }
  },
  {
    pattern: /^they undo the step$/,
    fn: (world) => {
      world.state = undoComplete(world.task, world.state);
      world.announcement = buildAnnouncement(world.task, world.state, 'undone');
    }
  },
  {
    pattern: /^the progress says "(.+)"$/,
    fn: (world, label) => assert.equal(view(world).progressLabel, label)
  },
  {
    pattern: /^the announcement is "(.+)"$/,
    fn: (world, message) => assert.equal(world.announcement, message)
  },
  {
    pattern: /^they are told "(.+)"$/,
    fn: (world, message) => assert.equal(view(world).finishedMessage, message)
  },
  {
    pattern: /^nothing expires and no step is timed$/,
    fn: (world) => {
      const keys = Object.keys(view(world)).concat(Object.keys(progress(world.task, world.state)));
      for (const key of keys) {
        assert.ok(!/time|elapsed|duration|deadline|speed/i.test(key), `view exposes ${key}`);
      }
    }
  },
  {
    pattern: /^they ask to hear the step (\d+) times$/,
    fn: (world, times) => {
      world.spoken = [];
      // A browser with no installed voice behaves exactly like this fake:
      // speak() is called and nothing is heard. We assert the call only.
      const synth = { getVoices: () => [], speak: (u) => world.spoken.push(u.text), cancel: () => {} };
      const speaker = createSpeaker(() => synth, (text) => ({ text }));
      for (let i = 0; i < Number(times); i += 1) {
        world.lastSpeech = speaker.speak(view(world).stepText);
      }
    }
  },
  {
    pattern: /^speech was invoked (\d+) times$/,
    fn: (world, times) => {
      assert.equal(world.spoken.length, Number(times));
      assert.equal(world.lastSpeech.invoked, true);
    }
  },
  {
    pattern: /^no test claims the audio was heard$/,
    fn: (world) => {
      // The engine reported zero voices, so nothing was audible, and the
      // step still passes because audibility is not the claim.
      assert.equal(world.lastSpeech.voiceCount, 0);
    }
  },
  {
    pattern: /^the step words are still on the screen$/,
    fn: (world) => {
      const v = view(world);
      assert.ok(v.stepText.length > 0);
      assert.ok(v.formats.includes('text'));
    }
  },
  {
    pattern: /^"I Need Help" is available on every step of every task$/,
    fn: () => {
      for (const task of tasks) {
        let state = initState(task);
        for (let i = 0; i < task.steps.length; i += 1) {
          assert.equal(buildStepView(task, state).helpAvailable, true);
          state = next(task, state);
        }
      }
      assert.ok(HELP_OPTIONS.length >= 3);
    }
  },
  {
    pattern: /^help offers a way to repeat the step and a way to ask a person$/,
    fn: () => {
      const ids = HELP_OPTIONS.map((o) => o.id);
      assert.ok(ids.includes('read-again'));
      assert.ok(ids.includes('ask-person'));
    }
  },
  {
    pattern: /^what is stored is only "(.+)"$/,
    fn: (world, fields) => {
      const map = new Map();
      const store = createStore({
        getItem: (k) => (map.has(k) ? map.get(k) : null),
        setItem: (k, v) => map.set(k, v),
        removeItem: (k) => map.delete(k)
      });
      store.save(world.state);
      world.stored = JSON.parse(map.get(`workday-assistant.v1.${world.task.id}`));
      world.store = store;
      assert.deepEqual(Object.keys(world.stored).sort(), fields.split(', ').sort());
    }
  },
  {
    pattern: /^no stored value is a time or a score$/,
    fn: (world) => {
      const flat = JSON.stringify(world.stored);
      assert.ok(!/\d{10,}/.test(flat), 'a timestamp was stored');
      assert.ok(!/score|rating|speed/i.test(flat));
    }
  },
  {
    pattern: /^the worker can erase it$/,
    fn: (world) => {
      world.store.forgetAll([world.task.id]);
      assert.equal(world.store.load(world.task.id), null);
    }
  },
  {
    pattern: /^a coach writes a guide with a (\d+)-word sentence$/,
    fn: (world, words) => {
      const guide = JSON.parse(JSON.stringify(tasks[0]));
      guide.steps[0].text = Array.from({ length: Number(words) }, () => 'word').join(' ') + '.';
      world.result = validateTask(guide);
    }
  },
  {
    pattern: /^the checker says "(.+)"$/,
    fn: (world, message) =>
      assert.ok(
        world.result.errors.some((e) => e.includes(message)),
        `the checker said: ${world.result.errors.join(' | ')}`
      )
  },
  {
    pattern: /^the checker does not pass the guide$/,
    fn: (world) => assert.equal(world.result.ok, false)
  },
  {
    pattern: /^the three shipped guides pass the same checker$/,
    fn: () => {
      for (const task of tasks) assert.deepEqual(validateTask(task).errors, []);
    }
  }
];
