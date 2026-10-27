/*
 * Accessibility checks that a test CAN decide: labels, focusability, heading
 * order, text alternatives, sentence length, and the absence of the patterns
 * that break keyboard and screen-reader use (positive tabindex, div-as-button,
 * inline handlers, meta refresh).
 *
 * What is NOT here, because no headless check can honestly decide it: whether a
 * screen reader actually reads this well, whether the language is simple enough
 * for the people ERI serves, and whether the focus ring is visible on a real
 * display. spec/acceptance.md marks those `human` and gives a two-minute
 * protocol each. A green run here is necessary and not sufficient.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  readProjectFile, openingTags, attr, visibleText, textBlocks, sentences, wordCount,
  formControls, labelTargets, stripJsComments
} from './helpers/markup.js';
import {
  renderChipGroup, renderSkillPicker, renderChosenSkills, renderShareChecklist,
  renderPreview, renderProgress, renderStarterButtons, renderExampleOptions
} from '../web/render.js';
import { defaultShareSelection, previewShape, mvpStatus, PROTECTED_FIELD_PATTERN } from '../web/portfolio.js';
import { skillsByGroup, findSkill } from '../fixtures/skills.js';
import { examplesForSkill } from '../fixtures/work-examples.js';
import { INTEREST_OPTIONS } from '../fixtures/profile-options.js';
import { MEDIA } from '../fixtures/media.js';
import { samplePortfolio } from '../fixtures/sample-portfolio.js';

const INDEX = readProjectFile('web/index.html');
/**
 * Comments stripped. An HTML comment explaining why a region has no visible
 * <h2> contains the characters "<h2>", and a structural scan that counts its
 * own documentation as markup is a broken instrument. Third time this shape
 * bit during this build; see stripJsComments for the JS twin.
 */
const INDEX_STRUCTURE = INDEX.replace(/<!--[\s\S]*?-->/g, ' ');
const SAMPLE = samplePortfolio();

/** Every chunk of markup this app can put on the screen. */
const RENDERED = [
  ['chip group', renderChipGroup({ legend: 'What are you interested in?', name: 'interest', options: INTEREST_OPTIONS })],
  ['skill picker', renderSkillPicker(skillsByGroup(), ['greet-customers'])],
  ['chosen skills', renderChosenSkills(SAMPLE, {
    startersFor: (id) => (findSkill(id) ? findSkill(id).starters : []),
    sampleExamplesFor: (id) => examplesForSkill(id)
  })],
  ['share checklist', renderShareChecklist(SAMPLE, defaultShareSelection())],
  ['preview', renderPreview(previewShape(SAMPLE), { lookupMedia: (id) => MEDIA[id] })],
  ['progress', renderProgress(mvpStatus(SAMPLE))],
  ['starters', renderStarterButtons(SAMPLE.skills[0], findSkill('organize-supplies').starters)],
  ['example options', renderExampleOptions('greet-customers', examplesForSkill('greet-customers'))]
];

const ALL_MARKUP = [['index.html', INDEX], ...RENDERED];

describe('page structure (P1-A1)', () => {
  it('declares its language', () => {
    assert.match(INDEX, /<html lang="en">/);
  });

  it('has exactly one h1 and never skips a heading level', () => {
    const levels = (INDEX_STRUCTURE.match(/<h([1-6])\b/g) || []).map((h) => Number(h.slice(2)));
    assert.equal(levels.filter((l) => l === 1).length, 1);
    let previous = 0;
    for (const level of levels) {
      assert.ok(level <= previous + 1, 'heading jumps from h' + previous + ' to h' + level);
      previous = level;
    }
  });

  it('starts with a skip link that points at something real', () => {
    const skip = openingTags(INDEX, 'a').find((raw) => /class="skip"/.test(raw));
    assert.ok(skip, 'no skip link');
    const target = attr(skip, 'href').replace('#', '');
    assert.match(INDEX, new RegExp('id="' + target + '"'));
  });

  it('every section is named — by its own heading, or by an aria-label', () => {
    for (const raw of openingTags(INDEX, 'section').concat(openingTags(INDEX, 'aside'))) {
      const labelledBy = attr(raw, 'aria-labelledby');
      const label = attr(raw, 'aria-label');
      assert.ok(labelledBy || label, 'a region has no accessible name: ' + raw);
      if (labelledBy) assert.match(INDEX, new RegExp('id="' + labelledBy + '"'));
    }
  });

  it('announces what changed, without stealing the screen reader (P1-A1)', () => {
    assert.match(INDEX, /role="status"[^>]*aria-live="polite"|aria-live="polite"[^>]*role="status"/);
    assert.match(INDEX, /id="form-error"[^>]*role="alert"/);
  });

  it('tells someone with JavaScript off what is going on', () => {
    assert.match(INDEX, /<noscript>/);
  });
});

