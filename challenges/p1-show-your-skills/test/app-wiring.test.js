/*
 * The failures a browser finds and a unit test does not: a typo'd element id, a
 * button whose action nothing handles, an import path that does not exist.
 *
 * `test/browser-smoke.sh` catches these for real in headless Chromium. This
 * file catches them in `node --test`, which every team can run, with no browser
 * and no dependency. Both exist on purpose: the shell script needs a browser
 * installed, and a check nobody can run is not a check.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { readProjectFile, stripJsComments, ROOT } from './helpers/markup.js';
import { renderChosenSkills } from '../web/render.js';
import { findSkill } from '../fixtures/skills.js';
import { examplesForSkill } from '../fixtures/work-examples.js';
import { samplePortfolio } from '../fixtures/sample-portfolio.js';

const APP = stripJsComments(readProjectFile('web/app.js'));
const INDEX = readProjectFile('web/index.html');
const RENDER = stripJsComments(readProjectFile('web/render.js'));

describe('every element the app reaches for exists', () => {
  const wanted = [...APP.matchAll(/\$\('([^']+)'\)/g)].map((m) => m[1]);
  const staticIds = new Set([...INDEX.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  const createdIds = new Set([...APP.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));

  it('finds a non-trivial number of lookups to check', () => {
    assert.ok(wanted.length >= 15, 'only found ' + wanted.length + ' element lookups');
  });

  for (const id of [...new Set(wanted)]) {
    it('#' + id + ' is in index.html, or the app creates it', () => {
      assert.ok(
        staticIds.has(id) || createdIds.has(id),
        '#' + id + ' is looked up but never exists'
      );
    });
  }

  it('every id the app renders into the share panel is unique in the page', () => {
    const all = [...INDEX.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(all).size, all.length, 'duplicate id in index.html');
  });
});

describe('every button action is handled, and every handler has a button', () => {
  const emitted = new Set([...RENDER.matchAll(/data-action="([^"]+)"/g)].map((m) => m[1]));
  const handled = new Set([...APP.matchAll(/action === '([^']+)'/g)].map((m) => m[1]));

  it('render.js emits the actions we expect', () => {
    assert.ok(emitted.size >= 6, 'only ' + emitted.size + ' actions found: ' + [...emitted]);
  });

  for (const action of emitted) {
    it('"' + action + '" has a handler in app.js', () => {
      assert.ok(handled.has(action), action + ' is rendered but never handled');
    });
  }

  for (const action of handled) {
    it('"' + action + '" is actually reachable from a rendered button', () => {
      assert.ok(emitted.has(action), action + ' is handled but nothing renders it');
    });
  }

  it('every data-action button also carries the data it needs', () => {
    const html = renderChosenSkills(samplePortfolio(), {
      startersFor: (id) => (findSkill(id) ? findSkill(id).starters : []),
      sampleExamplesFor: (id) => examplesForSkill(id)
    });
    for (const match of html.matchAll(/<button[^>]*data-action="([^"]+)"[^>]*>/g)) {
      const [raw, action] = match;
      if (action.endsWith('statement') || action.endsWith('skill') || action.includes('example')) {
        const hasTarget = /data-(skill|example|text|input)="/.test(raw);
        assert.ok(hasTarget, action + ' button carries no target: ' + raw);
      }
    }
  });

  it('the listener for typed input reads an element the same markup created', () => {
    const html = renderChosenSkills(samplePortfolio(), {
      startersFor: () => [],
      sampleExamplesFor: () => []
    });
    const inputRefs = [...html.matchAll(/data-input="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(inputRefs.length >= 2);
    for (const id of inputRefs) {
      assert.match(html, new RegExp('id="' + id + '"'), 'data-input points at missing #' + id);
    }
  });
});

describe('every import resolves on disk', () => {
  const files = ['web/app.js', 'web/render.js', 'web/portfolio.js',
    'fixtures/skills.js', 'fixtures/work-examples.js', 'fixtures/media.js',
    'fixtures/profile-options.js', 'fixtures/sample-portfolio.js'];

  for (const file of files) {
    it(file + ': every module it imports is there', () => {
      const source = stripJsComments(readProjectFile(file));
      const specifiers = [...source.matchAll(/\bfrom\s+'([^']+)'/g)].map((m) => m[1]);
      for (const specifier of specifiers) {
        const path = resolve(join(ROOT, dirname(file)), specifier);
        assert.ok(existsSync(path), file + ' imports missing module ' + specifier);
      }
    });
  }
});
