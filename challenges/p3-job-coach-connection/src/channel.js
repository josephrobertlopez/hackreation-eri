/*
 * Cross-tab transport. BroadcastChannel where it exists, the localStorage
 * `storage` event where it does not (which also covers file:// in some
 * browsers). No server, no fetch, no WebSocket: ERI's web team can host this
 * as three static files.
 *
 * Injected into the store rather than imported by it, so the state machine
 * tests never need a browser.
 */

const PING_KEY = 'eri-p3-ping-v1';

export function createChannel(name = 'eri-p3', env = globalThis) {
  const handlers = new Set();
  let bc = null;

  if (typeof env.BroadcastChannel === 'function') {
    bc = new env.BroadcastChannel(name);
    bc.onmessage = (event) => { for (const fn of handlers) fn(event.data); };
  }

  let storageBound = false;
  function bindStorage() {
    if (storageBound || typeof env.addEventListener !== 'function') return;
    storageBound = true;
    env.addEventListener('storage', (event) => {
      if (!event || (event.key !== PING_KEY && event.key && !String(event.key).startsWith('eri-p3-'))) return;
      for (const fn of handlers) fn({ type: 'requests-changed', via: 'storage' });
    });
  }

  return {
    post(message) {
      if (bc) bc.postMessage(message);
      try {
        if (env.localStorage) env.localStorage.setItem(PING_KEY, String(Math.random()));
      } catch (err) { /* nothing to do: the local tab already re-rendered */ }
    },
    onMessage(fn) {
      handlers.add(fn);
      bindStorage();
      return () => handlers.delete(fn);
    },
    close() {
      handlers.clear();
      if (bc) bc.close();
    }
  };
}

export default createChannel;