describe('every control is labelled (P1-A1, P1-A4)', () => {
  for (const [name, markup] of ALL_MARKUP) {
    it(name + ': every input, textarea and select has an id and a label for it', () => {
      const controls = formControls(markup);
      const labels = labelTargets(markup);
      assert.ok(controls.length > 0 || name === 'progress' || name === 'starters' || name === 'preview');
      for (const control of controls) {
        assert.ok(control.id, name + ': a ' + control.tag + ' has no id: ' + control.raw);
        const labelled =
          labels.includes(control.id) ||
          attr(control.raw, 'aria-label') ||
          attr(control.raw, 'aria-labelledby');
        assert.ok(labelled, name + ': nothing labels #' + control.id);
      }
    });

    it(name + ': grouped choices sit in a fieldset with a legend', () => {
      const fieldsets = (markup.match(/<fieldset/g) || []).length;
      const legends = (markup.match(/<legend/g) || []).length;
      assert.equal(fieldsets, legends, name + ': ' + fieldsets + ' fieldsets but ' + legends + ' legends');
    });
  }
});

describe('keyboard reach (P1-A1)', () => {
  for (const [name, markup] of ALL_MARKUP) {
    it(name + ': no inline event handler, so nothing is mouse-only', () => {
      assert.doesNotMatch(markup, /\son(click|mouse\w+|key\w+|focus|blur)\s*=/i);
    });

    it(name + ': no positive tabindex, so the tab order stays the document order', () => {
      for (const match of markup.match(/tabindex\s*=\s*"([^"]*)"/gi) || []) {
        const value = Number(match.match(/"([^"]*)"/)[1]);
        assert.ok(value <= 0, name + ': positive tabindex found: ' + match);
      }
    });

    it(name + ': nothing pretends to be a button', () => {
      assert.doesNotMatch(markup, /<(div|span|a)\b[^>]*role\s*=\s*"button"/i);
    });

    it(name + ': every button says it is a button and does not submit by surprise', () => {
      for (const raw of openingTags(markup, 'button')) {
        assert.equal(attr(raw, 'type'), 'button', name + ': button without type="button": ' + raw);
      }
    });

    it(name + ': nothing grabs focus or reloads on its own', () => {
      assert.doesNotMatch(markup, /autofocus/i);
      assert.doesNotMatch(markup, /http-equiv\s*=\s*"refresh"/i);
    });
  }
});

describe('no time limits (P1-A5)', () => {
  it('the page owns no clock: no timer, no countdown, no auto-advance', () => {
    for (const file of ['web/app.js', 'web/render.js', 'web/portfolio.js', 'web/index.html']) {
      // Comments stripped: the files say in prose that they own no timer, and a
      // scan that trips over its own documentation is a broken instrument.
      const source = stripJsComments(readProjectFile(file));
      assert.doesNotMatch(source, /setTimeout|setInterval|requestAnimationFrame|new Date\(\)|Date\.now/, file);
    }
  });

  it('nothing in the styles animates or transitions under the reader', () => {
    const css = readProjectFile('web/style.css');
    assert.doesNotMatch(css, /@keyframes|animation\s*:|transition\s*:/);
  });
});

describe('text alternatives travel with their media (P1-A4, P1-F3)', () => {
  it('the preview shows the picture AND what the picture shows', () => {
    const html = renderPreview(previewShape(SAMPLE), { lookupMedia: (id) => MEDIA[id] });
    assert.match(html, /<svg /);
    assert.match(html, /<title[^>]*>/);
    assert.match(html, /<desc[^>]*>/);
    assert.match(html, /The picture shows: /);
    assert.match(html, /Transcript: /);
  });

  it('the example chooser shows the alternative text before anything is added', () => {
    const html = renderExampleOptions('greet-customers', examplesForSkill('greet-customers'));
    assert.match(html, /class="alt-text"/);
    assert.match(html, /Good morning, welcome in/);
  });

  it('there is no bare <img> anywhere that could ship without alt text', () => {
    for (const [name, markup] of ALL_MARKUP) {
      for (const raw of openingTags(markup, 'img')) {
        assert.ok(attr(raw, 'alt'), name + ': <img> with no alt: ' + raw);
      }
    }
  });
});

