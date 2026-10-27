/*
 * DOM wiring. All of the logic worth testing lives in match.js, plan.js and
 * guards.js; this file only moves it on and off the page.
 *
 * Deliberately absent, and asserted absent by test/source-rules.test.js:
 *   fetch / XMLHttpRequest / WebSocket - nothing leaves the browser
 *   localStorage / sessionStorage / cookies - nothing is kept
 *   setTimeout / setInterval - ERI's §8 says no unnecessary time limits, so
 *     there is no timer anywhere in this prototype
 *
 * User-supplied text is placed with textContent, never innerHTML. The only
 * markup string assigned anywhere is the inline SVG from fixtures/art.js.
 */

import { INDUSTRIES, INDUSTRY_BY_ID } from '../fixtures/industries.js';
import { CANDIDATES, DEMO } from '../fixtures/candidates.js';
import { PREFERENCE_BY_ID, INTEREST_BY_ID, SKILL_BY_ID } from '../fixtures/vocabulary.js';
import { RESOURCES } from '../fixtures/resources.js';
import { traceDiagram, planMark } from '../fixtures/art.js';
import {
  parseNeeds, validateNeeds, loadCandidate, enterCandidateManually,
  suggestMatches, vocabularyForUi, MIN_NEEDS, MAX_NEEDS
} from './match.js';
import { buildActionPlan } from './plan.js';
import { findRankingViolations, findDecisionLanguage, isEmployerOrdered } from './guards.js';

/* --------------------------------------------------------------- tiny helpers */

function el(tag, props = {}, kids = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (v !== null && v !== undefined && v !== false) node.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of [].concat(kids)) if (kid) node.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
  return node;
}

const $ = (id) => document.getElementById(id);

/* ------------------------------------------------------------------ populate */

$('figure-trace').insertAdjacentHTML('afterbegin', traceDiagram());

for (const industry of INDUSTRIES) {
  $('industry').appendChild(el('option', { value: industry.id, text: `${industry.name} - ${industry.blurb}` }));
}

for (const candidate of CANDIDATES) {
  $('candidate').appendChild(el('option', { value: candidate.id, text: `${candidate.displayName} - shared ${candidate.sharedOn}` }));
}

const vocab = vocabularyForUi();
vocab.skills.forEach((skill, i) => {
  $('manual-skills').appendChild(el('label', { class: 'choice' }, [
    el('input', { type: 'checkbox', id: `ms-${i}`, value: skill.id, 'data-kind': 'skill' }),
    skill.name
  ]));
});
vocab.preferences.forEach((pref, i) => {
  $('manual-prefs').appendChild(el('label', { class: 'choice' }, [
    el('input', { type: 'checkbox', id: `mp-${i}`, value: pref.id, 'data-kind': 'pref' }),
    pref.name
  ]));
});

for (const r of RESOURCES) {
  const bits = [];
  if (r.url) bits.push(el('a', { href: r.url, rel: 'noopener noreferrer', text: r.name }));
  else bits.push(el('strong', { text: r.name }));
  bits.push(document.createTextNode(` - ${r.publisher}. ${r.whatYouWillFind}`));
  if (r.phone) bits.push(el('strong', { text: ` ${r.phone}` }));
  $('resource-list').appendChild(el('li', {}, bits));
}

/* --------------------------------------------------------------- interactions */

$('industry').addEventListener('change', (e) => {
  const industry = INDUSTRY_BY_ID.get(e.target.value);
  const list = $('template-list');
  while (list.firstChild) list.removeChild(list.firstChild);
  $('template-tasks').hidden = !industry;
  if (!industry) return;
  industry.recurringTasks.forEach((task, i) => {
    list.appendChild(el('label', { class: 'choice' }, [
      el('input', { type: 'checkbox', id: `tt-${i}`, value: task.label, 'data-kind': 'template' }),
      task.label
    ]));
  });
});

/* Attached once, not inside the industry handler, so it cannot stack up. */
$('template-list').addEventListener('change', (ev) => {
  if (ev.target.dataset.kind !== 'template' || !ev.target.checked) return;
  const empty = needInputs().find((input) => input.value.trim() === '');
  if (empty) { empty.value = ev.target.value; empty.focus(); }
  ev.target.checked = false;
});

$('candidate').addEventListener('change', (e) => {
  const box = $('candidate-preview');
  while (box.firstChild) box.removeChild(box.firstChild);
  if (!e.target.value) return;
  let profile;
  try {
    profile = loadCandidate(e.target.value);
  } catch (err) {
    box.appendChild(el('p', { text: err.message }));
    return;
  }
  box.appendChild(el('h3', { text: `${profile.displayName}, in their own words` }));
  if (profile.ownWords) box.appendChild(el('blockquote', { text: profile.ownWords }));
  box.appendChild(el('p', { text: `Shared ${profile.sharedOn} from a ${profile.source}. Permission on record for ${profile.consent.scope}.` }));
  box.appendChild(el('p', { class: 'hint', text: profile.consent.note }));
  const tags = el('p');
  for (const id of profile.skills) tags.appendChild(el('span', { class: 'tag', text: (SKILL_BY_ID.get(id) || { name: id }).name }));
  box.appendChild(tags);
});

