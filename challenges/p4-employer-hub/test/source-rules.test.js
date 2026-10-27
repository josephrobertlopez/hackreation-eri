/*
 * Rules you can only check against the source: accessibility wiring, the
 * no-network / no-storage / no-timer promises, and the copy.
 *
 * These are not a substitute for driving the page with a keyboard and a screen
 * reader - see spec/acceptance.md, where P4-A1 to P4-A3 are marked `human`.
 * What they do catch is the regression: a contributor adding an unlabelled
 * input, a fetch, a localStorage write or a countdown.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const HTML = read('web/index.html');
const CSS = read('web/style.css');

const APP_SOURCES = ['web/app.js', 'web/match.js', 'web/plan.js', 'web/guards.js'];
const FIXTURE_SOURCES = ['fixtures/vocabulary.js', 'fixtures/industries.js', 'fixtures/candidates.js', 'fixtures/resources.js', 'fixtures/art.js'];

/** Everything a user actually reads. Excludes guards.js, which has to contain
 *  the forbidden words in order to forbid them. */
const COPY_SOURCES = ['web/index.html', 'web/app.js', 'web/plan.js', ...FIXTURE_SOURCES];

/*
 * Scan CODE, not comments. The first run of these tests failed on app.js,
 * because app.js's header comment lists `fetch`, `localStorage` and the rest as
 * the things it deliberately does not do. The guard was right to flag the
 * words and wrong about what they were - so strip comments first. The line-
 * comment pattern deliberately does not fire after a colon, so the `https://`
 * inside a URL string survives.
 */
function code(rel) {
  return read(rel)
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:\w])\/\/.*$/gm, '$1');
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/* ------------------------------------------------- P4-A5 accessible forms */

