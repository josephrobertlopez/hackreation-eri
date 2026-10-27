/*
 * ERI's prohibitions, as tests. Everything ERI put out of scope (§9) or ruled
 * out on privacy grounds (§10) is checked against the source that ships, not
 * against a promise in a README.
 *
 * These are source scans. A source scan proves a pattern is absent from the
 * code; it cannot prove the running page made no request. The browser-side
 * proof is a two-minute human protocol in spec/acceptance.md (open DevTools,
 * Network tab, use the whole app, count the requests after load).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { readProjectFile, openingTags, attr, stripJsComments, ROOT } from './helpers/markup.js';
import * as portfolioApi from '../web/portfolio.js';
import * as renderApi from '../web/render.js';

/**
 * Every source file that ends up in the browser.
 *
 * `fixtures/write-media-files.mjs` is excluded by name: it is a one-shot Node
 * script for regenerating fixtures/media/*.svg, it imports node:fs, and it
 * never reaches a page. Excluding it is a scope decision, not a waiver — it is
 * still covered by the fixtures drift test.
 */
const NOT_SHIPPED = new Set(['write-media-files.mjs']);

function shippedFiles() {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      if (entry === 'node_modules' || entry === '.git' || NOT_SHIPPED.has(entry)) continue;
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) {
        walk(path);
        continue;
      }
      if (/\.(js|mjs|html|css)$/.test(entry)) out.push(relative(ROOT, path));
    }
  };
  walk(join(ROOT, 'web'));
  walk(join(ROOT, 'fixtures'));
  return out;
}

const SHIPPED = shippedFiles();
const SOURCES = SHIPPED.map((file) => [file, stripJsComments(readProjectFile(file))]);

