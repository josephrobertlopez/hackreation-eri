// Conformance tests: the claims in spec/acceptance.md that are about the
// shipped files rather than about a function's return value.
//
// They read the real source of web/, so a future change that quietly adds
// a network call, a timer or a disability field fails the suite.
// Comments are stripped before the code is scanned, so the "no fetch here"
// comments in app.js do not count as a fetch.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const read = (...parts) => readFileSync(join(root, ...parts), 'utf8');

const html = read('web', 'index.html');
const css = read('web', 'style.css');

const jsFiles = [
  ...readdirSync(join(root, 'web')).filter((f) => f.endsWith('.js')).map((f) => join('web', f)),
  ...readdirSync(join(root, 'fixtures')).filter((f) => f.endsWith('.js')).map((f) => join('fixtures', f))
];

/** Source with comments removed, so prose about an API is not the API. */
function codeOnly(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^\s*\/\/.*$/gm, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
}

describe('no network, anywhere (P2-X4, privacy guardrail)', () => {
  const banned = [
    'fetch(', 'XMLHttpRequest', 'WebSocket', 'sendBeacon', 'EventSource',
    'navigator.connection', 'gtag(', 'dataLayer', 'analytics'
  ];

  it('P2-X4 no sender of any kind in the shipped code', () => {
    for (const file of jsFiles) {
      const code = codeOnly(read(file));
      for (const pattern of banned) {
        assert.ok(!code.includes(pattern), `${file} contains ${pattern}`);
      }
    }
  });

  it('P2-X4 nothing is loaded from the internet', () => {
    for (const file of [...jsFiles, join('web', 'index.html'), join('web', 'style.css')]) {
      const source = codeOnly(read(file));
      assert.ok(!/https?:\/\//i.test(source), `${file} references a remote URL`);
      assert.ok(!/@import/.test(source), `${file} imports a remote stylesheet`);
    }
  });

  it('every import is a relative path inside this folder', () => {
    for (const file of jsFiles) {
      for (const match of codeOnly(read(file)).matchAll(/from\s+'([^']+)'/g)) {
        assert.ok(match[1].startsWith('.'), `${file} imports "${match[1]}"`);
      }
    }
  });

  it('no build step and no npm dependencies', () => {
    const pkg = JSON.parse(read('package.json'));
    assert.equal(pkg.dependencies, undefined);
    assert.equal(pkg.devDependencies, undefined);
    assert.equal(pkg.scripts.build, undefined);
    // An `npm ci` with nothing to install may leave an empty directory
    // behind; a populated one means a dependency crept in.
    const modules = join(root, 'node_modules');
    const installedDirs = existsSync(modules)
      ? readdirSync(modules).filter((f) => f !== '.package-lock.json')
      : [];
    assert.deepEqual(installedDirs, [], `node_modules contains: ${installedDirs}`);

    // The lockfile is committed so the repo's shared runner can use
    // `npm ci`, but it must stay empty: one installed package and this
    // fails. (It cannot assert the lockfile's absence — the shared runner
    // runs `npm install` before the tests and would create one.)
    const lock = JSON.parse(read('package-lock.json'));
    const installed = Object.keys(lock.packages ?? {}).filter((k) => k !== '');
    assert.deepEqual(installed, [], `the lockfile installs: ${installed}`);
  });

  it('the repo-wide suite runner has every script it requires', () => {
    // tools/run_project_suite.sh exits 2 when any of these is missing,
    // and treats a missing script as red rather than as nothing-to-do.
    const pkg = JSON.parse(read('package.json'));
    for (const script of ['test', 'bdd', 'test:a11y']) {
      assert.ok(pkg.scripts[script], `package.json has no "${script}" script`);
    }
  });
});

