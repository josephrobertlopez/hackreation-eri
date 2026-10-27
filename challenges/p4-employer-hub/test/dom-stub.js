/*
 * A deliberately small DOM, so `web/app.js` can be executed under plain
 * `node --test` with no dependencies and no browser.
 *
 * WHY THIS EXISTS: without it there was no evidence at all that the page
 * wiring works - every passing test exercised match.js, plan.js and guards.js
 * while app.js, where the element ids live, was never run. A typo'd id would
 * have shipped green.
 *
 * WHY IT CANNOT QUIETLY FAKE A PASS: the element tree is built BY PARSING
 * web/index.html, not hand-written, so an id the page does not have is an id
 * the stub does not have either. And test/ui-smoke.test.js asserts the stub is
 * non-degenerate before it trusts anything - a selector engine that silently
 * returned [] would make every later assertion vacuous, which is the exact
 * failure mode a stub invites.
 *
 * WHAT IT IS NOT: a browser. It has no layout, no CSS, no real event
 * propagation and no accessibility tree. It cannot tell you whether a screen
 * reader announces anything - spec/acceptance.md marks P4-A1 `human` for that
 * reason and this file does not change it.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const HTML = fs.readFileSync(path.join(here, '..', 'web', 'index.html'), 'utf8');

class StubNode {
  constructor(tag) {
    this.tagName = (tag || '#text').toUpperCase();
    this.attributes = new Map();
    this.children = [];
    this.parent = null;
    this.listeners = new Map();
    this.dataset = {};
    this.value = '';
    this.checked = false;
    this.hidden = false;
    this.className = '';
    this._text = null;
    this.focusCount = 0;
  }

  get firstChild() { return this.children[0] || null; }

  appendChild(node) { node.parent = this; this.children.push(node); return node; }

  removeChild(node) {
    const at = this.children.indexOf(node);
    if (at >= 0) this.children.splice(at, 1);
    node.parent = null;
    return node;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name === 'value') this.value = String(value);
    if (name === 'checked') this.checked = true;
    if (name === 'hidden') this.hidden = true;
    if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-(\w)/g, (_, c) => c.toUpperCase())] = String(value);
  }

  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }

  get textContent() {
    if (this._text !== null) return this._text;
    return this.children.map((c) => c.textContent).join('');
  }

  set textContent(value) { this._text = String(value); this.children = []; }

  /* The only markup assignment app.js makes is the inline SVG from
   * fixtures/art.js. Keeping it as text is enough for the assertions we make
   * about it, and honest about what the stub does: it does not parse HTML. */
  insertAdjacentHTML(_where, html) {
    const node = new StubNode(null);
    node._text = String(html);
    this.appendChild(node);
  }

  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(fn);
  }

  dispatchEvent(event) {
    event.target = event.target || this;
    for (const fn of this.listeners.get(event.type) || []) fn(event);
    /* One level of bubbling, which is all app.js relies on (the template-task
     * and manual-entry handlers sit on the container, not the checkbox). */
    if (this.parent) {
      for (const fn of this.parent.listeners.get(event.type) || []) fn(event);
    }
    return true;
  }

  focus() { this.focusCount += 1; }

  querySelector(selector) { return queryAll(this, selector)[0] || null; }

  querySelectorAll(selector) { return queryAll(this, selector); }
}

class StubEvent {
  constructor(type) { this.type = type; this.target = null; this.defaultPrevented = false; }
  preventDefault() { this.defaultPrevented = true; }
}

/* ------------------------------------------------------- tiny selector engine */

function parseMatcher(part) {
  const m = {
    tag: null, id: null, attrs: [], checked: part.includes(':checked')
  };
  const body = part.replace(/:checked/g, '');
  const tag = body.match(/^[a-zA-Z]+/);
  if (tag) m.tag = tag[0].toUpperCase();
  const id = body.match(/#([\w-]+)/);
  if (id) m.id = id[1];
  for (const a of body.matchAll(/\[([\w-]+)="([^"]*)"\]/g)) m.attrs.push([a[1], a[2]]);
  return m;
}

function matches(node, m) {
  if (m.tag && node.tagName !== m.tag) return false;
  if (m.id && node.getAttribute('id') !== m.id) return false;
  for (const [name, value] of m.attrs) if (node.getAttribute(name) !== value) return false;
  if (m.checked && !node.checked) return false;
  return true;
}

function descendants(node, out = []) {
  for (const child of node.children) { out.push(child); descendants(child, out); }
  return out;
}

function queryAll(root, selector) {
  const parts = selector.trim().split(/\s+(?![^[]*\])/);
  const target = parseMatcher(parts[parts.length - 1]);
  const ancestors = parts.slice(0, -1).map(parseMatcher);

  return descendants(root).filter((node) => {
    if (!matches(node, target)) return false;
    let cursor = node.parent;
    const needed = [...ancestors].reverse();
    for (const want of needed) {
      let found = false;
      while (cursor) {
        if (matches(cursor, want)) { found = true; cursor = cursor.parent; break; }
        cursor = cursor.parent;
      }
      if (!found) return false;
    }
    return true;
  });
}

/* ------------------------------- build the tree out of the real index.html */

/**
 * Elements are taken from web/index.html so the stub cannot disagree with the
 * page about which ids exist. Structure is flattened: app.js only relies on
 * descendant relationships for nodes it creates itself.
 */
export function installDom() {
  const root = new StubNode('body');
  const byId = new Map();

  const add = (tagName, attrs) => {
    const node = new StubNode(tagName);
    for (const [name, value] of attrs) node.setAttribute(name, value);
    root.appendChild(node);
    const id = node.getAttribute('id');
    if (id) byId.set(id, node);
    return node;
  };

  const attrsOf = (tag) => [...tag.matchAll(/([\w-]+)(?:="([^"]*)")?/g)]
    .slice(1)
    .map((m) => [m[1], m[2] === undefined ? '' : m[2]]);

  /* every element carrying an id, plus every form control (the mode radios
   * have no id and are found by [name="mode"]) */
  for (const m of HTML.matchAll(/<([a-zA-Z0-9]+)\b([^>]*\bid="[^"]+"[^>]*)>/g)) {
    add(m[1], attrsOf(`${m[1]} ${m[2]}`));
  }
  for (const m of HTML.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
    if (/\bid="/.test(m[2])) continue;
    add(m[1], attrsOf(`${m[1]} ${m[2]}`));
  }

  const document = {
    getElementById: (id) => byId.get(id) || null,
    createElement: (tag) => new StubNode(tag),
    createTextNode: (text) => { const n = new StubNode(null); n._text = String(text); return n; },
    querySelector: (sel) => root.querySelector(sel),
    querySelectorAll: (sel) => root.querySelectorAll(sel),
    body: root
  };

  globalThis.document = document;
  globalThis.Event = StubEvent;
  return { document, root, byId };
}

export { StubNode, StubEvent };
