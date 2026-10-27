/*
 * Guards: ERI's §10 written as code that can fail.
 *
 * Three of ERI's seven ethical requirements are the kind of rule a README can
 * claim and a prototype can quietly break. These functions turn them into
 * assertions, the app runs them at render time (fail-closed: an untraceable
 * suggestion is dropped and the drop is shown), and test/guards.test.js drives
 * each one to RED with a tampered input before trusting any green.
 *
 *   no ranking        -> findRankingViolations, isEmployerOrdered
 *   traceable reasons -> isTraceable
 *   no disclosure     -> findDisclosureFields (run over web/index.html)
 *   no generated      -> findAdviceProse (run over fixtures/resources.js)
 *     legal advice
 *
 * Nothing in here imports anything. It is deliberately dependency-free so the
 * browser and node:test run byte-identical code.
 */

/* ---------------------------------------------------------------- no ranking */

/*
 * Key names that would mean we had started grading a person. If a future
 * contributor adds `fitScore`, `rank`, `confidence` or `points` to the result
 * object, the guard fires and the test suite goes red.
 */
export const RANKING_KEY_PATTERN =
  /(score|ranking|^rank$|rating|weight|percent|confidence|^fit$|fitness|strength|priority|points|^tier$|grade|best|top|sorted)/i;

/*
 * Numbers are how ranking gets in. The result object is allowed exactly these
 * numeric fields, all of them positional or cardinal, none comparative.
 */
export const ALLOWED_NUMERIC_KEYS = new Set(['order', 'index', 'count', 'needCount', 'step']);

/* "72% fit", "8/10", "4 out of 5" - any shape that reads as a grade. */
const GRADE_IN_TEXT = /(\d+\s*%)|(\b\d+\s*\/\s*\d+\b)|(\b\d+\s+out\s+of\s+\d+\b)/i;

/**
 * Deep-walk any value and report everything that looks like a score, a rank or
 * a grade. Returns an array of { path, reason } - empty means clean.
 */
export function findRankingViolations(value, path = '$') {
  const out = [];

  const walk = (node, here, keyName) => {
    if (node === null || node === undefined) return;

    if (typeof node === 'number') {
      if (!ALLOWED_NUMERIC_KEYS.has(keyName)) {
        out.push({ path: here, reason: `numeric value ${node} at a key that is not a declared count or position` });
      }
      return;
    }
    if (typeof node === 'string') {
      const m = node.match(GRADE_IN_TEXT);
      if (m) out.push({ path: here, reason: `text reads as a grade: ${JSON.stringify(m[0])}` });
      return;
    }
    if (typeof node === 'boolean') return;

    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, `${here}[${i}]`, keyName));
      return;
    }
    if (node instanceof Map) {
      for (const [k, v] of node) walk(v, `${here}.get(${String(k)})`, String(k));
      return;
    }
    if (typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (RANKING_KEY_PATTERN.test(k)) {
          out.push({ path: `${here}.${k}`, reason: `key name reads as a ranking: ${JSON.stringify(k)}` });
        }
        walk(v, `${here}.${k}`, k);
      }
    }
  };

  walk(value, path, path);
  return out;
}

/**
 * The second half of "no ranking": output ORDER must be the employer's own
 * entry order, so nothing is implicitly best-first. `needs` is the employer's
 * list as entered; `suggestions` must appear in exactly that need order.
 */
export function isEmployerOrdered(suggestions, needs) {
  const rank = new Map(needs.map((n, i) => [n.id, i]));
  let last = -1;
  for (const s of suggestions) {
    const at = rank.get(s.need.id);
    if (at === undefined) return { ok: false, problem: `suggestion cites a need that was not entered: ${s.need.id}` };
    if (at < last) return { ok: false, problem: `suggestions are not in the employer's entry order (need ${s.need.id} came after a later need)` };
    last = at;
  }
  return { ok: true, problem: null };
}

/* ------------------------------------------------------- traceable reasoning */

/**
 * A suggestion is only allowed to exist if it can name BOTH sides: the
 * employer's own words it came from, and the candidate's own shared skill.
 * Free-text reasoning would make ERI's §9 criterion unfalsifiable, so the
 * explanation must literally contain both quotes.
 */
export function isTraceable(suggestion) {
  const problems = [];
  const s = suggestion || {};
  const c = s.citations || {};
  const needCite = c.need || {};
  const skillCite = c.skill || {};

  if (!s.need || !s.need.id) problems.push('no need id');
  if (!s.skill || !s.skill.id) problems.push('no skill id');
  if (needCite.source !== 'employer') problems.push('need citation is not attributed to the employer');
  if (skillCite.source !== 'candidate') problems.push('skill citation is not attributed to the candidate');
  if (!needCite.quote) problems.push('no quote from the employer’s stated need');
  if (!skillCite.quote) problems.push('no quote from the candidate’s stated skill');
  if (typeof s.explanation !== 'string' || !s.explanation) problems.push('no explanation');
  if (needCite.quote && typeof s.explanation === 'string' && !s.explanation.includes(needCite.quote)) {
    problems.push('explanation does not contain the employer quote it cites');
  }
  if (skillCite.quote && typeof s.explanation === 'string' && !s.explanation.includes(skillCite.quote)) {
    problems.push('explanation does not contain the candidate quote it cites');
  }
  return { ok: problems.length === 0, problems };
}

/* ------------------------------------------------- no disclosure field, ever */

