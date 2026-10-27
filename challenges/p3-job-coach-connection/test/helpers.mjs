/*
 * Shared plumbing for the tests. No dependencies: node:test, node:assert,
 * node:fs only.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export function read(relPath) {
  return readFileSync(join(ROOT, relPath), 'utf8');
}

function filesIn(relDir, extensions) {
  return readdirSync(join(ROOT, relDir))
    .filter((name) => extensions.some((ext) => name.endsWith(ext)))
    .map((name) => relDir + '/' + name);
}

/** Everything that ships to a browser: the two screens, their scripts, the
 *  shared modules and every fixture. Documentation is deliberately NOT here -
 *  README.md and spec/ discuss the rules and would trip the word scans. */
export function shippedFiles() {
  return [
    ...filesIn('web', ['.html', '.js', '.css']),
    ...filesIn('src', ['.js']),
    ...filesIn('fixtures', ['.js'])
  ].sort();
}

export function shippedSources() {
  return shippedFiles().map((path) => ({ path, text: read(path) }));
}

/** An in-memory stand-in for localStorage, shared between two stores so the
 *  two-tab handoff can be driven without a browser. */
export function fakeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    get size() { return map.size; }
  };
}

/** An in-memory stand-in for BroadcastChannel. */
export function fakeBus() {
  const subscribers = new Set();
  return {
    endpoint() {
      const handlers = new Set();
      const self = {
        post(message) {
          for (const other of subscribers) if (other !== self) other.deliver(message);
        },
        deliver(message) { for (const fn of handlers) fn(message); },
        onMessage(fn) { handlers.add(fn); return () => handlers.delete(fn); },
        close() { subscribers.delete(self); }
      };
      subscribers.add(self);
      return self;
    }
  };
}

/** A clock the tests move by hand, so "nothing happens over time" is testable. */
export function manualClock(start = 1_700_000_000_000) {
  let t = start;
  return { now: () => t, advance: (ms) => (t += ms) };
}

export const COACH_ACTOR = { id: 'coach-maria-delgado', role: 'coach' };

/** Does a path, written relative to `fromFile`, exist in this folder?
 *  Nothing in node imports web/employee.js or web/coach.js, so a typo in one
 *  of their import paths would only show up as a blank page in a browser. */
export function resolvesFrom(fromFile, spec) {
  if (!spec.startsWith('.')) return true; // bare specifier: not ours to resolve
  return existsSync(join(ROOT, dirname(fromFile), spec));
}
