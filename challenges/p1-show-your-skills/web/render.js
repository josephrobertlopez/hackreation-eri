/*
 * HTML builders for the app. Pure string functions: no DOM, no events, no
 * network — so `node --test` can assert on the markup every control is born
 * with, instead of hoping a browser was accessible.
 *
 * House rules every builder here obeys, and test/accessibility.test.js enforces:
 *  - Every input has an `id` and a `<label for="…">` (or sits inside a
 *    fieldset with a legend, for grouped choices). ERI §7.
 *  - Every control is a native <button>, <input>, <select> or <a>. No
 *    `div role="button"`, no `onclick=`, no positive `tabindex`. That is what
 *    makes keyboard navigation work without writing any key handling.
 *  - Every image carries its text alternative in the same block as the image.
 *  - Nothing renders a number about the person. ERI §9.
 */

import { escapeHtml, slugify, textAlternativeOf, portfolioSectionsHtml } from './portfolio.js';

const KIND_WORD = { photo: 'Picture', video: 'Video', audio: 'Audio', written: 'Written' };

/**
 * A tick-box group: interests, preferred work activities, anything choosable
 * without typing. ERI §7 "support alternatives to typed input".
 */
export function renderChipGroup({ legend, name, options, selected = [], hint = '' }) {
  const parts = ['<fieldset class="chips">', '<legend>' + escapeHtml(legend) + '</legend>'];
  if (hint) parts.push('<p class="hint">' + escapeHtml(hint) + '</p>');
  for (const option of options) {
    const id = name + '-' + slugify(option);
    const checked = selected.includes(option) ? ' checked' : '';
    parts.push(
      '<label class="chip" for="' + id + '">' +
        '<input type="checkbox" id="' + id + '" name="' + escapeHtml(name) + '" value="' +
        escapeHtml(option) + '"' + checked + '> ' +
        escapeHtml(option) +
        '</label>'
    );
  }
  parts.push('</fieldset>');
  return parts.join('\n');
}

/** ERI §4 "Select skills from a list or enter custom skills" — the list half. */
export function renderSkillPicker(groups, chosenIds = []) {
  const parts = [];
  for (const group of groups) {
    parts.push('<fieldset class="chips">');
    parts.push('<legend>' + escapeHtml(group.label) + '</legend>');
    for (const skill of group.skills) {
      const id = 'pick-' + skill.id;
      const already = chosenIds.includes(skill.id);
      parts.push(
        '<label class="chip" for="' + id + '">' +
          '<input type="checkbox" id="' + id + '" name="skill-pick" value="' + skill.id + '"' +
          (already ? ' checked disabled' : '') + '> ' +
          escapeHtml(skill.label) +
          (already ? ' <span class="added">(added)</span>' : '') +
          '</label>'
      );
    }
    parts.push('</fieldset>');
  }
  return parts.join('\n');
}

/** The "I am good at…" sentence buttons: say it without typing it. ERI §4, §7. */
export function renderStarterButtons(skill, starters = []) {
  if (!starters.length) return '';
  const parts = ['<p class="hint">Pick a sentence, or write your own below.</p>', '<ul class="starters">'];
  for (const sentence of starters) {
    parts.push(
      '<li><button type="button" data-action="add-statement" data-skill="' + escapeHtml(skill.id) +
        '" data-text="' + escapeHtml(sentence) + '">Use: ' + escapeHtml(sentence) + '</button></li>'
    );
  }
  parts.push('</ul>');
  return parts.join('\n');
}

/** Sample examples offered for one skill, each with its text alternative shown. */
export function renderExampleOptions(skillId, examples, usedIds = []) {
  if (!examples.length) {
    return '<p class="hint">No sample examples for this skill yet. Write your own below.</p>';
  }
  const parts = ['<fieldset class="chips">', '<legend>Sample examples you can add</legend>'];
  for (const example of examples) {
    const id = 'ex-' + skillId + '-' + example.id;
    const used = usedIds.includes(example.id + '--' + skillId);
    parts.push('<label class="chip chip-wide" for="' + id + '">');
    parts.push(
      '<input type="checkbox" id="' + id + '" name="example-pick-' + escapeHtml(skillId) +
        '" value="' + escapeHtml(example.id) + '"' + (used ? ' checked disabled' : '') + '> '
    );
    parts.push(
      '<span><strong>' + escapeHtml(example.title) + '</strong> ' +
        '<span class="kind">' + (KIND_WORD[example.kind] || 'Example') + '</span><br>' +
        '<span class="alt-text">' + escapeHtml(textAlternativeOf(example)) + '</span>' +
        (used ? ' <span class="added">(added)</span>' : '') +
        '</span>'
    );
    parts.push('</label>');
  }
  parts.push('</fieldset>');
  return parts.join('\n');
}