/* Words that must never name an input the employer or candidate fills in. */
export const DISCLOSURE_WORD_PATTERN =
  /(disabilit|disabled|diagnos|medical|impair|disorder|condition|wheelchair|blind|deaf|autis|adhd|down\s*syndrome|mental\s*health|prognos|accommodation\s*needed)/i;

/**
 * Scan raw HTML for a form control - or the label/legend attached to one -
 * that asks about disability, diagnosis or medical information. ERI's §10
 * bullet 1 says never require it; we go further and never offer the field.
 * Regex, not a DOM: this must run under plain `node --test` with no deps.
 */
export function findDisclosureFields(html) {
  const hits = [];
  const controls = String(html).match(/<(?:input|select|textarea)\b[^>]*>/gi) || [];
  for (const tag of controls) {
    const m = tag.match(DISCLOSURE_WORD_PATTERN);
    if (m) hits.push({ where: 'form control', snippet: tag.slice(0, 120), word: m[0] });
  }
  const labels = String(html).match(/<(?:label|legend)\b[^>]*>[\s\S]*?<\/(?:label|legend)>/gi) || [];
  for (const tag of labels) {
    const m = tag.match(DISCLOSURE_WORD_PATTERN);
    if (m) hits.push({ where: 'label or legend', snippet: tag.replace(/\s+/g, ' ').slice(0, 120), word: m[0] });
  }
  return hits;
}

/**
 * Same rule for data: no candidate profile may carry a disability-shaped key,
 * and no value may name a diagnosis. This is what makes "never suggest an
 * accommodation from a disability label alone" unreachable rather than merely
 * forbidden - there is no label in the system to key off.
 */
export function findDisclosureFieldsInProfile(profile) {
  const hits = [];
  const walk = (node, here) => {
    if (node === null || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${here}[${i}]`));
    for (const [k, v] of Object.entries(node)) {
      if (DISCLOSURE_WORD_PATTERN.test(k)) hits.push({ path: `${here}.${k}`, reason: `key names disability information: ${k}` });
      if (typeof v === 'string') {
        const m = v.match(/(diagnos|wheelchair|blind\b|deaf\b|autis|adhd|down\s*syndrome|cerebral\s*palsy|bipolar|schizophren)/i);
        if (m) hits.push({ path: `${here}.${k}`, reason: `value names a diagnosis or label: ${m[0]}` });
      }
      walk(v, `${here}.${k}`);
    }
  };
  walk(profile, '$');
  return hits;
}

/* ------------------------------------------- no generated legal advice, ever */

/*
 * Advice verbs. Resource entries and the referral block may name a source and
 * a subject; the moment a string tells an employer what to do about an
 * accommodation, a disclosure or the law, it has become advice this prototype
 * is not qualified to give.
 */
const ADVICE_PATTERN =
  /(you\s+(should|must|need\s+to|have\s+to|are\s+required|may\s+legally|can\s+legally|cannot|can't|are\s+allowed)|it\s+is\s+(legal|illegal|lawful|unlawful|required)|is\s+not\s+required\s+by\s+law|the\s+law\s+(says|requires)|we\s+recommend\s+you)/i;

/** Report advice-shaped prose in a string or any nested strings. */
export function findAdviceProse(value, path = '$') {
  const out = [];
  const walk = (node, here) => {
    if (typeof node === 'string') {
      const m = node.match(ADVICE_PATTERN);
      if (m) out.push({ path: here, reason: `advice-shaped phrase: ${JSON.stringify(m[0])}` });
      return;
    }
    if (node === null || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${here}[${i}]`));
    for (const [k, v] of Object.entries(node)) walk(v, `${here}.${k}`);
  };
  walk(value, path);
  return out;
}

/* ------------------------------------------------ no automated decision, ever */

/*
 * ERI's §10 bullet 4 and §11 bullet 2. The tool may suggest, draft, and hand
 * over to a person. It may never read as having decided. These are the phrasings
 * that would mean it had.
 */
const DECISION_PATTERN =
  /(\b(we|this tool|the tool|the system)\s+(recommend|recommends|approve|approves|reject|rejects|deny|denies|decline|declines|select|selects)\b|\b(recommended|approved|rejected|denied|declined|disqualified|screened\s+out|not\s+suitable|unsuitable|not\s+a\s+good\s+fit|hire\s+this|do\s+not\s+hire|should\s+hire|should\s+not\s+hire)\b|\baccommodation\s+(granted|approved|denied)\b)/i;

/** Report decision-shaped language in a string or any nested strings. */
export function findDecisionLanguage(value, path = '$') {
  const out = [];
  const walk = (node, here) => {
    if (typeof node === 'string') {
      const m = node.match(DECISION_PATTERN);
      if (m) out.push({ path: here, reason: `decision-shaped phrase: ${JSON.stringify(m[0])}` });
      return;
    }
    if (node === null || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${here}[${i}]`));
    for (const [k, v] of Object.entries(node)) walk(v, `${here}.${k}`);
  };
  walk(value, path);
  return out;
}

/* ----------------------------------------------------------- fail-closed use */

/**
 * The app calls this before rendering. Untraceable suggestions are DROPPED and
 * returned separately so the interface can admit the drop instead of hiding it.
 * A silent filter would be its own fake-green.
 */
export function enforceTraceability(suggestions) {
  const kept = [];
  const dropped = [];
  for (const s of suggestions) {
    const verdict = isTraceable(s);
    if (verdict.ok) kept.push(s);
    else dropped.push({ suggestion: s, problems: verdict.problems });
  }
  return { kept, dropped };
}
