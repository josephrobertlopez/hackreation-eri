// Progress stays in the browser. Spec: spec/acceptance.md — privacy guardrail
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { createStore } from '../web/storage.js';
import { initState, markComplete, reviveState } from '../web/step-machine.js';
import { task as stock } from '../fixtures/stock-the-shelves.js';
import { task as mail } from '../fixtures/sort-the-mail-cart.js';

function fakeLocalStorage() {
  const map = new Map();
  return {
    map,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k)
  };
}

describe('progress storage', () => {
  it('saves and reloads progress for one task', () => {
    const backend = fakeLocalStorage();
    const store = createStore(backend);
    const state = markComplete(stock, initState(stock));
    assert.equal(store.save(state), true);
    assert.deepEqual(reviveState(stock, store.load(stock.id)), state);
  });

  it('keys everything under one visible prefix, one key per task', () => {
    const backend = fakeLocalStorage();
    const store = createStore(backend);
    store.save(initState(stock));
    store.save(initState(mail));
    assert.deepEqual([...backend.map.keys()].sort(), [
      'workday-assistant.v1.sort-the-mail-cart',
      'workday-assistant.v1.stock-the-shelves'
    ]);
  });

  it('the worker can erase everything', () => {
    const backend = fakeLocalStorage();
    const store = createStore(backend);
    store.save(markComplete(stock, initState(stock)));
    store.save(initState(mail));
    store.forgetAll([stock.id, mail.id]);
    assert.equal(backend.map.size, 0);
    assert.equal(store.load(stock.id), null);
  });

  it('a blocked or full storage loses progress instead of crashing', () => {
    const store = createStore({
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
      removeItem: () => { throw new Error('blocked'); }
    });
    assert.equal(store.available(), false);
    assert.equal(store.save(initState(stock)), false);
    assert.equal(store.load(stock.id), null);
    assert.equal(store.forget(stock.id), false);
  });

  it('no storage at all is handled', () => {
    const store = createStore(null);
    assert.equal(store.available(), false);
    assert.equal(store.load(stock.id), null);
  });

  it('damaged stored text does not crash the app', () => {
    const backend = fakeLocalStorage();
    backend.setItem('workday-assistant.v1.stock-the-shelves', '{not json');
    assert.equal(createStore(backend).load(stock.id), null);
  });

  it('what is stored is only step ids and a position — nothing about the person', () => {
    const backend = fakeLocalStorage();
    const store = createStore(backend);
    store.save(markComplete(stock, initState(stock)));
    const stored = JSON.parse(backend.getItem('workday-assistant.v1.stock-the-shelves'));
    assert.deepEqual(Object.keys(stored).sort(), ['completedIds', 'stepIndex', 'taskId']);
  });

  it('loadAll gathers the day\'s tasks for the list screen', () => {
    const store = createStore(fakeLocalStorage());
    store.save(markComplete(stock, initState(stock)));
    const all = store.loadAll([stock.id, mail.id]);
    assert.deepEqual(Object.keys(all), [stock.id]);
  });
});
