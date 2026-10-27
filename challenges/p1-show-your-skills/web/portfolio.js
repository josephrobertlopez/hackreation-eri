/*
 * Show Your Skills — core logic. No dependencies, no DOM, no network, no clock.
 * Runs unchanged in the browser (ES module) and under `node --test`.
 *
 * ERI problem statement §1: "Help employers recognize what a person can do by
 * providing alternative ways to demonstrate skills and experience."
 *
 * Four rules are enforced HERE, in the data layer, not in the UI — a UI rule is
 * a suggestion, a thrown Error is a rule:
 *
 *  1. No protected FIELD, ever. `setProfile`, `addSkill` and `addExample`
 *     refuse any key that reads as a disability, diagnosis, medical or
 *     accommodation detail, and `setProfile` refuses an unknown field outright.
 *     ERI §10: the product "should not require disclosure of a disability or
 *     diagnosis." The person's own free text is never censored — see
 *     `DISCLOSURE_HINT_PATTERN` for why that line is drawn there.
 *  2. No scoring, ranking or assessment of the person. There is no function
 *     here that returns a score, a rank, a percentage fit or a verdict, and
 *     nothing in a portfolio can be ordered by quality. ERI §9 puts "automated
 *     hiring or applicant scoring" and "AI-generated assessments of applicant
 *     suitability" out of scope.
 *  3. A non-text example cannot exist without its text alternative.
 *     `addExample` throws instead of storing a picture with no description or
 *     a recording with no transcript. ERI §7.
 *  4. A share contains exactly what was chosen. `buildShare` requires a
 *     selection argument and refuses an empty one; there is no code path that
 *     shares a whole portfolio by default. ERI §7, §10.
 */

export const PORTFOLIO_VERSION = 1;

export const EXAMPLE_KINDS = ['photo', 'video', 'audio', 'written'];

/** Kinds that demonstrate a skill without the employer reading prose (ERI §8). */
export const NON_TEXT_KINDS = ['photo', 'video', 'audio'];

/** The three profile fields ERI §4 asks for. Nothing else is storable. */
export const PROFILE_FIELDS = ['displayName', 'interests', 'activities'];

/**
 * Field names a portfolio refuses to hold. ERI §10: the product "should not
 * require disclosure of a disability or diagnosis" — and a field that exists
 * gets filled in, so the field does not exist and the attempt throws.
 *
 * This matches KEYS ONLY, on purpose. See `mentionsProtectedDetail` below for
 * why the person's own sentences are never blocked.
 */
export const PROTECTED_FIELD_PATTERN =
  /disabilit|disabled|diagnos|prognos|impair|disorder|syndrome|medical|medicaid|medicare|medicat|accommodat|iep\b|support[-_ ]?need|wheelchair|nonverbal|non-verbal/i;

/**
 * Words that *suggest* someone is about to disclose health or disability
 * detail in their own free text.
 *
 * DELIBERATELY NOT A REFUSAL. ERI's rule is that the product must not REQUIRE
 * disclosure — not that a person may not say what they want about their own
 * life. A tool that deletes a job seeker's sentence because it contains the
 * word "therapy" also blocks "I worked at a physical therapy clinic," and
 * telling an adult what they may write about themselves is its own harm.
 * The UI uses this to show one dismissible line — "You never have to share
 * health or disability information here" — and then gets out of the way.
 */
export const DISCLOSURE_HINT_PATTERN =
  /\b(my (disability|diagnosis|condition)|i (am|was) diagnosed|i have (autism|adhd|a disability)|my (meds|medication))\b/i;

export function mentionsProtectedDetail(text) {
  return DISCLOSURE_HINT_PATTERN.test(String(text || ''));
}

export class PortfolioError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PortfolioError';
  }
}

function fail(message) {
  throw new PortfolioError(message);
}

export function emptyPortfolio() {
  return {
    version: PORTFOLIO_VERSION,
    profile: { displayName: '', interests: [], activities: [] },
    skills: [],
    examples: []
  };
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function normalize(text) {
  return String(text).trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Throws if any KEY anywhere inside `value` names a protected detail. */
export function assertNoProtectedField(value, where) {
  const seen = [];
  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (PROTECTED_FIELD_PATTERN.test(k)) seen.push(k);
        walk(v);
      }
    }
  };
  walk(value);
  if (seen.length) {
    fail(
      'A portfolio has no field for health or disability information, and "' +
        seen[0] +
        '" reads like one. Describe the work instead.'
    );
  }
}