describe('no network requests of any kind (P1-N1, P1-X5)', () => {
  it('there is a file to scan, and it is the whole browser surface', () => {
    assert.ok(SHIPPED.length >= 7, 'expected the web/ and fixtures/ sources, got ' + SHIPPED.join(', '));
  });

  for (const [file, source] of SOURCES) {
    it(file + ': calls nothing that can reach the network', () => {
      for (const pattern of [
        /\bfetch\s*\(/, /XMLHttpRequest/, /WebSocket/, /EventSource/, /sendBeacon/,
        /importScripts/, /navigator\.serviceWorker/, /new Image\s*\(/, /\.submit\s*\(/
      ]) {
        assert.doesNotMatch(source, pattern, file + ' matches ' + pattern);
      }
    });

    it(file + ': contains no absolute URL except the SVG namespace', () => {
      // A host needs a dot in it. Without that, `.replace(/\//g, '_')` reads as
      // the URL "//g" and the scan cries wolf at its own base64url encoder.
      const urls = (source.match(/(https?:)?\/\/[a-z0-9-]+(\.[a-z0-9-]+)+/gi) || [])
        .filter((u) => !u.includes('www.w3.org'));
      assert.deepEqual(urls, [], file + ' reaches off the page: ' + urls.join(', '));
    });
  }

  it('every href and src in the HTML is a relative path next to the page', () => {
    const html = readProjectFile('web/index.html');
    const refs = openingTags(html, 'a')
      .concat(openingTags(html, 'link'), openingTags(html, 'script'), openingTags(html, 'img'))
      .flatMap((raw) => [attr(raw, 'href'), attr(raw, 'src')])
      .filter(Boolean);
    assert.ok(refs.length >= 3);
    for (const ref of refs) {
      assert.ok(!/^(https?:)?\/\//.test(ref), 'remote reference: ' + ref);
    }
  });

  it('imports only relative ES modules — no framework, no CDN, no bare specifier', () => {
    for (const [file, source] of SOURCES) {
      for (const match of source.matchAll(/\bfrom\s+'([^']+)'/g)) {
        assert.match(match[1], /^\.{1,2}\//, file + ' imports a non-relative module: ' + match[1]);
        assert.match(match[1], /\.js$/, file + ' imports without an extension: ' + match[1]);
      }
    }
  });

  it('keeps nothing in the browser between visits either', () => {
    // Not a network rule, the same instinct: a prototype that quietly persists
    // someone's portfolio is a prototype storing their data without being asked.
    for (const [file, source] of SOURCES) {
      assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|document\.cookie/, file);
    }
  });
});

describe('the share artifact is a file, not a dying handle (P1-F6)', () => {
  it('never mints a blob or object URL', () => {
    for (const [file, source] of SOURCES) {
      assert.doesNotMatch(source, /createObjectURL|new Blob\s*\(|URL\.revokeObjectURL/, file);
    }
  });

  it('downloads via a data: URL on an anchor with a download attribute', () => {
    const app = readProjectFile('web/app.js');
    assert.match(app, /download="/);
    assert.match(app, /toDataUrl\(/);
  });
});

describe('no scoring, ranking or assessment of a person (ERI §9)', () => {
  it('the public API has no function that could produce a verdict', () => {
    for (const name of [...Object.keys(portfolioApi), ...Object.keys(renderApi)]) {
      assert.doesNotMatch(
        name,
        /score|rank|rating|grade|assess|suitab|percent|fitness|evaluate|judge|tier|level/i,
        'suspicious export: ' + name
      );
    }
  });

  it('nothing in the code sorts or weights skills by any quality measure', () => {
    // JS only: `font-weight: 600` is typography, not a ranking coefficient.
    for (const [file, source] of SOURCES.filter(([f]) => f.endsWith('.js'))) {
      assert.doesNotMatch(source, /\.sort\s*\(\s*\(/, file + ' sorts something — justify it before allowing');
      assert.doesNotMatch(source, /\bweight(s|ing)?\s*[:=]/i, file);
    }
  });

  it('the exported portfolio says in words that it assesses nobody', () => {
    assert.match(portfolioApi.PORTFOLIO_FOOTER_TEXT, /no score, no rating and no assessment/);
  });
});

describe('ERI §9 out of scope, checked rather than promised', () => {
  const forbidden = [
    ['a commercial job board (P1-X1)', /indeed|linkedin|ziprecruiter|glassdoor|monster\.com|job[-_ ]?board[-_ ]?api/i],
    ['automated hiring or applicant scoring (P1-X2)', /applicant|shortlist|candidate[-_ ]?score|hiring[-_ ]?decision|reject/i],
    ['employer account management (P1-X3)', /\b(login|log in|sign ?up|sign ?in|password|auth token|employer account|dashboard)\b/i],
    ['an AI assessment of suitability (P1-X4)', /openai|anthropic|gemini|\bllm\b|completions|embedding|inference/i],
    ['identity verification (P1-X5)', /\bssn\b|social security|date of birth|\bdob\b|passport|driver.?s licen|verify identity/i]
  ];

  for (const [label, pattern] of forbidden) {
    it('ships no ' + label, () => {
      for (const [file, source] of SOURCES) {
        assert.doesNotMatch(source, pattern, file + ' mentions ' + label);
      }
    });
  }

  it('has no file input, because this prototype uses sample media only (ERI §10)', () => {
    for (const [file, source] of SOURCES) {
      assert.doesNotMatch(source, /type="file"|capture=/, file);
    }
  });
});

describe('no field for a disability or a diagnosis, anywhere (ERI §10)', () => {
  it('the profile accepts exactly ERI’s three fields and refuses the rest', () => {
    assert.deepEqual(portfolioApi.PROFILE_FIELDS, ['displayName', 'interests', 'activities']);
    const p = portfolioApi.emptyPortfolio();
    for (const field of ['disability', 'diagnosis', 'medicalNotes', 'accommodation', 'supportNeed', 'impairment']) {
      assert.throws(() => portfolioApi.setProfile(p, { [field]: 'x' }), portfolioApi.PortfolioError, field);
    }
  });

  it('a stored portfolio has no key that reads as a health detail', () => {
    const keys = new Set();
    const walk = (node) => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (node && typeof node === 'object') {
        for (const [k, v] of Object.entries(node)) {
          keys.add(k);
          walk(v);
        }
      }
    };
    walk(portfolioApi.emptyPortfolio());
    for (const key of keys) assert.doesNotMatch(key, portfolioApi.PROTECTED_FIELD_PATTERN, key);
  });
});

describe('no build step, no dependencies (P1-X5)', () => {
  const pkg = JSON.parse(readProjectFile('package.json'));

  it('declares no dependency of any kind', () => {
    assert.deepEqual(pkg.dependencies, {});
    assert.deepEqual(pkg.devDependencies, {});
  });

  it('has no build, bundle or compile script to run first', () => {
    for (const [name, command] of Object.entries(pkg.scripts)) {
      assert.doesNotMatch(name, /build|bundle|compile|prepare|postinstall/, 'script: ' + name);
      assert.doesNotMatch(command, /webpack|vite|rollup|esbuild|babel|tsc/, name + ': ' + command);
    }
  });

  it('ships no lockfile to install from, because there is nothing to install', () => {
    const entries = readdirSync(ROOT);
    assert.ok(!entries.includes('package-lock.json'));
    assert.ok(!entries.includes('node_modules'));
  });
});

describe('user-recorded media cannot be committed (ERI §10)', () => {
  const ignore = readProjectFile('.gitignore');

  it('refuses every format a camera or microphone produces', () => {
    for (const ext of ['mp4', 'mov', 'webm', 'mp3', 'm4a', 'wav', 'jpg', 'jpeg', 'png', 'heic']) {
      assert.match(ignore, new RegExp('^\\*\\.' + ext + '$', 'm'), '.gitignore misses *.' + ext);
    }
  });

  it('still tracks the synthetic SVG imagery, which is text', () => {
    assert.match(ignore, /^!fixtures\/media\/\*\.svg$/m);
  });

  it('refuses exported portfolios, which may hold someone’s real details', () => {
    assert.match(ignore, /^\*-portfolio\.html$/m);
    assert.match(ignore, /^\*-portfolio\.json$/m);
  });
});