for (const radio of document.querySelectorAll('input[name="mode"]')) {
  radio.addEventListener('change', () => {
    const manual = document.querySelector('input[name="mode"]:checked').value === 'manual';
    $('manual-pane').hidden = !manual;
    $('shared-pane').hidden = manual;
  });
}

$('demo').addEventListener('click', () => {
  $('industry').value = DEMO.industryId;
  $('industry').dispatchEvent(new Event('change'));
  const inputs = needInputs();
  inputs.forEach((input, i) => { input.value = DEMO.needs[i] || ''; });
  document.querySelector('input[name="mode"][value="shared"]').checked = true;
  $('manual-pane').hidden = true;
  $('shared-pane').hidden = false;
  $('candidate').value = DEMO.candidateId;
  $('candidate').dispatchEvent(new Event('change'));
  $('industry').focus();
});

function needInputs() {
  return [1, 2, 3, 4, 5].map((n) => $(`need-${n}`));
}

/* -------------------------------------------------------------------- submit */

$('hub-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const errors = [];
  const summary = $('error-summary');
  while (summary.firstChild) summary.removeChild(summary.firstChild);

  const needs = parseNeeds(needInputs().map((input) => input.value));
  for (const input of needInputs()) input.setAttribute('aria-invalid', 'false');

  const verdict = validateNeeds(needs);
  if (!verdict.ok) {
    errors.push(verdict.message);
    for (const input of needInputs().slice(0, MIN_NEEDS)) if (!input.value.trim()) input.setAttribute('aria-invalid', 'true');
  }

  const manual = document.querySelector('input[name="mode"]:checked').value === 'manual';
  let candidate = null;
  try {
    if (manual) {
      candidate = enterCandidateManually({
        displayName: $('manual-name').value.trim() || undefined,
        skills: [...document.querySelectorAll('#manual-skills input:checked')].map((c) => c.value),
        interests: [],
        preferences: [...document.querySelectorAll('#manual-prefs input:checked')].map((c) => c.value)
      });
      if (candidate.skills.length === 0) errors.push('Tick at least one skill they told you about, or switch back to a shared profile.');
    } else if (!$('candidate').value) {
      errors.push('Choose a shared profile, or switch to typing it yourself.');
    } else {
      candidate = loadCandidate($('candidate').value);
    }
  } catch (err) {
    errors.push(err.message);
  }

  if (errors.length || !candidate) {
    summary.appendChild(el('h2', { text: errors.length === 1 ? 'One thing to fix' : 'A few things to fix' }));
    summary.appendChild(el('ul', {}, errors.map((m) => el('li', { text: m }))));
    summary.hidden = false;
    summary.focus();
    $('results').hidden = true;
    $('plan-out').hidden = true;
    return;
  }
  summary.hidden = true;

  const result = suggestMatches({ industryId: $('industry').value, needs, candidate });
  const plan = buildActionPlan(result);

  /* Guards run on the real output, in the browser, every time. Fail-closed:
   * if an invariant trips, the page says so instead of rendering suggestions. */
  const violations = [
    ...findRankingViolations({ result, plan }).map((v) => `ranking guard: ${v.path} - ${v.reason}`),
    ...findDecisionLanguage({ result, plan }).map((v) => `decision-language guard: ${v.path} - ${v.reason}`)
  ];
  const ordered = isEmployerOrdered(result.suggestions, needs);
  if (!ordered.ok) violations.push(`ordering guard: ${ordered.problem}`);

  renderResults(result, violations);
  renderPlan(plan);
  $('results').hidden = false;
  $('plan-out').hidden = false;
  $('results-h').focus();
});

/* -------------------------------------------------------------------- render */