describe('plain language (P1-A2) — the measurable half', () => {
  it('no sentence on the page runs past 25 words', () => {
    const offenders = textBlocks(INDEX)
      .flatMap((block) => sentences(block))
      .filter((s) => wordCount(s) > 25);
    assert.deepEqual(offenders, [], 'long sentences: ' + JSON.stringify(offenders));
  });

  it('and the same holds for every sentence the app renders at runtime', () => {
    const offenders = RENDERED.flatMap(([name, markup]) =>
      textBlocks(markup)
        .flatMap((block) => sentences(block))
        .filter((s) => wordCount(s) > 25)
        .map((s) => name + ': ' + s)
    );
    assert.deepEqual(offenders, [], 'long sentences: ' + JSON.stringify(offenders));
  });

  it('the page uses no jargon a first-time user has to decode', () => {
    const text = visibleText(INDEX).toLowerCase();
    for (const word of [
      'metadata', 'serialize', 'json schema', 'authenticate', 'credential', 'repository',
      'deploy', 'async', 'validate your input', 'submit the form payload'
    ]) {
      assert.ok(!text.includes(word), 'jargon on the page: ' + word);
    }
  });

  it('the instructions say what to do, in the second person', () => {
    const text = visibleText(INDEX);
    assert.match(text, /Pick three or more/);
    assert.match(text, /Use any name you like/);
  });
});

describe('nothing asks about a disability or a diagnosis (ERI §10)', () => {
  it('no label, legend, placeholder or field name anywhere reads as a health question', () => {
    for (const [name, markup] of ALL_MARKUP) {
      const labelTexts = [...markup.matchAll(/<label[^>]*>([\s\S]*?)<\/label>/g)].map((m) => visibleText(m[1]));
      const legendTexts = [...markup.matchAll(/<legend[^>]*>([\s\S]*?)<\/legend>/g)].map((m) => visibleText(m[1]));
      const placeholders = openingTags(markup, 'input')
        .concat(openingTags(markup, 'textarea'))
        .map((raw) => attr(raw, 'placeholder'));
      const fieldNames = formControls(markup).flatMap((c) => [c.id, c.name]);
      for (const text of [...labelTexts, ...legendTexts, ...placeholders, ...fieldNames]) {
        assert.doesNotMatch(String(text), PROTECTED_FIELD_PATTERN, name + ': asks for protected detail: ' + text);
      }
    }
  });

  it('the page says out loud that it never asks', () => {
    assert.match(visibleText(INDEX), /We never ask about health, disability or a diagnosis/);
  });
});

describe('the share panel starts empty (P1-A6)', () => {
  it('renders every box unticked for a fresh selection', () => {
    const html = renderShareChecklist(SAMPLE, defaultShareSelection());
    const boxes = openingTags(html, 'input');
    assert.ok(boxes.length >= 4, 'expected a row per shareable thing');
    for (const raw of boxes) assert.equal(attr(raw, 'checked'), '', 'a box is pre-ticked: ' + raw);
  });

  it('lists the skills and examples separately, so either can be held back', () => {
    const html = renderShareChecklist(SAMPLE, defaultShareSelection());
    assert.equal((html.match(/name="share-skill"/g) || []).length, SAMPLE.skills.length);
    assert.equal((html.match(/name="share-example"/g) || []).length, SAMPLE.examples.length);
  });
});

describe('no score, no rank, no assessment (ERI §9)', () => {
  it('the progress list is words, not a number out of five', () => {
    const html = renderProgress(mvpStatus(SAMPLE));
    assert.doesNotMatch(visibleText(html), /\d/, 'a number appeared in the progress list');
    assert.match(html, /Done/);
  });

  it('nothing rendered anywhere shows a score, a percentage or a star rating', () => {
    for (const [name, markup] of RENDERED) {
      assert.doesNotMatch(visibleText(markup), /\b\d+\s*(%|\/\s*\d+|stars?|points?|out of)\b/i, name);
      assert.doesNotMatch(markup, /class="(score|rating|rank|match)"/i, name);
    }
  });
});
