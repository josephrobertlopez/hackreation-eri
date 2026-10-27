/*
 * Show Your Skills — wiring only. Every rule lives in portfolio.js and every
 * piece of markup comes from render.js; this file moves values between them and
 * puts focus somewhere sensible afterwards.
 *
 * Things this file deliberately does NOT contain:
 *  - fetch, XMLHttpRequest, WebSocket, EventSource, or any absolute URL. The
 *    page talks to nothing. ERI §9 puts production hosting out of scope, and a
 *    prototype that phones home is not reviewable by ERI's web team.
 *  - setTimeout or setInterval. There is no countdown, no auto-advance and no
 *    session expiry, because ERI §7 says avoid time limits, and the honest way
 *    to have no time limit is to own no clock.
 *  - URL.createObjectURL. A blob URL looks like a shareable link and is dead on
 *    reload. The share artifact is a FILE (data: URL + download attribute), and
 *    the optional link carries the portfolio in the address itself so it
 *    survives a reload and a bookmark.
 */

import {
  emptyPortfolio, setProfile, addSkill, removeSkill, addStatement, removeStatement,
  addExample, removeExample, mvpStatus, previewShape, defaultShareSelection,
  fullShareSelection, buildShare, countSelected, toShareHtml, toShareJson,
  encodeShareLink, decodeShareLink, toDataUrl, mentionsProtectedDetail, escapeHtml
} from './portfolio.js';
import {
  renderChipGroup, renderSkillPicker, renderChosenSkills, renderShareChecklist,
  renderPreview, renderProgress
} from './render.js';
import { SKILLS, findSkill, skillsByGroup } from '../fixtures/skills.js';
import { examplesForSkill, findWorkExample, toExampleInput } from '../fixtures/work-examples.js';
import { INTEREST_OPTIONS, ACTIVITY_OPTIONS } from '../fixtures/profile-options.js';
import { MEDIA } from '../fixtures/media.js';
import { samplePortfolio } from '../fixtures/sample-portfolio.js';

const lookupMedia = (id) => MEDIA[id];
const mediaOpts = { lookupMedia };

let portfolio = emptyPortfolio();
let selection = defaultShareSelection();

const $ = (id) => document.getElementById(id);

/* ------------------------------------------------------- employer read-only */

const shared = decodeShareLink(window.location.hash);
if (shared) {
  $('main').hidden = true;
  $('employer-view').hidden = false;
  $('employer-portfolio').innerHTML = renderPreview(shared, mediaOpts);
  document.title = (shared.displayName || 'A job seeker') + ' - what I can do';
} else {
  start();
}

function start() {
  renderChips();
  renderPicker();
  renderEverythingElse();
  wire();
}

/* ------------------------------------------------------------------ renders */

function renderChips() {
  $('interest-chips').innerHTML = renderChipGroup({
    legend: 'What are you interested in?',
    name: 'interest',
    options: INTEREST_OPTIONS,
    selected: portfolio.profile.interests,
    hint: 'Tick any that fit. You can also leave them all blank.'
  });
  $('activity-chips').innerHTML = renderChipGroup({
    legend: 'What kind of work do you like?',
    name: 'activity',
    options: ACTIVITY_OPTIONS,
    selected: portfolio.profile.activities,
    hint: 'Tick any that fit.'
  });
  $('display-name').value = portfolio.profile.displayName;
}

function renderPicker() {
  $('skill-picker').innerHTML = renderSkillPicker(
    skillsByGroup(),
    portfolio.skills.map((s) => s.id)
  );
}

function renderChosen() {
  $('chosen-skills').innerHTML = renderChosenSkills(portfolio, {
    startersFor: (id) => (findSkill(id) ? findSkill(id).starters : []),
    sampleExamplesFor: (id) => examplesForSkill(id)
  });
}

function renderSharePanel() {
  $('share-checklist').innerHTML = renderShareChecklist(portfolio, selection);
}

function renderEverythingElse() {
  renderChosen();
  renderSharePanel();
  $('preview').innerHTML = renderPreview(previewShape(portfolio), mediaOpts);
  $('progress').innerHTML = renderProgress(mvpStatus(portfolio));
}

/* ------------------------------------------------------------- small helpers */

function announce(message) {
  $('live').textContent = message;
}

