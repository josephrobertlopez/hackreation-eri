// Audio tests. They assert speech was INVOKED. They never assert that
// anything was audible, because on a Linux container with no voices
// installed speechSynthesis.speak() succeeds and makes no sound.
// Spec: spec/acceptance.md — P2-F3, P2-A2
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { createSpeaker, audioHint } from '../web/speech.js';
import { buildStepView } from '../web/view.js';
import { initState } from '../web/step-machine.js';
import { task as stock } from '../fixtures/stock-the-shelves.js';

function fakeSynth(voices = ['a voice']) {
  const calls = [];
  return {
    calls,
    getVoices: () => voices,
    speak: (utterance) => calls.push(utterance.text),
    cancel: () => calls.push('[cancel]')
  };
}

describe('speech', () => {
  it('P2-F3 asks the browser to speak the step text', () => {
    const synth = fakeSynth();
    const speaker = createSpeaker(() => synth, (text) => ({ text }));
    const result = speaker.speak('Walk to aisle 3.');
    assert.equal(result.invoked, true);
    assert.equal(result.reason, 'invoked');
    assert.deepEqual(synth.calls, ['[cancel]', 'Walk to aisle 3.']);
  });

  it('P2-F3 reports invoked, not audible, when the voice list is empty', () => {
    // This is the day-of Linux case: the API exists, no voices exist.
    const synth = fakeSynth([]);
    const speaker = createSpeaker(() => synth, (text) => ({ text }));
    const result = speaker.speak('Get a cart.');
    assert.equal(result.invoked, true);
    assert.equal(result.voiceCount, 0);
    assert.equal(speaker.available(), true);
  });

  it('P2-A2 says so plainly when the device has no voices', () => {
    const speaker = createSpeaker(() => fakeSynth([]), (text) => ({ text }));
    assert.match(audioHint(speaker), /words are on the screen/);
  });

  it('P2-A2 a device with no speech API degrades instead of breaking', () => {
    const speaker = createSpeaker(() => null, (text) => ({ text }));
    const result = speaker.speak('Anything.');
    assert.equal(result.invoked, false);
    assert.equal(result.reason, 'no-speech-api');
    assert.equal(speaker.available(), false);
    assert.match(audioHint(speaker), /cannot read out loud/);
  });

  it('a throwing speech engine is reported, not propagated', () => {
    const speaker = createSpeaker(
      () => ({ getVoices: () => { throw new Error('nope'); }, speak: () => { throw new Error('nope'); } }),
      (text) => ({ text })
    );
    const result = speaker.speak('Anything.');
    assert.equal(result.invoked, false);
    assert.equal(result.reason, 'speech-error');
    assert.equal(result.voiceCount, 0);
  });

  it('empty text is not spoken', () => {
    const speaker = createSpeaker(() => fakeSynth(), (text) => ({ text }));
    assert.equal(speaker.speak('   ').reason, 'no-text');
  });

  it('P2-A2 the step text is on screen whether or not speech works', () => {
    const v = buildStepView(stock, initState(stock));
    for (const synth of [fakeSynth(), fakeSynth([]), null]) {
      const speaker = createSpeaker(() => synth, (text) => ({ text }));
      speaker.speak(v.stepText);
      // The view model is the screen's source of truth, and it never
      // drops the words based on what the audio did.
      assert.ok(v.stepText.length > 0);
      assert.ok(v.formats.includes('text'));
    }
  });

  it('P2-A6 repeating is unlimited; nothing counts the repeats', () => {
    const synth = fakeSynth();
    const speaker = createSpeaker(() => synth, (text) => ({ text }));
    for (let i = 0; i < 10; i += 1) {
      assert.equal(speaker.speak('Say it again.').invoked, true);
    }
    assert.equal(synth.calls.filter((c) => c === 'Say it again.').length, 10);
  });
});
