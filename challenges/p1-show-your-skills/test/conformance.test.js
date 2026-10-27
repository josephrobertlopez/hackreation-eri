/*
 * One test per acceptance row in spec/acceptance.md that a machine can decide.
 * Test names start with the row ID, so coverage is countable:
 *
 *   node --test test/*.test.js 2>&1 | grep -o 'P1-[A-Z]*[0-9]*' | sort -u
 *
 * Rows marked `human` in the spec are NOT here. A row with no test here and no
 * protocol there is uncovered, and the README says which those are.
 *
 * The journey below is ERI's own suggested demo (§6): a job seeker shows that
 * they can organize supplies, greet customers and follow a checklist, and an
 * employer opens the result.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  emptyPortfolio, setProfile, addSkill, addStatement, addExample, mvpStatus,
  nonTextExampleCount, previewShape, defaultShareSelection, fullShareSelection,
  buildShare, toShareHtml, toShareJson, toDataUrl, encodeShareLink, decodeShareLink,
  textAlternativeOf, PROFILE_FIELDS, EXAMPLE_KINDS, PortfolioError
} from '../web/portfolio.js';
import { renderPreview, renderShareChecklist, renderStarterButtons } from '../web/render.js';
import { SKILLS, findSkill } from '../fixtures/skills.js';
import { WORK_EXAMPLES, examplesForSkill, findWorkExample, toExampleInput } from '../fixtures/work-examples.js';
import { INTEREST_OPTIONS, ACTIVITY_OPTIONS } from '../fixtures/profile-options.js';
import { MEDIA } from '../fixtures/media.js';
import { readProjectFile, visibleText, openingTags, attr, stripJsComments } from './helpers/markup.js';

const mediaOpts = { lookupMedia: (id) => MEDIA[id] };
const DEMO_SKILLS = ['organize-supplies', 'greet-customers', 'follow-a-checklist'];

/** The whole ERI demo, built through the public API exactly as the UI does. */
function buildDemoPortfolio({ typing = true } = {}) {
  let p = emptyPortfolio();
  if (typing) {
    p = setProfile(p, { displayName: 'Jamie R.' });
  }
  // No typing anywhere below: list picks, starter sentences, sample examples.
  p = setProfile(p, { interests: [INTEREST_OPTIONS[0]], activities: [ACTIVITY_OPTIONS[1]] });
  for (const id of DEMO_SKILLS) {
    const skill = findSkill(id);
    p = addSkill(p, { id: skill.id, label: skill.label, source: 'list', plain: skill.plain });
    p = addStatement(p, skill.id, skill.starters[0]);
    // Up to two per skill, so the demo carries a picture AND the audio
    // stand-in — ERI §8 wants a non-text method, and a transcript proves the
    // audio path is complete rather than merely declared.
    for (const sample of examplesForSkill(id).slice(0, 2)) {
      p = addExample(p, toExampleInput(sample, id));
    }
  }
  return p;
}

const DEMO = buildDemoPortfolio();

