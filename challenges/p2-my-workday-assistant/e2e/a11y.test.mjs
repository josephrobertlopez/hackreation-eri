// Accessibility checks, without a browser.
//
// HONEST SCOPE, read this before trusting a green run. There is no
// Playwright and no axe here, because this challenge ships zero npm
// packages. What this file does is a STATIC audit of the real markup and
// the real stylesheet: accessible names, heading order, label targets,
// duplicate ids, tab order, target size, and WCAG contrast ratios
// computed from the colour tokens.
//
// What it CANNOT do, and what therefore remains human (see spec/acceptance.md,
// rows P2-A4 and P2-A8):
//   - a real screen-reader pass (NVDA, VoiceOver, Orca)
//   - a real keyboard walk of the live page
//   - a real phone at 320px
//   - anything about computed layout, focus order at runtime, or audio
//
// A green run here means "nothing obviously wrong in the source". It does
// not mean the thing is accessible. Only a person using it can say that.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { tasks } from '../fixtures/tasks.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const html = readFileSync(join(root, 'web', 'index.html'), 'utf8');
const css = readFileSync(join(root, 'web', 'style.css'), 'utf8');

const idsInDocument = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);

function attribute(tag, name) {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1] : null;
}

/** All element tags of one kind, with the text up to the closing tag. */
function elements(kind) {
  const pattern = new RegExp(`<${kind}\\b([^>]*)>([\\s\\S]*?)</${kind}>`, 'g');
  return [...html.matchAll(pattern)].map((m) => ({
    tag: `<${kind}${m[1]}>`,
    text: m[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }));
}

/* ---------- WCAG contrast, computed from the colour tokens ---------- */

function channel(value) {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const clean = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

function tokens(block) {
  const found = {};
  for (const match of block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)) {
    found[match[1]] = match[2];
  }
  return found;
}

const lightBlock = css.slice(css.indexOf(':root {'), css.indexOf('@media (prefers-color-scheme: dark)'));
const darkBlock = css.slice(css.indexOf('@media (prefers-color-scheme: dark)'), css.indexOf('* { box-sizing'));
const light = tokens(lightBlock);
const dark = tokens(darkBlock);

describe('colour contrast (WCAG 2.2 AA, computed not claimed)', () => {
  for (const [name, theme] of [['light', light], ['dark', dark]]) {
    it(`${name}: body text on the page is at least 4.5:1`, () => {
      const ratio = contrast(theme.ink, theme.page);
      assert.ok(ratio >= 4.5, `${name} ink on page is ${ratio.toFixed(2)}:1`);
    });

    it(`${name}: quiet text on the page is at least 4.5:1`, () => {
      const ratio = contrast(theme.muted, theme.page);
      assert.ok(ratio >= 4.5, `${name} muted on page is ${ratio.toFixed(2)}:1`);
    });

    it(`${name}: the primary button's own text is at least 4.5:1`, () => {
      const ratio = contrast(theme['accent-ink'], theme.accent);
      assert.ok(ratio >= 4.5, `${name} accent-ink on accent is ${ratio.toFixed(2)}:1`);
    });

    it(`${name}: a control's border against the page is at least 3:1`, () => {
      const ratio = contrast(theme.line, theme.page);
      assert.ok(ratio >= 3, `${name} line on page is ${ratio.toFixed(2)}:1`);
    });

    it(`${name}: the focus ring against the page is at least 3:1`, () => {
      const ratio = contrast(theme.focus, theme.page);
      assert.ok(ratio >= 3, `${name} focus on page is ${ratio.toFixed(2)}:1`);
    });
  }
});

describe('names, roles and labels', () => {
  it('every button has a name a screen reader can read', () => {
    const buttons = elements('button');
    assert.ok(buttons.length >= 8, `only ${buttons.length} buttons`);
    for (const button of buttons) {
      const name = button.text || attribute(button.tag, 'aria-label');
      assert.ok(name && name.length > 0, `button with no name: ${button.tag}`);
    }
  });

  it('button labels are short and plain, not shouted', () => {
    for (const button of elements('button')) {
      if (!button.text) continue;
      const words = button.text.split(/\s+/).length;
      assert.ok(words <= 10, `long button label: "${button.text}"`);
      assert.notEqual(button.text, button.text.toUpperCase(), `shouting: "${button.text}"`);
    }
  });

  it('every aria-labelledby, aria-controls and for points at a real id', () => {
    for (const name of ['aria-labelledby', 'aria-controls', 'for']) {
      for (const match of html.matchAll(new RegExp(`${name}="([^"]+)"`, 'g'))) {
        for (const target of match[1].split(/\s+/)) {
          assert.ok(idsInDocument.includes(target), `${name}="${target}" has no such element`);
        }
      }
    }
  });

  it('no id is used twice', () => {
    const seen = new Set();
    for (const id of idsInDocument) {
      assert.ok(!seen.has(id), `duplicate id: ${id}`);
      seen.add(id);
    }
  });

  it('headings go h1, h2, h3 with no level skipped', () => {
    const levels = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
    assert.equal(levels[0], 1, 'the page does not start with an h1');
    let deepest = 1;
    for (const level of levels) {
      assert.ok(level <= deepest + 1, `jumped to h${level} after h${deepest}`);
      deepest = Math.max(deepest, level);
    }
  });

  it('the page declares a language and has a title', () => {
    assert.match(html, /<html lang="[a-z]{2}">/);
    assert.match(html, /<title>[^<]+<\/title>/);
  });
});

describe('keyboard and focus', () => {
  it('nothing hijacks the tab order with a positive tabindex', () => {
    for (const match of html.matchAll(/tabindex="(-?\d+)"/g)) {
      assert.ok(Number(match[1]) <= 0, `positive tabindex: ${match[1]}`);
    }
  });

  it('there is a skip link to the main content', () => {
    assert.match(html, /<a class="skip-link" href="#main">/);
    assert.ok(idsInDocument.includes('main'));
  });

  it('a visible focus style exists and is not removed anywhere', () => {
    assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*4px/);
    assert.ok(!/outline:\s*(none|0)/.test(css), 'a rule removes the focus outline');
  });

  it('the screens that are off are really off, not just invisible', () => {
    // hidden removes the element from the tab order; opacity:0 does not.
    assert.match(html, /<section id="step-screen"[^>]*hidden>/);
    assert.match(html, /<section id="help-panel"[^>]*hidden>/);
    assert.match(css, /\[hidden\] \{ display: none !important; \}/);
  });
});