function showError(message) {
  const box = $('form-error');
  box.textContent = message;
  box.hidden = false;
  box.focus();
}

function clearError() {
  const box = $('form-error');
  box.textContent = '';
  box.hidden = true;
}

/** Run a change to the portfolio; on refusal, say why in plain words. */
function change(fn, message) {
  try {
    portfolio = fn(portfolio);
    clearError();
    if (message) announce(message);
    return true;
  } catch (error) {
    showError(error.message);
    return false;
  }
}

function pruneSelection() {
  const skillIds = portfolio.skills.map((s) => s.id);
  const exampleIds = portfolio.examples.map((e) => e.id);
  selection = {
    ...selection,
    skillIds: (selection.skillIds || []).filter((id) => skillIds.includes(id)),
    exampleIds: (selection.exampleIds || []).filter((id) => exampleIds.includes(id))
  };
}

function checkedValues(name) {
  return Array.from(document.querySelectorAll('input[name="' + name + '"]:checked')).map((i) => i.value);
}

/* --------------------------------------------------------------------- wiring */

function wire() {
  $('display-name').addEventListener('input', (event) => {
    change((p) => setProfile(p, { displayName: event.target.value }));
    $('disclosure-hint').hidden = !mentionsProtectedDetail(event.target.value);
    renderSharePanel();
    $('preview').innerHTML = renderPreview(previewShape(portfolio), mediaOpts);
    $('progress').innerHTML = renderProgress(mvpStatus(portfolio));
  });

  $('interest-chips').addEventListener('change', () => {
    change((p) => setProfile(p, { interests: checkedValues('interest') }));
    renderSharePanel();
    $('preview').innerHTML = renderPreview(previewShape(portfolio), mediaOpts);
  });

  $('activity-chips').addEventListener('change', () => {
    change((p) => setProfile(p, { activities: checkedValues('activity') }));
    renderSharePanel();
    $('preview').innerHTML = renderPreview(previewShape(portfolio), mediaOpts);
  });

  $('add-picked-skills').addEventListener('click', () => {
    const ids = checkedValues('skill-pick');
    if (!ids.length) {
      showError('Tick at least one skill first.');
      return;
    }
    let added = 0;
    for (const id of ids) {
      const skill = findSkill(id);
      if (!skill) continue;
      if (change((p) => addSkill(p, { id: skill.id, label: skill.label, source: 'list', plain: skill.plain }))) {
        added += 1;
      }
    }
    renderPicker();
    renderEverythingElse();
    announce(added + (added === 1 ? ' skill added.' : ' skills added.'));
    $('h-chosen').focus();
  });

  $('add-custom-skill').addEventListener('click', () => {
    const input = $('custom-skill');
    const label = input.value.trim();
    if (!label) {
      showError('Write the skill first.');
      input.focus();
      return;
    }
    if (change((p) => addSkill(p, { label, source: 'custom' }), label + ' added.')) {
      input.value = '';
      renderEverythingElse();
      $('h-chosen').focus();
    }
  });

  // One delegated listener for every button render.js emits with a data-action.
  $('chosen-skills').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { action, skill: skillId, text, example: exampleId, input: inputId } = button.dataset;

    if (action === 'remove-skill') {
      change((p) => removeSkill(p, skillId), 'Skill removed.');
    } else if (action === 'add-statement') {
      change((p) => addStatement(p, skillId, text), 'Sentence added.');
    } else if (action === 'remove-statement') {
      change((p) => removeStatement(p, skillId, text), 'Sentence removed.');
    } else if (action === 'add-typed-statement') {
      const value = $(inputId).value.trim();
      if (!value) {
        showError('Write your sentence first.');
        return;
      }
      change((p) => addStatement(p, skillId, value), 'Sentence added.');
    } else if (action === 'add-sample-examples') {
      const ids = checkedValues('example-pick-' + skillId);
      if (!ids.length) {
        showError('Tick at least one example first.');
        return;
      }
      for (const id of ids) {
        const sample = findWorkExample(id);
        if (sample) change((p) => addExample(p, toExampleInput(sample, skillId)));
      }
      announce(ids.length + (ids.length === 1 ? ' example added.' : ' examples added.'));
    } else if (action === 'add-written-example') {
      const value = $(inputId).value.trim();
      if (!value) {
        showError('Write your example first.');
        return;
      }
      change(
        (p) =>
          addExample(p, {
            skillId,
            kind: 'written',
            title: value.split(/[.\n]/)[0].slice(0, 60) || 'My example',
            body: value
          }),
        'Example added.'
      );
    } else if (action === 'remove-example') {
      change((p) => removeExample(p, exampleId), 'Example removed.');
    } else {
      return;
    }
    pruneSelection();
    renderPicker();
    renderEverythingElse();
    $('h-chosen').focus();
  });

  // Share ticks update the selection in place; the panel is NOT re-rendered, so
  // focus stays on the box the person just ticked.
  $('share-checklist').addEventListener('change', (event) => {
    const input = event.target;
    if (input.name === 'share-profile') {
      selection = { ...selection, [input.value]: input.checked };
    } else if (input.name === 'share-skill') {
      const ids = new Set(selection.skillIds);
      input.checked ? ids.add(input.value) : ids.delete(input.value);
      selection = { ...selection, skillIds: [...ids] };
    } else if (input.name === 'share-example') {
      const ids = new Set(selection.exampleIds);
      input.checked ? ids.add(input.value) : ids.delete(input.value);
      selection = { ...selection, exampleIds: [...ids] };
    }
    announce(countSelected(selection) + ' things ticked to include.');
  });

  $('share-all').addEventListener('click', () => {
    selection = fullShareSelection(portfolio);
    renderSharePanel();
    announce('Everything ticked. You can untick anything you want to keep private.');
  });

  $('share-none').addEventListener('click', () => {
    selection = defaultShareSelection();
    renderSharePanel();
    announce('Nothing is ticked now.');
  });

  $('make-file').addEventListener('click', makeFile);

  $('load-sample').addEventListener('click', () => {
    portfolio = samplePortfolio();
    selection = defaultShareSelection();
    $('share-result').innerHTML = '';
    renderChips();
    renderPicker();
    renderEverythingElse();
    announce('A finished example is loaded. Change anything you like.');
    $('h-chosen').focus();
  });

  $('start-over').addEventListener('click', () => {
    portfolio = emptyPortfolio();
    selection = defaultShareSelection();
    $('share-result').innerHTML = '';
    $('custom-skill').value = '';
    renderChips();
    renderPicker();
    renderEverythingElse();
    clearError();
    announce('Empty page. Nothing was kept.');
    $('display-name').focus();
  });
}