/** One block per chosen skill: its sentences, its examples, and a way to remove it. */
export function renderChosenSkills(portfolio, { startersFor, sampleExamplesFor }) {
  if (!portfolio.skills.length) {
    return '<p class="hint">No skills yet. Tick some above, or write your own.</p>';
  }
  const usedExampleIds = portfolio.examples.map((e) => e.id);
  const parts = [];
  for (const skill of portfolio.skills) {
    parts.push('<article class="skill-card">');
    parts.push('<h3>' + escapeHtml(skill.label) + '</h3>');
    if (skill.plain) parts.push('<p>' + escapeHtml(skill.plain) + '</p>');
    parts.push(
      '<button type="button" data-action="remove-skill" data-skill="' + escapeHtml(skill.id) +
        '">Take &ldquo;' + escapeHtml(skill.label) + '&rdquo; off my page</button>'
    );

    parts.push('<h4>What I can say about it</h4>');
    if (skill.statements.length) {
      parts.push('<ul class="statements">');
      for (const sentence of skill.statements) {
        parts.push(
          '<li>' + escapeHtml(sentence) +
            ' <button type="button" data-action="remove-statement" data-skill="' + escapeHtml(skill.id) +
            '" data-text="' + escapeHtml(sentence) + '">Remove this sentence</button></li>'
        );
      }
      parts.push('</ul>');
    }
    parts.push(renderStarterButtons(skill, startersFor(skill.id)));
    const sentenceId = 'sentence-' + skill.id;
    parts.push('<label for="' + sentenceId + '">Write your own sentence about ' + escapeHtml(skill.label) + '</label>');
    parts.push(
      '<input type="text" id="' + sentenceId + '" name="' + sentenceId + '" ' +
        'placeholder="I am good at&hellip;">'
    );
    parts.push(
      '<button type="button" data-action="add-typed-statement" data-skill="' + escapeHtml(skill.id) +
        '" data-input="' + sentenceId + '">Add my sentence</button>'
    );

    parts.push('<h4>Examples of this skill</h4>');
    const own = portfolio.examples.filter((e) => e.skillId === skill.id);
    if (own.length) {
      parts.push('<ul class="own-examples">');
      for (const example of own) {
        parts.push(
          '<li><strong>' + escapeHtml(example.title) + '</strong> ' +
            '<span class="kind">' + (KIND_WORD[example.kind] || 'Example') + '</span><br>' +
            '<span class="alt-text">' + escapeHtml(textAlternativeOf(example)) + '</span><br>' +
            '<button type="button" data-action="remove-example" data-example="' + escapeHtml(example.id) +
            '">Remove ' + escapeHtml(example.title) + '</button></li>'
        );
      }
      parts.push('</ul>');
    }
    parts.push(renderExampleOptions(skill.id, sampleExamplesFor(skill.id), usedExampleIds));
    parts.push(
      '<button type="button" data-action="add-sample-examples" data-skill="' + escapeHtml(skill.id) +
        '">Add the ticked examples</button>'
    );

    const writtenId = 'written-' + skill.id;
    parts.push('<label for="' + writtenId + '">Or write an example of ' + escapeHtml(skill.label) + '</label>');
    parts.push(
      '<textarea id="' + writtenId + '" name="' + writtenId + '" rows="3" ' +
        'placeholder="Here is something I can do&hellip;"></textarea>'
    );
    parts.push(
      '<button type="button" data-action="add-written-example" data-skill="' + escapeHtml(skill.id) +
        '" data-input="' + writtenId + '">Add my written example</button>'
    );
    parts.push('</article>');
  }
  return parts.join('\n');
}

/**
 * The share checklist. Every box starts EMPTY: ERI §7, "allow users to choose
 * which information is shared", which means nothing travels until it is ticked.
 * "Tick everything" is offered as one button — a choice, still made by hand.
 */
export function renderShareChecklist(portfolio, selection) {
  const parts = ['<fieldset class="share-list">', '<legend>What should your file include?</legend>'];
  const row = (id, name, value, label, checked) =>
    '<label class="chip chip-wide" for="' + id + '">' +
    '<input type="checkbox" id="' + id + '" name="' + name + '" value="' + escapeHtml(value) + '"' +
    (checked ? ' checked' : '') + '> ' + label + '</label>';

  parts.push(
    row('share-name', 'share-profile', 'displayName',
      'My name: <strong>' + escapeHtml(portfolio.profile.displayName || '(not set)') + '</strong>',
      selection.displayName)
  );
  parts.push(
    row('share-interests', 'share-profile', 'interests',
      'My interests: ' + escapeHtml(portfolio.profile.interests.join(', ') || '(none)'),
      selection.interests)
  );
  parts.push(
    row('share-activities', 'share-profile', 'activities',
      'Work I like: ' + escapeHtml(portfolio.profile.activities.join(', ') || '(none)'),
      selection.activities)
  );
  parts.push(
    row('share-statements', 'share-profile', 'statements',
      'My own sentences about each skill', selection.statements)
  );

  for (const skill of portfolio.skills) {
    parts.push(
      row('share-skill-' + skill.id, 'share-skill', skill.id,
        'Skill: <strong>' + escapeHtml(skill.label) + '</strong>',
        (selection.skillIds || []).includes(skill.id))
    );
    for (const example of portfolio.examples.filter((e) => e.skillId === skill.id)) {
      parts.push(
        row('share-example-' + example.id, 'share-example', example.id,
          '&nbsp;&nbsp;Example under ' + escapeHtml(skill.label) + ': ' + escapeHtml(example.title),
          (selection.exampleIds || []).includes(example.id))
      );
    }
  }
  parts.push('</fieldset>');
  return parts.join('\n');
}

/** ERI §4 "Preview portfolio — view a simple, employer-friendly presentation." */
export function renderPreview(shareLike, opts = {}) {
  if (!shareLike.skills.length && !shareLike.displayName) {
    return '<p class="hint">Your page will show up here as you fill it in.</p>';
  }
  return portfolioSectionsHtml(shareLike, opts);
}

/** Plain progress through ERI §6's five steps. A checklist, never a score. */
export function renderProgress(status) {
  const rows = [
    ['Your name is on the page', status.profile],
    ['Three skills chosen', status.threeSkills],
    ['At least one example added', status.oneExample],
    ['Your page is ready to look at', status.canPreview],
    ['Your page is ready to save or share', status.canShare]
  ];
  const parts = ['<ul class="progress">'];
  for (const [label, done] of rows) {
    parts.push(
      '<li>' + (done ? '<span class="tick">Done</span>' : '<span class="todo">Not yet</span>') +
        ' ' + escapeHtml(label) + '</li>'
    );
  }
  parts.push('</ul>');
  return parts.join('\n');
}