/* ------------------------------------------------------------------ profile */

export function setProfile(portfolio, patch) {
  const unknown = Object.keys(patch).filter((k) => !PROFILE_FIELDS.includes(k));
  if (unknown.length) {
    fail('A portfolio has no field called "' + unknown[0] + '".');
  }
  assertNoProtectedField(patch, 'profile');

  const next = { ...portfolio.profile };
  if ('displayName' in patch) next.displayName = String(patch.displayName).trim();
  if ('interests' in patch) next.interests = toList(patch.interests);
  if ('activities' in patch) next.activities = toList(patch.activities);
  return { ...portfolio, profile: next };
}

function toList(value) {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  return String(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------- skills */

/**
 * @param {object} input {label, id?, source: 'list'|'custom', plain?}
 * ERI §4 "Select skills from a list or enter custom skills." Both paths land here.
 */
export function addSkill(portfolio, input) {
  const label = String(input.label || '').trim();
  if (!label) fail('Give the skill a name first.');
  assertNoProtectedField(input, 'skill');

  const source = input.source === 'custom' ? 'custom' : 'list';
  const id = input.id || slugify(label) || 'skill-' + (portfolio.skills.length + 1);

  if (portfolio.skills.some((s) => s.id === id || normalize(s.label) === normalize(label))) {
    fail('"' + label + '" is already on your portfolio.');
  }
  const skill = { id, label, source, plain: input.plain ? String(input.plain) : '', statements: [] };
  return { ...portfolio, skills: [...portfolio.skills, skill] };
}

export function removeSkill(portfolio, skillId) {
  return {
    ...portfolio,
    skills: portfolio.skills.filter((s) => s.id !== skillId),
    examples: portfolio.examples.filter((e) => e.skillId !== skillId)
  };
}

export function findPortfolioSkill(portfolio, skillId) {
  return portfolio.skills.find((s) => s.id === skillId);
}

/**
 * ERI §4 "Describe abilities — use simple prompts such as 'I am good at…' and
 * 'Here is something I can do…'". A statement is the person's own sentence,
 * typed or picked from `starters` in fixtures/skills.js.
 */
export function addStatement(portfolio, skillId, text) {
  const skill = findPortfolioSkill(portfolio, skillId);
  if (!skill) fail('Add that skill first.');
  const sentence = String(text || '').trim();
  if (!sentence) fail('Write or pick a sentence first.');
  if (skill.statements.some((s) => normalize(s) === normalize(sentence))) return portfolio;
  return {
    ...portfolio,
    skills: portfolio.skills.map((s) =>
      s.id === skillId ? { ...s, statements: [...s.statements, sentence] } : s
    )
  };
}

export function removeStatement(portfolio, skillId, text) {
  return {
    ...portfolio,
    skills: portfolio.skills.map((s) =>
      s.id === skillId
        ? { ...s, statements: s.statements.filter((t) => normalize(t) !== normalize(text)) }
        : s
    )
  };
}

/* ----------------------------------------------------------------- examples */

/**
 * The text alternative each kind must carry (ERI §7). `alt` describes a still
 * picture; `caption` says what happens in a video; `transcript` writes out what
 * is said. A written example is its own text.
 */
export const REQUIRED_TEXT_ALTERNATIVE = {
  photo: ['alt'],
  video: ['caption', 'transcript'],
  audio: ['transcript'],
  written: ['body']
};

export function textAlternativeOf(example) {
  const keys = REQUIRED_TEXT_ALTERNATIVE[example.kind] || [];
  for (const key of keys) {
    if (example[key] && String(example[key]).trim()) return String(example[key]).trim();
  }
  return '';
}

/**
 * ERI §4 "Add photos, short videos, audio, or written examples demonstrating a
 * skill." Refuses an example that would reach an employer with no text path in.
 */
export function addExample(portfolio, input) {
  const kind = String(input.kind || '');
  if (!EXAMPLE_KINDS.includes(kind)) {
    fail('An example is a photo, a video, audio, or something written.');
  }
  if (!findPortfolioSkill(portfolio, input.skillId)) {
    fail('Pick which skill this example shows.');
  }
  const title = String(input.title || '').trim();
  if (!title) fail('Give the example a short name.');
  assertNoProtectedField(input, 'example');

  const example = {
    id: input.id || slugify(title) || 'example-' + (portfolio.examples.length + 1),
    skillId: input.skillId,
    kind,
    title,
    mediaId: input.mediaId || '',
    alt: str(input.alt),
    caption: str(input.caption),
    transcript: str(input.transcript),
    body: str(input.body),
    note: str(input.note),
    sampleStandIn: input.sampleStandIn === true
  };

  if (!textAlternativeOf(example)) {
    fail(MISSING_ALTERNATIVE_MESSAGE[kind]);
  }
  if (portfolio.examples.some((e) => e.id === example.id)) {
    fail('That example is already on your portfolio.');
  }
  return { ...portfolio, examples: [...portfolio.examples, example] };
}

const MISSING_ALTERNATIVE_MESSAGE = {
  photo: 'Add a sentence saying what the picture shows, so it works for everyone.',
  video: 'Add captions, or write out what happens in the video.',
  audio: 'Add a transcript — write out the words that are said.',
  written: 'Write the example itself before you add it.'
};

function str(value) {
  return value === undefined || value === null ? '' : String(value);
}

export function removeExample(portfolio, exampleId) {
  return { ...portfolio, examples: portfolio.examples.filter((e) => e.id !== exampleId) };
}

export function examplesOf(portfolio, skillId) {
  return portfolio.examples.filter((e) => e.skillId === skillId);
}

/** ERI §8: "supports at least one non-text method of demonstrating a skill." */
export function nonTextExampleCount(portfolio) {
  return portfolio.examples.filter((e) => NON_TEXT_KINDS.includes(e.kind)).length;
}

/* ------------------------------------------------------------------- status */

/**
 * ERI §6's five MVP steps, as five booleans. Progress only — it says nothing
 * about the person and nothing about how good any of it is.
 */
export function mvpStatus(portfolio) {
  const profile = Boolean(portfolio.profile.displayName.trim());
  const threeSkills = portfolio.skills.length >= 3;
  const oneExample = portfolio.examples.length >= 1;
  const canPreview = profile && portfolio.skills.length >= 1;
  const canShare = profile && threeSkills && oneExample;
  return { profile, threeSkills, oneExample, canPreview, canShare };
}

/* -------------------------------------------------------------------- share */

/**
 * Nothing is selected until the person selects it. ERI §7: "Allow users to
 * choose which information is shared."
 */
export function defaultShareSelection() {
  return { displayName: false, interests: false, activities: false, statements: false, skillIds: [], exampleIds: [] };
}

/** What the "Include everything" button sends. Still one explicit press. */
export function fullShareSelection(portfolio) {
  return {
    displayName: true,
    interests: true,
    activities: true,
    statements: true,
    skillIds: portfolio.skills.map((s) => s.id),
    exampleIds: portfolio.examples.map((e) => e.id)
  };
}

export function countSelected(selection) {
  if (!selection) return 0;
  return (
    (selection.displayName ? 1 : 0) +
    (selection.interests ? 1 : 0) +
    (selection.activities ? 1 : 0) +
    (selection.skillIds || []).length +
    (selection.exampleIds || []).length
  );
}

/**
 * Build the share payload. `selection` is REQUIRED: there is deliberately no
 * default, so no caller can accidentally share a whole portfolio.
 */
export function buildShare(portfolio, selection) {
  if (!selection || typeof selection !== 'object') {
    fail('Choose what to include before sharing.');
  }
  if (countSelected(selection) === 0) {
    fail('Nothing is ticked yet. Choose at least one thing to include.');
  }
  const skillIds = selection.skillIds || [];
  const exampleIds = selection.exampleIds || [];

  const skills = portfolio.skills
    .filter((s) => skillIds.includes(s.id))
    .map((s) => ({
      id: s.id,
      label: s.label,
      plain: s.plain,
      statements: selection.statements ? [...s.statements] : [],
      examples: portfolio.examples
        .filter((e) => e.skillId === s.id && exampleIds.includes(e.id))
        .map((e) => ({ ...e }))
    }));

  // An example whose skill was not shared is not smuggled in under another heading.
  const orphanExamples = portfolio.examples.filter(
    (e) => exampleIds.includes(e.id) && !skillIds.includes(e.skillId)
  ).length;

  return {
    version: PORTFOLIO_VERSION,
    displayName: selection.displayName ? portfolio.profile.displayName : '',
    interests: selection.interests ? [...portfolio.profile.interests] : [],
    activities: selection.activities ? [...portfolio.profile.activities] : [],
    skills,
    omitted: {
      skills: portfolio.skills.length - skills.length,
      examples: portfolio.examples.length - skills.reduce((n, s) => n + s.examples.length, 0),
      orphanExamples
    }
  };
}

export function shareSkillCount(share) {
  return share.skills.length;
}

/**
 * The same shape `buildShare` produces, but for the owner looking at their own
 * portfolio. Never used for sharing: it has no selection and so must never
 * reach an export. ERI §4 "Preview portfolio".
 */
export function previewShape(portfolio) {
  return {
    version: PORTFOLIO_VERSION,
    preview: true,
    displayName: portfolio.profile.displayName,
    interests: [...portfolio.profile.interests],
    activities: [...portfolio.profile.activities],
    skills: portfolio.skills.map((s) => ({
      id: s.id,
      label: s.label,
      plain: s.plain,
      statements: [...s.statements],
      examples: examplesOf(portfolio, s.id).map((e) => ({ ...e }))
    })),
    omitted: { skills: 0, examples: 0, orphanExamples: 0 }
  };
}

export function toShareJson(share) {
  return JSON.stringify(share, null, 2);
}

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const KIND_WORD = {
  photo: 'Picture',
  video: 'Video',
  audio: 'Audio',
  written: 'Written'
};

export const PORTFOLIO_FOOTER_TEXT =
  'This portfolio was made by the person it describes, and holds only what they ' +
  'chose to include. It contains no score, no rating and no assessment of anyone. ' +
  'It asks for no health or disability information and holds none.';

/**
 * The portfolio itself, as HTML: skills first and large, each with the person's
 * own sentences and their examples, every picture with what it shows and every
 * recording with its words. ERI §5: "As an employer, I want to quickly
 * understand an applicant's skills without navigating a complicated website."
 *
 * One renderer serves the in-page preview and the exported file, so the
 * employer-friendly presentation ERI §4 asks for is the artifact that ships.
 *
 * @param {object} shareLike  buildShare() output, or previewShape() output
 * @param {object} [opts]     {lookupMedia: (id) => {svg, alt} | undefined}
 */
export function portfolioSectionsHtml(shareLike, opts = {}) {
  const lookupMedia = opts.lookupMedia || (() => undefined);
  const who = shareLike.displayName ? escapeHtml(shareLike.displayName) : 'A job seeker';
  const parts = [];

  parts.push('<h1>' + who + ' &mdash; what I can do</h1>');
  if (shareLike.interests.length) {
    parts.push('<p><strong>I am interested in:</strong> ' + escapeHtml(shareLike.interests.join(', ')) + '</p>');
  }
  if (shareLike.activities.length) {
    parts.push('<p><strong>Work I like:</strong> ' + escapeHtml(shareLike.activities.join(', ')) + '</p>');
  }

  if (shareLike.skills.length) {
    parts.push('<h2>My skills</h2>');
    parts.push('<ul class="skill-summary">');
    for (const skill of shareLike.skills) parts.push('<li>' + escapeHtml(skill.label) + '</li>');
    parts.push('</ul>');
  }

  for (const skill of shareLike.skills) {
    parts.push('<h2>' + escapeHtml(skill.label) + '</h2>');
    if (skill.plain) parts.push('<p>' + escapeHtml(skill.plain) + '</p>');
    for (const sentence of skill.statements) parts.push('<p>' + escapeHtml(sentence) + '</p>');
    for (const example of skill.examples) {
      parts.push('<figure>');
      parts.push('<p class="kind">' + (KIND_WORD[example.kind] || 'Example') + '</p>');
      parts.push('<h3>' + escapeHtml(example.title) + '</h3>');
      const media = example.mediaId ? lookupMedia(example.mediaId) : undefined;
      if (media && media.svg) parts.push(media.svg);
      if (example.sampleStandIn) {
        parts.push(
          '<p class="note">Sample stand-in. This prototype records no audio or video; ' +
            'the words are written out below.</p>'
        );
      }
      parts.push('<figcaption>');
      const alternative = textAlternativeOf(example);
      const label =
        example.kind === 'audio'
          ? 'Transcript: '
          : example.kind === 'video'
            ? 'What happens: '
            : example.kind === 'photo'
              ? 'The picture shows: '
              : '';
      parts.push('<p>' + escapeHtml(label + alternative) + '</p>');
      if (example.kind === 'video' && example.transcript && example.caption) {
        parts.push('<p>Transcript: ' + escapeHtml(example.transcript) + '</p>');
      }
      if (example.note) parts.push('<p class="note">' + escapeHtml(example.note) + '</p>');
      parts.push('</figcaption>');
      parts.push('</figure>');
    }
  }
  return parts.join('\n');
}

/**
 * A standalone HTML file: one file, no styles to fetch, no scripts, no network.
 * This is the MVP share artifact (ERI §6 step 5) — a file survives a reload, an
 * email and a reviewer opening it next week, which an in-memory blob URL does not.
 *
 * @param {object} share  output of buildShare()
 * @param {object} [opts] {lookupMedia: (id) => {svg, alt} | undefined}
 */
export function toShareHtml(share, opts = {}) {
  if (share && share.preview) {
    fail('A preview is not a share. Choose what to include first.');
  }
  const who = share.displayName ? escapeHtml(share.displayName) : 'A job seeker';
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>' + who + ' &mdash; what I can do</title>',
    '<style>' +
      'body{font:18px/1.6 system-ui,sans-serif;color:#1b1b1b;background:#fff;margin:0 auto;max-width:44rem;padding:1.5rem}' +
      'h1{font-size:1.8rem}h2{font-size:1.4rem;margin-top:2.5rem;border-bottom:3px solid #0b5cad;padding-bottom:.3rem}' +
      'figure{margin:1rem 0;border:1px solid #ccc;border-radius:8px;padding:1rem}' +
      'figure svg{max-width:100%;height:auto}figcaption{margin-top:.5rem}' +
      '.kind{display:inline-block;font-size:.85rem;background:#eef3f8;border:1px solid #9bb8d4;border-radius:999px;padding:.1rem .6rem}' +
      '.note{color:#444}footer{margin-top:3rem;border-top:1px solid #ccc;padding-top:1rem;font-size:.95rem;color:#444}' +
      '@media print{figure{break-inside:avoid}}' +
      '</style>',
    '</head>',
    '<body>',
    portfolioSectionsHtml(share, opts),
    '<footer>',
    '<p>' + PORTFOLIO_FOOTER_TEXT + '</p>',
    '<p>Made with Show Your Skills, an ERI hackathon prototype. Sample media only.</p>',
    '</footer>',
    '</body>',
    '</html>'
  ].join('\n');
}

/* -------------------------------------------------- reload-safe share link */

function b64urlEncode(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(encoded) {
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * The whole share rides inside the URL fragment, so the link SURVIVES A RELOAD
 * and a bookmark — unlike a `URL.createObjectURL()` blob link, which looks like
 * a share and is dead the moment the tab closes. Nothing is uploaded: a
 * fragment is never sent to a server. It is a long link, and it only opens
 * wherever this page already is, which the UI says in those words.
 */
export function encodeShareLink(share) {
  return 'p=' + b64urlEncode(JSON.stringify(share));
}

/** Accepts "p=…", "#p=…", or a whole URL. Returns the share, or null. */
export function decodeShareLink(fragment) {
  if (!fragment) return null;
  const match = String(fragment).match(/[#&?]?p=([A-Za-z0-9\-_]+)/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(b64urlDecode(match[1]));
    if (!parsed || !Array.isArray(parsed.skills)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** A data: URL for a download anchor. No blob, no object URL, no network. */
export function toDataUrl(text, mime) {
  return 'data:' + mime + ';charset=utf-8,' + encodeURIComponent(text);
}
