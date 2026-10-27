/*
 * Sharing is the part most likely to leak something the person did not choose,
 * and the part most likely to ship a link that dies. Both are tested here.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  defaultShareSelection, fullShareSelection, buildShare, countSelected,
  toShareHtml, toShareJson, encodeShareLink, decodeShareLink, toDataUrl,
  previewShape, PortfolioError, PORTFOLIO_FOOTER_TEXT
} from '../web/portfolio.js';
import { MEDIA } from '../fixtures/media.js';
import { samplePortfolio } from '../fixtures/sample-portfolio.js';

const mediaOpts = { lookupMedia: (id) => MEDIA[id] };

describe('the share selection (P1-A6, P1-F6)', () => {
  it('starts with NOTHING selected', () => {
    const selection = defaultShareSelection();
    assert.equal(countSelected(selection), 0);
    assert.deepEqual(selection.skillIds, []);
    assert.deepEqual(selection.exampleIds, []);
    assert.equal(selection.displayName, false);
  });

  it('refuses to build a share with no selection argument at all', () => {
    // The defect this blocks: buildShare(p) quietly meaning "share everything".
    const p = samplePortfolio();
    assert.throws(() => buildShare(p), PortfolioError);
    assert.throws(() => buildShare(p, null), /Choose what to include/);
  });

  it('refuses an empty selection with a plain-language reason', () => {
    assert.throws(() => buildShare(samplePortfolio(), defaultShareSelection()), /Nothing is ticked yet/);
  });

  it('includes exactly the ticked skills and nothing else', () => {
    const p = samplePortfolio();
    const share = buildShare(p, {
      ...defaultShareSelection(),
      displayName: true,
      skillIds: ['greet-customers']
    });
    assert.deepEqual(share.skills.map((s) => s.id), ['greet-customers']);
    assert.equal(share.interests.length, 0);
    assert.equal(share.activities.length, 0);
    assert.equal(share.omitted.skills, 2);
  });

  it('leaves the person’s own sentences out unless they tick them', () => {
    const p = samplePortfolio();
    const without = buildShare(p, { ...defaultShareSelection(), skillIds: ['greet-customers'] });
    assert.deepEqual(without.skills[0].statements, []);
    const withThem = buildShare(p, {
      ...defaultShareSelection(), statements: true, skillIds: ['greet-customers']
    });
    assert.ok(withThem.skills[0].statements.length >= 1);
  });

  it('does not smuggle an example in under a skill that was not shared', () => {
    const p = samplePortfolio();
    const share = buildShare(p, {
      ...defaultShareSelection(),
      skillIds: ['greet-customers'],
      exampleIds: p.examples.map((e) => e.id) // every example, including other skills'
    });
    assert.equal(share.skills.length, 1);
    for (const example of share.skills[0].examples) {
      assert.equal(example.skillId, 'greet-customers');
    }
    assert.ok(share.omitted.orphanExamples > 0, 'orphans are reported, not silently dropped');
  });

  it('"tick everything" is a real everything, but only when asked for', () => {
    const p = samplePortfolio();
    const share = buildShare(p, fullShareSelection(p));
    assert.equal(share.skills.length, p.skills.length);
    assert.equal(share.omitted.skills, 0);
    assert.equal(share.omitted.examples, 0);
    assert.equal(share.displayName, 'Jamie R.');
  });

  it('a preview is not a share artifact', () => {
    assert.throws(() => toShareHtml(previewShape(samplePortfolio())), /not a share/);
  });
});

describe('the exported file (P1-M5, P1-F6)', () => {
  const p = samplePortfolio();
  const share = buildShare(p, fullShareSelection(p));
  const html = toShareHtml(share, mediaOpts);

  it('is one standalone HTML document with no external resource and no script', () => {
    assert.match(html, /^<!doctype html>/);
    assert.match(html, /<html lang="en">/);
    assert.doesNotMatch(html, /<script/i);
    assert.doesNotMatch(html, /src\s*=/i);
    assert.doesNotMatch(html, /<link/i);
    assert.doesNotMatch(html, /https?:\/\/(?!www\.w3\.org)/i); // only the SVG namespace
  });

  it('names at least three skills an employer can read (P1-S3 machine half)', () => {
    for (const label of ['Organize supplies', 'Greet customers', 'Follow a checklist']) {
      assert.ok(html.includes(label), 'missing skill heading: ' + label);
    }
  });

  it('inlines the sample imagery, with its title and description', () => {
    assert.match(html, /<svg /);
    assert.match(html, /<title[^>]*>A supply shelf after it was organized<\/title>/);
    assert.match(html, /<desc[^>]*>/);
  });

  it('carries the text alternative beside every picture and the transcript for audio', () => {
    assert.match(html, /The picture shows: A supply shelf with boxes in a row/);
    assert.match(html, /Transcript: Good morning, welcome in/);
  });

  it('labels the sample stand-ins instead of passing them off as recordings', () => {
    assert.match(html, /Sample stand-in/);
  });

  it('says in the file itself that it holds no score and no health information', () => {
    assert.ok(html.includes(PORTFOLIO_FOOTER_TEXT));
    assert.match(html, /no score, no rating and no assessment/);
  });

  it('escapes anything that could break out of the markup', () => {
    const nasty = buildShare(
      { ...p, profile: { ...p.profile, displayName: '<script>alert(1)</script>' } },
      fullShareSelection(p)
    );
    const out = toShareHtml(nasty, mediaOpts);
    assert.doesNotMatch(out, /<script>alert/);
    assert.match(out, /&lt;script&gt;/);
  });

  it('is downloadable with no blob URL and no network (P1-X5)', () => {
    const url = toDataUrl(html, 'text/html');
    assert.match(url, /^data:text\/html;charset=utf-8,/);
    assert.ok(decodeURIComponent(url.split(',')[1]).startsWith('<!doctype html>'));
  });

  it('also exports as data, with no field about anybody’s health', () => {
    const json = toShareJson(share);
    const parsed = JSON.parse(json);
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
    walk(parsed);
    for (const key of keys) {
      assert.doesNotMatch(key, /disab|diagnos|medical|impair|accommodat/i, 'leaked field: ' + key);
      assert.doesNotMatch(key, /score|rank|rating|grade|assess|suitab|percent/i, 'scoring field: ' + key);
    }
  });
});

describe('the optional link survives a reload (the createObjectURL trap)', () => {
  const p = samplePortfolio();
  const share = buildShare(p, fullShareSelection(p));

  it('round-trips the whole share through the URL fragment', () => {
    const fragment = encodeShareLink(share);
    assert.match(fragment, /^p=[A-Za-z0-9\-_]+$/);
    const back = decodeShareLink('#' + fragment);
    assert.equal(back.displayName, share.displayName);
    assert.equal(back.skills.length, share.skills.length);
    assert.deepEqual(back.skills.map((s) => s.label), share.skills.map((s) => s.label));
  });

  it('decodes from a whole URL, not just the bare fragment', () => {
    const url = 'http://localhost:8000/web/index.html#' + encodeShareLink(share);
    const back = decodeShareLink(url);
    assert.equal(back.skills.length, share.skills.length);
  });

  it('the link holds the data itself, so there is no handle to go stale', () => {
    // A blob: or object URL is valid only inside the tab that minted it. This
    // one is text, so a second process decodes it with no shared state at all.
    const fragment = encodeShareLink(share);
    assert.doesNotMatch(fragment, /blob:/);
    const rebuilt = JSON.parse(JSON.stringify(decodeShareLink(fragment)));
    assert.deepEqual(rebuilt, JSON.parse(toShareJson(share)));
  });

  it('survives non-ASCII in a display name', () => {
    const accented = { ...share, displayName: 'José Álvarez — 山田' };
    assert.equal(decodeShareLink(encodeShareLink(accented)).displayName, accented.displayName);
  });

  it('returns null for rubbish instead of throwing at the user', () => {
    assert.equal(decodeShareLink(''), null);
    assert.equal(decodeShareLink('#nothing-here'), null);
    assert.equal(decodeShareLink('#p=!!!!'), null);
    assert.equal(decodeShareLink('#p=' + Buffer.from('{"not":"a share"}').toString('base64url')), null);
  });
});