describe('no clock, no stopwatch (P2-A5, P2-X1, P2-X3)', () => {
  it('P2-A5 nothing in the shipped code can time a worker', () => {
    for (const file of jsFiles) {
      const code = codeOnly(read(file));
      for (const pattern of ['setTimeout', 'setInterval', 'requestAnimationFrame',
        'new Date', 'Date.now', 'performance.now']) {
        assert.ok(!code.includes(pattern), `${file} contains ${pattern}`);
      }
    }
  });

  it('P2-A5 no page expires or refreshes itself', () => {
    assert.ok(!/http-equiv=["']refresh/i.test(html));
    assert.ok(!/autofocus/i.test(html));
  });

  it('P2-X4 no location tracking', () => {
    for (const file of jsFiles) {
      assert.ok(!codeOnly(read(file)).includes('geolocation'), `${file} uses geolocation`);
    }
  });

  it('P2-X3 nothing scores, rates or ranks the worker', () => {
    for (const file of jsFiles) {
      const code = codeOnly(read(file)).toLowerCase();
      for (const word of ['score', 'rating', 'ranking', 'grade', 'efficiency', 'productivity']) {
        assert.ok(!code.includes(word), `${file} mentions ${word}`);
      }
    }
  });

  it('P2-A7 no animation and no transition, so nothing moves on its own', () => {
    assert.ok(!/@keyframes/.test(css));
    assert.ok(!/transition\s*:/.test(css));
    assert.ok(/prefers-reduced-motion/.test(css));
  });
});

describe('nothing is asked about the person (ERI section 10)', () => {
  it('no disability or diagnosis field anywhere', () => {
    for (const file of [...jsFiles, join('web', 'index.html')]) {
      assert.ok(
        !/disabilit|diagnos|impairment|medication/i.test(codeOnly(read(file))),
        `${file} mentions a diagnosis`
      );
    }
  });

  it('the prototype collects no input at all: no form, no text box', () => {
    assert.ok(!/<form/i.test(html));
    assert.ok(!/<input/i.test(html));
    assert.ok(!/<select/i.test(html));
    assert.ok(!/<textarea/i.test(html));
  });

  it('the worker is told where their progress lives, in plain words', () => {
    assert.match(html, /stays on this device/);
    assert.match(html, /Nothing is sent anywhere/);
    assert.match(html, /Nobody is timing you/);
    assert.match(html, /Forget my progress on this device/);
  });
});

describe('the markup an assistive technology meets (P2-A1, P2-A4, P2-A8)', () => {
  it('P2-A8 declares a language and a phone viewport', () => {
    assert.match(html, /<html lang="en">/);
    assert.match(html, /name="viewport" content="width=device-width, initial-scale=1"/);
  });

  it('P2-A4 one h1, headed sections, and a skip link', () => {
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.match(html, /class="skip-link" href="#main"/);
    assert.match(html, /<main id="main">/);
    for (const section of ['task-list-screen', 'step-screen', 'help-panel']) {
      const tag = html.match(new RegExp(`<section id="${section}"[^>]*>`))[0];
      assert.match(tag, /aria-labelledby=/, `${section} has no accessible name`);
    }
  });

  it('P2-A4 every button is a real button with an explicit type', () => {
    const buttons = html.match(/<button[\s\S]*?>/g) ?? [];
    assert.ok(buttons.length >= 8, `only ${buttons.length} buttons`);
    for (const button of buttons) {
      assert.match(button, /type="button"/, `button without a type: ${button}`);
    }
    assert.ok(!/onclick=/i.test(html), 'inline onclick found');
    assert.ok(!/<div[^>]*role="button"/i.test(html), 'a div pretending to be a button');
  });

  it('P2-M6 "I Need Help" is in the header, so it is one action from any screen', () => {
    const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));
    assert.match(header, /I Need Help/);
    assert.match(header, /aria-expanded="false"/);
    assert.match(header, /aria-controls="help-panel"/);
  });

  it('P2-M5 progress is announced in words and shown as a bar', () => {
    assert.match(html, /<progress id="progress-bar"[^>]*aria-labelledby="progress-text"/);
    assert.match(html, /id="progress-text"/);
  });

  it('P2-M4 changes are announced through a polite status region', () => {
    assert.match(html, /id="live-region"[^>]*role="status"[^>]*aria-live="polite"/);
  });

  it('every element app.js reaches for really exists in index.html', () => {
    // There is no browser in this suite, so this is the check that
    // catches a renamed id before a worker meets a blank screen.
    const app = read('web', 'app.js');
    const ids = [...app.matchAll(/el\('([^']+)'\)/g)].map((m) => m[1]);
    assert.ok(ids.length >= 15, `only ${ids.length} element lookups found`);
    for (const id of new Set(ids)) {
      assert.ok(html.includes(`id="${id}"`), `index.html has no #${id}`);
    }
  });

  it('P2-A2 the step text has its own element and is never replaced by audio', () => {
    assert.match(html, /id="step-text"/);
    assert.match(html, /id="transcript"/);
    assert.match(html, /Read this step out loud/);
    const app = read('web', 'app.js');
    assert.match(app, /el\('step-text'\)\.textContent = v\.stepText;/);
  });
});

describe('large controls and a 320px screen (P2-A1, P2-A8)', () => {
  it('P2-A1 controls are at least 48px in both directions', () => {
    assert.match(css, /--tap:\s*3rem/);
    assert.match(css, /\.btn\s*\{[^}]*min-height:\s*var\(--tap\)/);
    assert.match(css, /\.btn\s*\{[^}]*min-width:\s*var\(--tap\)/);
    assert.match(css, /\.transcript summary\s*\{[^}]*min-height:\s*var\(--tap\)/);
  });

  it('P2-A1 body text starts at 18px and step text is larger still', () => {
    assert.match(css, /font:\s*1\.125rem/);
    assert.match(css, /\.step-text\s*\{[^}]*font-size:\s*1\.375rem/);
  });

  it('P2-A8 the layout has a narrow-phone case and no fixed pixel widths', () => {
    assert.match(css, /@media \(max-width: 24rem\)/);
    const fixedWidths = [...css.matchAll(/(?<!min-|max-)width:\s*(\d+)px/g)]
      .map((m) => Number(m[1]))
      .filter((px) => px > 320);
    assert.deepEqual(fixedWidths, [], `fixed widths wider than 320px: ${fixedWidths}`);
    assert.match(css, /\* \{ box-sizing: border-box; \}/);
  });

  it('P2-A4 focus is visible', () => {
    assert.match(css, /:focus-visible\s*\{[^}]*outline:/);
  });
});

describe('the files a reader needs (house style)', () => {
  it('ships a README with run commands and a traceability table', () => {
    const readme = read('README.md');
    assert.match(readme, /npm test/);
    assert.match(readme, /Spec . tests/);
    assert.match(readme, /Your job \(pick one/);
  });

  it('ships an acceptance table covering every ERI requirement id', () => {
    const spec = read('spec', 'acceptance.md');
    const expected = [
      ...Array.from({ length: 8 }, (_, i) => `P2-F${i + 1}`),
      ...Array.from({ length: 6 }, (_, i) => `P2-M${i + 1}`),
      ...Array.from({ length: 8 }, (_, i) => `P2-A${i + 1}`),
      ...Array.from({ length: 5 }, (_, i) => `P2-S${i + 1}`),
      ...Array.from({ length: 6 }, (_, i) => `P2-X${i + 1}`)
    ];
    for (const id of expected) {
      assert.ok(spec.includes(`| ${id} `), `spec/acceptance.md has no row for ${id}`);
    }
    assert.equal(expected.length, 33);
  });

  it('records the section 6 versus section 8 contradiction against P2-S1', () => {
    const spec = read('spec', 'acceptance.md');
    assert.match(spec, /contradiction/i);
    assert.match(spec, /section 6/);
    assert.match(spec, /section 8/);
    const row = spec.split('\n').find((l) => l.startsWith('| P2-S1 '));
    assert.match(row, /template/i);
  });
});
