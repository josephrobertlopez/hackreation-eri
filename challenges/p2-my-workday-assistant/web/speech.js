// speech.js — optional spoken audio.
//
// HONEST LIMIT. On a Linux box with no speech voices installed,
// `speechSynthesis` exists, `getVoices()` returns an empty list, and
// `speak()` does nothing at all — silently, with no error. The hackathon
// workspaces are Linux containers, so that is the case we must assume.
//
// So this module promises exactly one thing: it reports whether speech
// was INVOKED. It never claims anything was heard, and the step text is
// on the screen whether speech works or not.
//
// Spec: spec/acceptance.md — P2-F3, P2-A2, P2-A6, P2-S3

/**
 * @param {() => object|null} getSynth    returns a speechSynthesis-like object
 * @param {(text:string) => object} makeUtterance  builds an utterance object
 */
export function createSpeaker(getSynth, makeUtterance) {
  const synthOf = getSynth ?? (() =>
    typeof globalThis.speechSynthesis === 'undefined'
      ? null
      : globalThis.speechSynthesis);

  const utteranceOf = makeUtterance ?? ((text) =>
    typeof globalThis.SpeechSynthesisUtterance === 'undefined'
      ? { text }
      : new globalThis.SpeechSynthesisUtterance(text));

  /** Is there a speech API at all? Not the same as "you will hear it". */
  function available() {
    const synth = synthOf();
    return Boolean(synth && typeof synth.speak === 'function');
  }

  /**
   * How many voices the browser admits to having. Zero is common on
   * Linux and means speak() will be silent.
   */
  function voiceCount() {
    const synth = synthOf();
    if (!synth || typeof synth.getVoices !== 'function') return 0;
    try {
      const voices = synth.getVoices();
      return Array.isArray(voices) ? voices.length : 0;
    } catch {
      return 0;
    }
  }

  return {
    available,
    voiceCount,

    /**
     * Ask the browser to say the text.
     * @returns {{invoked: boolean, reason: string, voiceCount: number}}
     *   invoked:true means we called speak(). It does NOT mean audible.
     */
    speak(text) {
      const voices = voiceCount();
      if (typeof text !== 'string' || text.trim() === '') {
        return { invoked: false, reason: 'no-text', voiceCount: voices };
      }
      const synth = synthOf();
      if (!synth || typeof synth.speak !== 'function') {
        return { invoked: false, reason: 'no-speech-api', voiceCount: voices };
      }
      try {
        if (typeof synth.cancel === 'function') synth.cancel();
        synth.speak(utteranceOf(text));
        return { invoked: true, reason: 'invoked', voiceCount: voices };
      } catch {
        return { invoked: false, reason: 'speech-error', voiceCount: voices };
      }
    },

    stop() {
      const synth = synthOf();
      if (synth && typeof synth.cancel === 'function') synth.cancel();
    }
  };
}

/** The line we show under the audio button. Never promises sound. */
export function audioHint(speaker) {
  if (!speaker.available()) {
    return 'This device cannot read out loud. The words are on the screen.';
  }
  if (speaker.voiceCount() === 0) {
    return 'This device may have no voice installed. The words are on the screen.';
  }
  return 'You can also read the words on the screen.';
}