describe('ERI §4 core features', () => {
  it('P1-F1 a profile holds a display name, interests and preferred work activities', () => {
    const p = setProfile(emptyPortfolio(), {
      displayName: 'Jamie R.', interests: ['Animals'], activities: ['Mornings']
    });
    assert.equal(p.profile.displayName, 'Jamie R.');
    assert.deepEqual(p.profile.interests, ['Animals']);
    assert.deepEqual(p.profile.activities, ['Mornings']);
    assert.deepEqual(PROFILE_FIELDS, ['displayName', 'interests', 'activities']);
  });

  it('P1-F2 skills come from a list OR from the person’s own words', () => {
    assert.ok(SKILLS.length >= 12, 'the list needs enough in it to pick from');
    let p = addSkill(emptyPortfolio(), { id: 'greet-customers', label: 'Greet customers', source: 'list' });
    p = addSkill(p, { label: 'Walk the dogs at the shelter', source: 'custom' });
    assert.deepEqual(p.skills.map((s) => s.source), ['list', 'custom']);
  });

  it('P1-F3 an example can be a photo, a short video, audio or something written', () => {
    const kinds = new Set(WORK_EXAMPLES.map((e) => e.kind));
    assert.deepEqual([...EXAMPLE_KINDS].sort(), [...kinds].sort());
    let p = addSkill(emptyPortfolio(), { id: 'stock', label: 'Stock shelves', source: 'list' });
    for (const kind of EXAMPLE_KINDS) {
      const sample = WORK_EXAMPLES.find((e) => e.kind === kind);
      p = addExample(p, { ...toExampleInput(sample, 'stock'), id: 'one-' + kind });
    }
    assert.equal(p.examples.length, 4);
  });

  it('P1-F4 the "I am good at…" prompts are offered as sentences, not a blank box', () => {
    for (const id of DEMO_SKILLS) {
      const starters = findSkill(id).starters;
      assert.ok(starters.some((s) => s.startsWith('I am good at')));
      assert.ok(starters.some((s) => s.startsWith('Here is something I can do')));
      const html = renderStarterButtons(findSkill(id), starters);
      assert.match(html, /data-action="add-statement"/);
    }
    assert.ok(DEMO.skills.every((s) => s.statements.length >= 1));
  });

  it('P1-F5 the preview is the employer-facing page, skills first', () => {
    const html = renderPreview(previewShape(DEMO), mediaOpts);
    const headings = [...html.matchAll(/<h2>([^<]+)<\/h2>/g)].map((m) => m[1]);
    assert.equal(headings[0], 'My skills');
    for (const id of DEMO_SKILLS) assert.ok(headings.includes(findSkill(id).label));
  });

  it('P1-F6 sharing produces a downloadable file, and a link that survives a reload', () => {
    const share = buildShare(DEMO, fullShareSelection(DEMO));
    const html = toShareHtml(share, mediaOpts);
    assert.match(toDataUrl(html, 'text/html'), /^data:text\/html/);
    const back = decodeShareLink('#' + encodeShareLink(share));
    assert.equal(back.skills.length, share.skills.length);
    const app = stripJsComments(readProjectFile('web/app.js'));
    assert.doesNotMatch(app, /createObjectURL/);
    assert.match(app, /download="/);
  });
});

describe('ERI §6 minimum viable product', () => {
  it('P1-M1 a user can enter basic profile information', () => {
    assert.equal(mvpStatus(DEMO).profile, true);
  });

  it('P1-M2 a user can select or enter three skills', () => {
    assert.equal(DEMO.skills.length, 3);
    assert.equal(mvpStatus(DEMO).threeSkills, true);
  });

  it('P1-M3 at least one example of a skill can be added', () => {
    assert.ok(DEMO.examples.length >= 1);
    assert.equal(mvpStatus(DEMO).oneExample, true);
  });

  it('P1-M4 the information displays as a simple portfolio', () => {
    const html = renderPreview(previewShape(DEMO), mediaOpts);
    const text = visibleText(html);
    assert.match(text, /Jamie R\. - what I can do/);
    for (const id of DEMO_SKILLS) assert.ok(text.includes(findSkill(id).label));
    assert.equal(mvpStatus(DEMO).canPreview, true);
  });

  it('P1-M5 there is a way to export the portfolio', () => {
    const share = buildShare(DEMO, fullShareSelection(DEMO));
    const html = toShareHtml(share, mediaOpts);
    const json = toShareJson(share);
    assert.match(html, /^<!doctype html>/);
    assert.equal(JSON.parse(json).skills.length, 3);
    assert.equal(mvpStatus(DEMO).canShare, true);
  });
});

describe('ERI §7 accessibility — the part a test can decide', () => {
  it('P1-A1 every control the app renders is a native labelled element', () => {
    // Full check lives in test/accessibility.test.js across every rendered chunk.
    const html = renderShareChecklist(DEMO, defaultShareSelection());
    for (const raw of openingTags(html, 'input')) {
      assert.ok(attr(raw, 'id'), 'unlabelled input: ' + raw);
      assert.match(html, new RegExp('<label[^>]*for="' + attr(raw, 'id') + '"'));
    }
  });

  it('P1-A2 instructions are short sentences in the second person', () => {
    const text = visibleText(readProjectFile('web/index.html'));
    assert.match(text, /Pick three or more/);
    assert.match(text, /There is no timer/);
  });

  it('P1-A3 a whole portfolio can be built with no typing but the name', () => {
    const noTyping = buildDemoPortfolio({ typing: false });
    const status = mvpStatus(noTyping);
    assert.equal(status.threeSkills, true, 'skills were picked, not typed');
    assert.equal(status.oneExample, true, 'examples were picked, not typed');
    assert.ok(noTyping.skills.every((s) => s.statements.length >= 1), 'sentences were picked, not typed');
    assert.equal(status.profile, false, 'only the display name still needs a name entered');
  });

  it('P1-A4 every image, audio and video carries its text alternative', () => {
    for (const example of DEMO.examples) {
      assert.ok(textAlternativeOf(example).length > 10, example.id);
    }
    const html = toShareHtml(buildShare(DEMO, fullShareSelection(DEMO)), mediaOpts);
    assert.match(html, /The picture shows: /);
    assert.match(html, /Transcript: /);
  });

  it('P1-A5 no step imposes a time limit', () => {
    for (const file of ['web/app.js', 'web/render.js', 'web/portfolio.js']) {
      const source = stripJsComments(readProjectFile(file));
      assert.doesNotMatch(source, /setTimeout|setInterval|Date\.now/, file);
    }
    assert.match(visibleText(readProjectFile('web/index.html')), /There is no timer/);
  });

  it('P1-A6 the person chooses what a share contains', () => {
    assert.equal(buildShare.length, 2, 'the selection is a required argument');
    assert.throws(() => buildShare(DEMO), PortfolioError);
    const one = buildShare(DEMO, { ...defaultShareSelection(), skillIds: ['greet-customers'] });
    assert.equal(one.skills.length, 1);
    assert.equal(one.displayName, '');
    assert.equal(one.omitted.skills, 2);
  });
});

describe('ERI §8 success criteria — the part a test can decide', () => {
  it('P1-S3 the exported file names at least three skills in its own headings', () => {
    const html = toShareHtml(buildShare(DEMO, fullShareSelection(DEMO)), mediaOpts);
    const headings = [...html.matchAll(/<h2>([^<]+)<\/h2>/g)].map((m) => m[1]);
    const skillHeadings = headings.filter((h) => h !== 'My skills');
    assert.ok(skillHeadings.length >= 3, 'only ' + skillHeadings.length + ' skill headings');
  });

  it('P1-S4 at least one non-text method of demonstrating a skill is supported', () => {
    assert.ok(nonTextExampleCount(DEMO) >= 1);
    const html = toShareHtml(buildShare(DEMO, fullShareSelection(DEMO)), mediaOpts);
    assert.match(html, /<svg /);
  });
});

describe('ERI §9 out of scope', () => {
  const sources = ['web/app.js', 'web/render.js', 'web/portfolio.js', 'web/index.html']
    .map((f) => [f, stripJsComments(readProjectFile(f))]);

  const rows = [
    ['P1-X1', 'no commercial job board integration', /indeed|linkedin|ziprecruiter|glassdoor/i],
    ['P1-X2', 'no automated hiring or applicant scoring', /applicantScore|hiringDecision|rankCandidates/i],
    ['P1-X3', 'no employer account management', /\b(password|signup|sign ?in|employer account)\b/i],
    ['P1-X4', 'no AI-generated assessment of suitability', /openai|anthropic|\bllm\b|completions/i],
    ['P1-X5', 'no identity verification or production hosting', /\bssn\b|verify identity|api\.|server\.listen/i]
  ];

  for (const [id, label, pattern] of rows) {
    it(id + ' ' + label, () => {
      for (const [file, source] of sources) assert.doesNotMatch(source, pattern, file);
    });
  }

  it('P1-X5 nothing is hosted: the share is a file the person holds', () => {
    const share = buildShare(DEMO, fullShareSelection(DEMO));
    const link = encodeShareLink(share);
    assert.doesNotMatch(link, /https?:/, 'the link carries data, not a server address');
    assert.ok(decodeShareLink(link), 'and it decodes with no server involved');
  });
});

describe('ERI §10 privacy, as a refusal', () => {
  it('P1-D1 there is no field, prompt or column for a disability or diagnosis', () => {
    for (const field of ['disability', 'diagnosis', 'disabilityType', 'medicalHistory', 'accommodations']) {
      assert.throws(() => setProfile(emptyPortfolio(), { [field]: 'x' }), PortfolioError, field);
    }
    const html = readProjectFile('web/index.html');
    for (const raw of openingTags(html, 'input').concat(openingTags(html, 'textarea'))) {
      assert.doesNotMatch(attr(raw, 'id') + ' ' + attr(raw, 'placeholder'), /disab|diagnos|medical/i, raw);
    }
  });

  it('P1-D2 sample media only: the imagery is synthetic and says so', () => {
    for (const example of WORK_EXAMPLES) {
      if (example.kind === 'audio' || example.kind === 'video') {
        assert.equal(example.sampleStandIn, true, example.id);
      }
    }
    assert.ok(findWorkExample('ex-greeting-audio').transcript.length > 20);
  });
});