describe('target size and text size (WCAG 2.2 AA)', () => {
  it('controls are at least 48 by 48', () => {
    assert.match(css, /--tap:\s*3rem/);
    assert.match(css, /\.btn\s*\{[\s\S]*?min-height:\s*var\(--tap\)/);
    assert.match(css, /\.btn\s*\{[\s\S]*?min-width:\s*var\(--tap\)/);
  });

  it('nothing sets a font size below 1rem', () => {
    const sizes = [...css.matchAll(/font-size:\s*([\d.]+)rem/g)].map((m) => Number(m[1]));
    assert.ok(sizes.length > 0);
    assert.equal(sizes.filter((s) => s < 1).length, 0, `small text: ${sizes.filter((s) => s < 1)}`);
  });

  it('text can reflow: no fixed width over 320px, and border-box everywhere', () => {
    const wide = [...css.matchAll(/(?<!min-|max-)width:\s*(\d+)px/g)]
      .map((m) => Number(m[1]))
      .filter((px) => px > 320);
    assert.deepEqual(wide, []);
    assert.match(css, /\* \{ box-sizing: border-box; \}/);
  });
});

describe('text alternatives for every picture', () => {
  it('each step picture names itself to a screen reader', () => {
    for (const task of tasks) {
      for (const step of task.steps) {
        const svg = step.image.svg;
        const labelledby = attribute(svg, 'aria-labelledby');
        assert.ok(labelledby, `${task.id}/${step.id} has no aria-labelledby`);
        const [titleId, descId] = labelledby.split(/\s+/);
        assert.match(svg, new RegExp(`<title id="${titleId}">`), `${task.id}/${step.id} title id`);
        assert.match(svg, new RegExp(`<desc id="${descId}">`), `${task.id}/${step.id} desc id`);
        assert.match(svg, /role="img"/);
        // Decorative detail inside the drawing must not be announced.
        assert.match(svg, /focusable="false"/);
      }
    }
  });

  it('the picture also has a visible caption, for people who do not use a screen reader', () => {
    assert.match(html, /<figcaption id="step-image-caption">/);
  });
});

describe('what this file does not prove', () => {
  it('states its own limits in the file, so a reader is not misled', () => {
    const self = readFileSync(join(here, 'a11y.test.mjs'), 'utf8');
    assert.match(self, /HONEST SCOPE/);
    assert.match(self, /no Playwright and no axe/);
    assert.match(self, /real screen-reader pass/);
  });
});
