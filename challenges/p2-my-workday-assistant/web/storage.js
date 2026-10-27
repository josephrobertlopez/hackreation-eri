// storage.js — where progress lives: this browser, and nowhere else.
//
// ERI section 10: "designed as a support for employees, not as a way for
// employers to monitor or measure workers without their knowledge. Task
// progress should remain private unless the employee understands and
// agrees to share it."
//
// So: localStorage, one key per task, a Forget button, and no sender of
// any kind in this file or anywhere else in web/. There is no fetch, no
// XMLHttpRequest, no WebSocket, no sendBeacon and no image pixel in this
// prototype, and test/conformance.test.js fails the build if one appears.
//
// Spec: spec/acceptance.md — P2-X4, P2-X3, and the privacy guardrail

const PREFIX = 'workday-assistant.v1.';

/**
 * @param {object} backend  a localStorage-like store. Pass a fake in tests.
 */
export function createStore(backend) {
  const store = backend ?? (typeof globalThis.localStorage === 'undefined'
    ? null
    : globalThis.localStorage);

  // Private browsing and blocked storage both throw. Losing progress is
  // acceptable; crashing on a worker mid-task is not.
  function safe(fn, fallback) {
    if (!store) return fallback;
    try {
      return fn();
    } catch {
      return fallback;
    }
  }

  return {
    /** Is progress being kept at all? Shown to the worker in plain words. */
    available() {
      return safe(() => {
        store.setItem(PREFIX + 'probe', '1');
        store.removeItem(PREFIX + 'probe');
        return true;
      }, false);
    },

    load(taskId) {
      return safe(() => {
        const raw = store.getItem(PREFIX + taskId);
        return raw ? JSON.parse(raw) : null;
      }, null);
    },

    save(state) {
      return safe(() => {
        store.setItem(PREFIX + state.taskId, JSON.stringify(state));
        return true;
      }, false);
    },

    forget(taskId) {
      return safe(() => {
        store.removeItem(PREFIX + taskId);
        return true;
      }, false);
    },

    /** The Forget everything button. The worker can always erase this. */
    forgetAll(taskIds) {
      return safe(() => {
        for (const id of taskIds) store.removeItem(PREFIX + id);
        return true;
      }, false);
    },

    loadAll(taskIds) {
      const out = {};
      for (const id of taskIds) {
        const found = this.load(id);
        if (found) out[id] = found;
      }
      return out;
    }
  };
}