function renderResults(result, violations) {
  const out = $('results-body');
  while (out.firstChild) out.removeChild(out.firstChild);

  if (violations.length) {
    out.appendChild(el('div', { class: 'errors' }, [
      el('h3', { text: 'Held back: an internal rule failed' }),
      el('p', { text: 'This prototype refuses to show suggestions it cannot justify. One of its own guards tripped, so nothing is shown. The detail is below for whoever is fixing it.' }),
      el('ul', {}, violations.map((v) => el('li', { text: v })))
    ]));
    return;
  }

  const who = result.candidate.entryMode === 'typed-by-employer'
    ? `${result.candidate.displayName}, as described by you. Check it with them before relying on it.`
    : `${result.candidate.displayName}, from the profile they chose to share.`;
  out.appendChild(el('p', { text: who }));
  out.appendChild(el('p', { class: 'hint', text: result.meta.ordering + '. This tool decides ' + result.meta.decides + '.' }));

  if (result.suggestions.length === 0) {
    out.appendChild(el('p', { text: 'No suggestions. Nothing you typed lined up with the skills this person shared, and the tool will not invent a connection. The gaps are listed below.' }));
  }

  for (const s of result.suggestions) {
    const card = el('div', { class: 'card' });
    card.appendChild(el('h3', { text: s.skill.name }));
    card.appendChild(el('p', { text: s.explanation }));
    card.appendChild(el('ul', { class: 'trace' }, [
      el('li', {}, [el('span', { class: 'who', text: 'You wrote: ' }), `"${s.need.text}"`]),
      el('li', {}, [el('span', { class: 'who', text: 'Matched on: ' }), `"${s.citations.need.quote}" from ${s.citations.need.via}`]),
      el('li', {}, [el('span', { class: 'who', text: 'They shared: ' }), `"${s.citations.skill.quote}" via ${s.citations.skill.via}`])
    ]));

    if (s.relatedTasks.length) {
      card.appendChild(el('h4', { text: 'Responsibilities this could become' }));
      card.appendChild(el('ul', {}, s.relatedTasks.map((t) => el('li', { text: t.label }))));
    }
    if (s.evidence.length) {
      card.appendChild(el('h4', { text: 'What they sent to show it' }));
      card.appendChild(el('ul', {}, s.evidence.map((ev) => el('li', { text: `${ev.kind}: ${ev.caption}` }))));
    }
    if (s.interestNotes.length) {
      for (const n of s.interestNotes) card.appendChild(el('p', { class: 'hint', text: n.text }));
    }
    if (s.preferenceNotes.length) {
      const wrap = el('p');
      for (const n of s.preferenceNotes) {
        wrap.appendChild(el('span', { class: `tag ${n.label === 'fits' ? 'fits' : 'discuss'}`, text: n.text }));
      }
      card.appendChild(wrap);
    }
    out.appendChild(card);
  }

  if (result.droppedSuggestions.length) {
    out.appendChild(el('div', { class: 'errors' }, [
      el('h3', { text: 'Dropped, because they could not cite both sides' }),
      el('ul', {}, result.droppedSuggestions.map((d) => el('li', { text: `${d.suggestion.id}: ${d.problems.join('; ')}` })))
    ]));
  }

  if (result.unmatchedNeeds.length) {
    const gap = el('div', { class: 'gap' });
    gap.appendChild(el('h3', { text: 'Needs with no match - shown rather than hidden' }));
    gap.appendChild(el('ul', {}, result.unmatchedNeeds.map((u) => el('li', {}, [
      el('strong', { text: `"${u.text}" ` }), u.message
    ]))));
    out.appendChild(gap);
  }
}

function renderPlan(plan) {
  const out = $('plan-body');
  while (out.firstChild) out.removeChild(out.firstChild);

  const head = el('p');
  head.insertAdjacentHTML('afterbegin', planMark());
  head.appendChild(el('strong', { text: ` ${plan.heading}` }));
  out.appendChild(head);

  out.appendChild(el('div', { class: 'notice' }, [
    el('h3', { text: plan.decisionNotice.heading }),
    el('p', { text: plan.decisionNotice.body })
  ]));

  if (plan.draftResponsibilities.length) {
    out.appendChild(el('h3', { text: 'Draft responsibilities, and where each came from' }));
    out.appendChild(el('ul', {}, plan.draftResponsibilities.map((b) => el('li', {}, [
      el('strong', { text: b.label }),
      el('ul', {}, b.becauseOf.map((c) => el('li', { text: `your words "${c.needQuote}" plus their skill "${c.skillQuote}"` })))
    ]))));
  }

  out.appendChild(el('h3', { text: 'Next steps' }));
  out.appendChild(el('ol', { class: 'steps' }, plan.steps.map((s) => el('li', {}, [
    el('strong', { text: s.heading }), el('br'), s.detail
  ]))));

  out.appendChild(el('h3', { text: 'Questions for you, the candidate and an employment specialist' }));
  out.appendChild(el('ul', {}, plan.questionsForSpecialist.map((q) => el('li', { text: q }))));

  if (plan.openQuestions.length) {
    out.appendChild(el('h3', { text: 'Still open' }));
    out.appendChild(el('ul', {}, plan.openQuestions.map((g) => el('li', {}, [
      el('strong', { text: `"${g.text}" ` }), g.talkAbout
    ]))));
  }

  out.appendChild(el('div', { class: 'notice' }, [
    el('h3', { text: plan.legalReferral.heading }),
    el('p', { text: plan.legalReferral.body })
  ]));

  out.appendChild(el('p', { class: 'hint', text: `Built from ${plan.provenance.builtFrom}. Stored anywhere: ${plan.provenance.storedAnywhere}. Decides: ${plan.provenance.decides}.` }));
}

/* Make the three-to-five rule visible rather than only enforced on submit. */
$('needs-hint').textContent =
  `${MIN_NEEDS} at least, ${MAX_NEEDS} at most. Plain sentences are better than job-ad language: ` +
  '"nobody resets the displays by Thursday" works.';