/* ----------------------------------------------------------------- the share */

function makeFile() {
  let share;
  try {
    share = buildShare(portfolio, selection);
    clearError();
  } catch (error) {
    showError(error.message);
    return;
  }

  const html = toShareHtml(share, mediaOpts);
  const json = toShareJson(share);
  const linkTarget = window.location.href.split('#')[0] + '#' + encodeShareLink(share);
  const fileStem = (share.displayName || 'my').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-portfolio';

  $('share-result').innerHTML = [
    '<h3 id="h-file" tabindex="-1">Your file is ready</h3>',
    '<p>It includes ' + countSelected(selection) + ' things you ticked' +
      (share.omitted.skills || share.omitted.examples
        ? ', and leaves out ' + share.omitted.skills + ' skills and ' + share.omitted.examples + ' examples'
        : '') +
      '.</p>',
    '<p><a id="download-html" download="' + fileStem + '.html" href="' +
      toDataUrl(html, 'text/html') + '">Save my page as a web page (.html)</a></p>',
    '<p><a id="download-json" download="' + fileStem + '.json" href="' +
      toDataUrl(json, 'application/json') + '">Save the same thing as data (.json)</a></p>',
    '<h4>A link you can paste to someone</h4>',
    '<p class="hint">',
    'This link carries your page inside the address itself, so it still works ',
    'after a reload and can be bookmarked. Nothing is uploaded and nobody hosts ',
    'it for you &mdash; it only opens where this page already is. The file above ',
    'is the sturdier thing to send.',
    '</p>',
    '<label for="share-link">Your link</label>',
    '<input type="text" id="share-link" readonly value="' + escapeHtml(linkTarget) + '">'
  ].join('\n');

  announce('Your file is ready to save.');
  $('h-file').focus();
}