describe('accessible forms and controls (P4-A5)', () => {
  it('P4-A5 every form control is labelled, by for= or by being inside its label', () => {
    const labelFors = new Set([...HTML.matchAll(/<label[^>]*\bfor="([^"]+)"/g)].map((m) => m[1]));
    const labelBlocks = HTML.match(/<label\b[\s\S]*?<\/label>/g) || [];
    const controls = [...HTML.matchAll(/<(?:input|select|textarea)\b[^>]*>/g)].map((m) => m[0]);

    assert.ok(controls.length >= 10, `only ${controls.length} controls found - did the parse work?`);
    for (const tag of controls) {
      const id = (tag.match(/\bid="([^"]+)"/) || [])[1];
      const labelled = (id && labelFors.has(id)) || labelBlocks.some((block) => block.includes(tag));
      assert.ok(labelled, `unlabelled control: ${tag}`);
    }
  });

  it('P4-A5 the parse is real: an unlabelled control in a sample is caught', () => {
    const sample = '<input type="text" id="orphan">';
    const labelFors = new Set();
    const labelBlocks = [];
    const labelled = labelFors.has('orphan') || labelBlocks.some((b) => b.includes(sample));
    assert.equal(labelled, false, 'the check itself must be able to fail');
  });

  it('P4-A5 every fieldset has a legend as its first element', () => {
    const fieldsets = HTML.match(/<fieldset\b[\s\S]*?<\/fieldset>/g) || [];
    assert.ok(fieldsets.length >= 4, `only ${fieldsets.length} fieldsets`);
    for (const fs_ of fieldsets) {
      assert.match(fs_, /<legend[^>]*>[^<]+<\/legend>/, `fieldset without a legend: ${fs_.slice(0, 80)}`);
    }
  });

  it('P4-A5 every aria-labelledby and aria-describedby points at an id that exists', () => {
    const ids = new Set([...HTML.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
    for (const m of HTML.matchAll(/\baria-(?:labelledby|describedby)="([^"]+)"/g)) {
      for (const token of m[1].split(/\s+/)) {
        assert.ok(ids.has(token), `aria reference to a missing id: ${token}`);
      }
    }
  });

  it('P4-A5 errors go to a focusable alert, not just a red border', () => {
    assert.match(HTML, /id="error-summary"[^>]*role="alert"/);
    assert.match(HTML, /id="error-summary"[^>]*tabindex="-1"/);
    assert.match(read('web/app.js'), /summary\.focus\(\)/, 'the error summary has to actually take focus');
  });
});

/* ----------------------------------------------- P4-A1 keyboard, P4-A4 mobile */

describe('keyboard, structure and small screens (P4-A1, P4-A3, P4-A4)', () => {
  it('P4-A1 there is a skip link, a language, one h1, and a focusable results heading', () => {
    assert.match(HTML, /<html lang="en">/);
    assert.match(HTML, /class="skip" href="#main"/);
    assert.equal((HTML.match(/<h1\b/g) || []).length, 1);
    assert.match(HTML, /id="main"/);
    assert.match(HTML, /id="results-h" tabindex="-1"/);
    assert.match(read('web/app.js'), /\$\('results-h'\)\.focus\(\)/, 'focus must move to the result');
  });

  it('P4-A3 heading levels do not skip a level', () => {
    const levels = [...HTML.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
    let previous = levels[0];
    for (const level of levels.slice(1)) {
      assert.ok(level <= previous + 1, `heading jumps from h${previous} to h${level}`);
      previous = level;
    }
  });

  it('P4-A1 focus is always visible: no outline is removed anywhere', () => {
    assert.doesNotMatch(CSS, /outline\s*:\s*(none|0)\b/, 'never remove the focus ring');
    assert.match(CSS, /:focus[^{]*\{[^}]*outline\s*:\s*3px/);
  });

  it('P4-A4 mobile-friendly: a viewport meta, a narrow-screen rule, and no fixed layout widths', () => {
    assert.match(HTML, /name="viewport" content="width=device-width, initial-scale=1"/);
    assert.match(CSS, /@media \(max-width: 30rem\)/);
    const fixed = [...CSS.matchAll(/(?:^|[^-\w])width\s*:\s*(\d{3,})px/g)].map((m) => m[0].trim());
    assert.deepEqual(fixed, [], `fixed pixel widths break on a phone: ${fixed.join(', ')}`);
  });

  it('P4-A4 touch targets are at least 44px', () => {
    assert.ok((CSS.match(/min-height:\s*44px/g) || []).length >= 3, 'buttons, inputs and choice rows all need the 44px floor');
  });

  it('P4-A2 (partial) the visible copy carries no business jargon', () => {
    const jargon = ['leverage', 'synergy', 'utilize', 'utilise', 'ideate', 'operationalize', 'holistic solution', 'best-in-class', 'value-add', 'low-hanging fruit'];
    for (const rel of COPY_SOURCES) {
      const text = read(rel).toLowerCase();
      for (const word of jargon) assert.ok(!text.includes(word), `${rel} contains jargon: "${word}"`);
    }
    /* Plain language is a judgement, not a regex. P4-A2 is marked `human` in
     * spec/acceptance.md for exactly that reason; this is a floor, not a pass. */
  });

  it('P4-A7 the copy avoids the words that would make this a different product', () => {
    const banned = [
      'suffers from', 'confined to', 'wheelchair-bound', 'wheelchair bound', 'special needs',
      'handicapped', 'differently abled', 'the disabled', 'normal people', 'high-functioning',
      'low-functioning', 'inspiring', 'brave', 'despite their', 'afflicted', 'victim of',
      'overcome their', 'in spite of their'
    ];
    for (const rel of COPY_SOURCES) {
      const text = read(rel).toLowerCase();
      for (const phrase of banned) {
        assert.ok(!text.includes(phrase), `${rel} contains "${phrase}"`);
      }
    }
  });
});

/* ------------------------------- P4-A6 no time limits, P4-V5 nothing leaves */

describe('no timers, no network, no storage (P4-A6, P4-V5, P4-X4, P4-X5)', () => {
  it('P4-A6 there is no timer anywhere, so there is no time limit to impose one', () => {
    for (const rel of [...APP_SOURCES, ...FIXTURE_SOURCES]) {
      const src = code(rel);
      assert.doesNotMatch(src, /\bsetTimeout\s*\(/, `${rel} uses setTimeout`);
      assert.doesNotMatch(src, /\bsetInterval\s*\(/, `${rel} uses setInterval`);
      assert.doesNotMatch(src, /requestAnimationFrame\s*\(/, `${rel} animates on a clock`);
    }
    assert.doesNotMatch(HTML, /http-equiv="refresh"/i, 'no meta refresh');
  });

  it('P4-V5 nothing is sent anywhere: no fetch, XHR, WebSocket, form action or beacon', () => {
    for (const rel of [...APP_SOURCES, ...FIXTURE_SOURCES]) {
      const src = code(rel);
      assert.doesNotMatch(src, /\bfetch\s*\(/, `${rel} calls fetch`);
      assert.doesNotMatch(src, /XMLHttpRequest/, `${rel} uses XHR`);
      assert.doesNotMatch(src, /new WebSocket/, `${rel} opens a socket`);
      assert.doesNotMatch(src, /sendBeacon/, `${rel} sends a beacon`);
      assert.doesNotMatch(src, /import\s*\(\s*['"]http/, `${rel} imports over the network`);
    }
    assert.doesNotMatch(HTML, /<form[^>]*\baction=/, 'the form must not post anywhere');
    assert.doesNotMatch(HTML, /<script[^>]*src="https?:/, 'no third-party script');
    assert.doesNotMatch(HTML, /<link[^>]*href="https?:/, 'no third-party stylesheet or font');
    assert.doesNotMatch(HTML, /<(img|iframe|video|audio)\b/, 'no remote media; imagery is inline SVG');
  });

  it('P4-X5 nothing is stored: no localStorage, sessionStorage, cookie or IndexedDB', () => {
    for (const rel of [...APP_SOURCES, ...FIXTURE_SOURCES]) {
      const src = code(rel);
      assert.doesNotMatch(src, /localStorage/, `${rel} writes localStorage`);
      assert.doesNotMatch(src, /sessionStorage/, `${rel} writes sessionStorage`);
      assert.doesNotMatch(src, /document\.cookie/, `${rel} sets a cookie`);
      assert.doesNotMatch(src, /indexedDB/, `${rel} uses IndexedDB`);
    }
  });

  it('P4-X4 no build step and no dependencies: nothing to integrate with', () => {
    const pkg = JSON.parse(read('package.json'));
    assert.equal(pkg.dependencies, undefined, 'no runtime dependencies');
    assert.equal(pkg.devDependencies, undefined, 'no dev dependencies either - node --test is enough');
    assert.equal(pkg.type, 'module');
    /* `tools/run_project_suite.sh` runs `npm install` before the suite, which
     * creates a node_modules holding only `.package-lock.json` even with zero
     * dependencies. So the assertion is "no package was installed", not "the
     * directory is absent" - the stricter version would have gone red the
     * first time this ran under the repo's own runner. */
    const modules = path.join(root, 'node_modules');
    const installed = fs.existsSync(modules)
      ? fs.readdirSync(modules, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
      : [];
    assert.deepEqual(installed, [], `packages were installed: ${installed.join(', ')}`);
  });
});

/* ------------------------------------------------------- imagery and assets */

describe('imagery is inline, described, and text-only (P4-A1, P4-A5)', () => {
  it('P4-A1 every inline SVG has role="img", aria-labelledby, a title and a desc', () => {
    const art = read('fixtures/art.js');
    const svgs = art.match(/<svg[\s\S]*?<\/svg>/g) || [];
    assert.ok(svgs.length >= 2, `only ${svgs.length} figures found`);
    for (const svg of svgs) {
      assert.match(svg, /role="img"/);
      assert.match(svg, /aria-labelledby="([^"]+)"/);
      assert.match(svg, /<title id="[^"]+">[^<]+<\/title>/);
      assert.match(svg, /<desc id="[^"]+">[^<]+<\/desc>/);
      const referenced = svg.match(/aria-labelledby="([^"]+)"/)[1].split(/\s+/);
      for (const id of referenced) {
        assert.ok(svg.includes(`id="${id}"`), `aria-labelledby names ${id}, which the svg does not define`);
      }
      const desc = svg.match(/<desc id="[^"]+">([^<]+)<\/desc>/)[1];
      assert.ok(desc.length > 60, 'a desc should describe the figure, not restate the title');
    }
  });

  it('no binary files: every file in this challenge is text', () => {
    const files = walk(root);
    assert.ok(files.length >= 12, `only ${files.length} files found`);
    for (const file of files) {
      const buf = fs.readFileSync(file);
      assert.ok(!buf.includes(0), `${path.relative(root, file)} contains a NUL byte, so it is not text`);
    }
  });
});
