/*
 * The shared request list, and the only place the clock and storage are read.
 *
 * Both screens - web/index.html (employee) and web/coach.html (coach) - hold
 * one of these. They are separate documents in separate tabs, so the handoff
 * ERI asked for is a real handoff: the store writes every change to
 * localStorage and announces it on a BroadcastChannel, and the other tab
 * reloads and re-renders. Nothing is faked inside one page.
 *
 * Everything the store does to a request goes through src/requests.js, so the
 * status rules hold here too. In particular: `open()` and `reply()` are the
 * only ways a status moves, both demand a coach actor, and this file sets no
 * timer of any kind. See the top of src/requests.js.
 */

import { createRequest, applyEvent, coachView } from './requests.js';

const DEFAULT_KEY = 'eri-p3-requests-v1';

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k)
  };
}

function nullChannel() {
  return { post() {}, onMessage() { return () => {}; }, close() {} };
}

export function createStore(options = {}) {
  const key = options.key || DEFAULT_KEY;
  const storage = options.storage || memoryStorage();
  const channel = options.channel || nullChannel();
  const now = options.now || (() => Date.now());

  let requests = [];
  let seq = 0;
  const listeners = new Set();

  function read() {
    try {
      const raw = storage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      // A corrupt or foreign value must not take the screen down; the employee
      // sees an empty history rather than a blank page.
      return [];
    }
  }

  function write() {
    try {
      storage.setItem(key, JSON.stringify(requests));
    } catch (err) { /* private mode, quota: the session still works in memory */ }
  }

  function notify() {
    for (const fn of listeners) fn(all());
  }

  function commit(announce) {
    write();
    notify();
    if (announce !== false) channel.post({ type: 'requests-changed', at: now() });
  }

  function all() {
    return requests.slice().sort((a, b) => b.sentAt - a.sentAt);
  }

  function replace(id, next) {
    requests = requests.map((r) => (r.id === id ? next : r));
    return next;
  }

  function get(id) {
    return requests.find((r) => r.id === id) || null;
  }

  function requireRequest(id) {
    const found = get(id);
    if (!found) throw new Error('No request with id ' + id);
    return found;
  }

  const store = {
    /** Employee action. The only way a request is born. */
    submit(input) {
      seq += 1;
      const at = now();
      const request = createRequest({
        ...input,
        id: input.id || 'req-' + String(seq).padStart(3, '0') + '-' + at,
        at
      });
      requests = requests.concat([request]);
      commit();
      return request;
    },

    /** Coach action: the coach pressed "Open this request". Moves sent -> seen. */
    open(id, actor) {
      const next = applyEvent(requireRequest(id), { type: 'coach-opened', actor, at: now() });
      replace(id, next);
      commit();
      return next;
    },

    /** Coach action: the coach sent a reply. Moves -> answered. */
    reply(id, { actor, body, replyId } = {}) {
      const next = applyEvent(requireRequest(id), {
        type: 'coach-replied', actor, body, replyId, at: now()
      });
      replace(id, next);
      commit();
      return next;
    },

    all,
    get,
    coachInbox: () => all().map(coachView),

    /** Re-read what the other tab wrote. */
    refresh() {
      requests = read();
      notify();
      return all();
    },

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    /** Wire the cross-tab handoff. Returns an unsubscribe. */
    listen() {
      return channel.onMessage(() => store.refresh());
    },

    clear() {
      requests = [];
      storage.removeItem(key);
      commit();
    },

    key
  };

  requests = read();
  return store;
}

export default createStore;
