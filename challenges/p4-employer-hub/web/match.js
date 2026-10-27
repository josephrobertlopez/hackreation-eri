/*
 * Skills-to-tasks matching. ERI's §6 names this as the focus, so this file is
 * the product and everything else is framing.
 *
 * The whole mechanism in one sentence: a suggestion exists when a span of the
 * EMPLOYER'S OWN typed need names the same plain skill that the CANDIDATE
 * chose to share, and the suggestion carries both quotes so a human can
 * disagree with it.
 *
 * Deliberately absent: scores, ranks, weights, ordering by goodness, any
 * comparison between two candidates, and any input about disability. See
 * web/guards.js for the assertions, spec/acceptance.md for the row-by-row
 * mapping back to ERI's words.
 */

import { SKILLS, SKILL_BY_ID, INTEREST_BY_ID, PREFERENCES, PREFERENCE_BY_ID } from '../fixtures/vocabulary.js';
import { INDUSTRY_BY_ID, findTask } from '../fixtures/industries.js';
import { CANDIDATE_BY_ID } from '../fixtures/candidates.js';
import { DISCLOSURE_WORD_PATTERN, enforceTraceability } from './guards.js';

export const MIN_NEEDS = 3;
export const MAX_NEEDS = 5;

/*
 * Whole-word stem matching. The suffix list is long on purpose: we want the
 * QUOTE shown to the employer to be a real word out of their own sentence
 * ("wipe", "organizing") rather than a stem fragment ("wip", "organiz").
 * Bounded on both sides, so "count" does not match "counter" or "country" -
 * that false positive was the reason for doing it this way.
 */
const SUFFIX =
  '(?:e|es|s|ed|ing|ion|ions|ation|ations|ment|ments|al|age|ages|aging|ling|lings|led|ned|ning|ner|ners|ping|ped|ting|ted)?';

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** First whole-word hit for a keyword stem, returned as the employer's own word. */
function firstWordHit(text, keyword) {
  const re = new RegExp(`\\b${escapeRegExp(keyword)}${SUFFIX}\\b`, 'i');
  const m = String(text).match(re);
  return m ? m[0] : null;
}

/* ------------------------------------------------------------ employer needs */

/**
 * Turn raw lines into needs, preserving the employer's entry order. `order` is
 * the only number in the whole result object and it is positional, never a
 * rank (web/guards.js enforces that).
 */
export function parseNeeds(lines) {
  const cleaned = (Array.isArray(lines) ? lines : String(lines).split('\n'))
    .map((l) => (typeof l === 'string' ? l : String(l.text || '')).trim())
    .filter((l) => l.length > 0);

  return cleaned.map((text, i) => ({
    id: `need-${i + 1}`,
    order: i,
    text,
    fromTaskId: null
  }));
}

/** A need the employer picked off the industry template rather than typing. */
export function needFromTask(taskId, order) {
  const found = findTask(taskId);
  if (!found) throw new Error(`unknown task: ${taskId}`);
  return { id: `need-${order + 1}`, order, text: found.task.label, fromTaskId: taskId };
}

/** ERI's §6 step 2: three to five. Refuses outside that, with plain words. */
export function validateNeeds(needs) {
  const n = Array.isArray(needs) ? needs.length : 0;
  if (n < MIN_NEEDS) {
    return { ok: false, code: 'too-few', needCount: n, message: `Add at least three workplace needs. You have ${n === 0 ? 'none yet' : n === 1 ? 'one' : 'two'}.` };
  }
  if (n > MAX_NEEDS) {
    return { ok: false, code: 'too-many', needCount: n, message: 'Keep it to five needs for now. Pick the five that come up most often.' };
  }
  return { ok: true, code: 'ok', needCount: n, message: null };
}

/* ----------------------------------------------------- need -> skill linkage */

/**
 * Which plain skills does the employer's own sentence name? Each hit carries
 * the employer's word, so the suggestion can quote it verbatim. A need that
 * names nothing in the vocabulary returns [] - the tool does not guess.
 */
export function skillRefsForNeed(need) {
  const refs = new Map();

  for (const skill of SKILLS) {
    for (const kw of skill.keywords) {
      const hit = firstWordHit(need.text, kw);
      if (hit) {
        refs.set(skill.id, { skillId: skill.id, quote: hit, via: 'the words you typed' });
        break;
      }
    }
  }

  if (need.fromTaskId) {
    const found = findTask(need.fromTaskId);
    if (found) {
      for (const skillId of found.task.skills) {
        if (!refs.has(skillId)) {
          refs.set(skillId, { skillId, quote: found.task.label, via: `the ${found.industry.name} task you selected` });
        }
      }
    }
  }

  return [...refs.values()];
}

/* ----------------------------------------------------------- candidate input */

/**
 * ERI's §6 step 3 has the employer typing the candidate's skills. We default to
 * this instead: load the profile the person shared. See spec/acceptance.md
 * P4-M3 for why, and fixtures/candidates.js for the shape.
 *
 * Fail-closed on consent (ERI §10 bullet 2): no approved consent, no profile.
 */
export function loadCandidate(candidateId, lookup = CANDIDATE_BY_ID) {
  const profile = lookup.get(candidateId);
  if (!profile) throw new Error(`unknown candidate profile: ${candidateId}`);
  const consent = profile.consent;
  if (!consent || consent.shareApproved !== true) {
    throw new Error(
      `profile ${candidateId} has no recorded permission to be shared. ` +
      'Ask the candidate, or their job developer, before this employer sees it.'
    );
  }
  return { ...profile, entryMode: 'shared-by-candidate' };
}

/**
 * The fallback for an employer with no shared profile in front of them. It is
 * second-class on purpose: the result is stamped `entryMode: 'typed-by-employer'`
 * so every screen can say whose account of the person this is.
 *
 * Refuses unknown skill ids (no free-text abilities) and refuses outright if
 * any field smells like disability information.
 */
export function enterCandidateManually(input) {
  const bad = Object.keys(input || {}).filter((k) => DISCLOSURE_WORD_PATTERN.test(k));
  if (bad.length) throw new Error(`this tool does not accept disability information. Remove: ${bad.join(', ')}`);

  const pick = (ids, map, kind) => {
    const list = Array.isArray(ids) ? ids : [];
    const unknown = list.filter((id) => !map.has(id));
    if (unknown.length) throw new Error(`unknown ${kind}: ${unknown.join(', ')}. Pick from the shared vocabulary.`);
    return list;
  };

  return {
    id: 'cand-manual',
    displayName: (input && input.displayName) || 'Candidate (entered by the employer)',
    source: 'typed by the employer during this session',
    sharedOn: null,
    consent: {
      shareApproved: true,
      approvedOn: null,
      scope: 'skills, interests and work preferences only',
      sharedWith: 'nobody - nothing leaves this browser',
      note: 'The employer typed this. It is their account of the person, not the person’s own, so check it with them before relying on it.'
    },
    ownWords: null,
    skills: pick(input && input.skills, SKILL_BY_ID, 'skill'),
    interests: pick(input && input.interests, INTEREST_BY_ID, 'interest'),
    preferences: pick(input && input.preferences, PREFERENCE_BY_ID, 'preference'),
    evidence: [],
    entryMode: 'typed-by-employer'
  };
}

/* -------------------------------------------------------------- explanations */

/**
 * ERI's §6 step 5 and §9 bullet 4. The explanation is a FIXED TEMPLATE over two
 * quotes, not generated prose. That is what makes "reflects actual employer
 * needs, not assumptions about disability" a thing a test can check: if either
 * quote is missing, web/guards.js isTraceable() refuses the suggestion.
 */
export function explain({ need, needQuote, via, candidateName, skillName }) {
  return (
    `Your stated need: "${need.text}". ` +
    `The part that matched is "${needQuote}", from ${via}. ` +
    `${candidateName} listed "${skillName}" among the skills they chose to share. ` +
    'That pair is the whole reason this appears here. ' +
    'It is a starting point for a conversation, not a judgement about anyone.'
  );
}

/* --------------------------------------------------------- preference notes */

/*
 * Two labels, never a tally. A 'worth discussing' note is information for two
 * people, not a mark against the candidate.
 *
 * Computed PER TASK, not over the union of every related task's traits. The
 * union version was written first and was quietly useless: with four related
 * tasks the union contained both 'routine' and 'variable', so every preference
 * found a fit and no clash was ever reportable. Per task, "this particular
 * responsibility is variable and you asked for routine" survives.
 */
function preferenceNotesForTask(candidate, task) {
  const traitSet = new Set(task.traits || []);
  const notes = [];
  for (const prefId of candidate.preferences || []) {
    const pref = PREFERENCE_BY_ID.get(prefId);
    if (!pref) continue;
    const fit = (pref.fitsTraits || []).find((t) => traitSet.has(t));
    if (fit) {
      notes.push({
        preferenceId: pref.id, taskId: task.id, taskLabel: task.label, label: 'fits',
        text: `${candidate.displayName} asked for ${pref.name}; "${task.label}" is marked "${fit}".`
      });
      continue;
    }
    const clash = (pref.discussTraits || []).find((t) => traitSet.has(t));
    if (clash) {
      notes.push({
        preferenceId: pref.id, taskId: task.id, taskLabel: task.label, label: 'worth discussing',
        text: `${candidate.displayName} asked for ${pref.name}, and "${task.label}" is marked "${clash}". Worth asking them about, not a problem to solve for them.`
      });
    }
  }
  return notes;
}

/* ------------------------------------------------------------- the main pass */

/**
 * Build suggestions for ONE employer and ONE candidate.
 *
 * Takes a single candidate on purpose. There is no multi-candidate entry point
 * anywhere in this module, which is how ERI's "do not rank candidates" and the
 * out-of-scope "applicant tracking" line are made unreachable rather than
 * merely discouraged. Passing an array throws.
 */
export function suggestMatches({ industryId, needs, candidate }) {
  if (Array.isArray(candidate)) {
    throw new TypeError('suggestMatches takes one candidate. This tool does not compare or rank people.');
  }
  if (!candidate || !Array.isArray(candidate.skills)) throw new TypeError('candidate profile with a skills list is required');

  const industry = INDUSTRY_BY_ID.get(industryId) || null;
  const candidateSkills = new Set(candidate.skills);
  const raw = [];
  const unmatchedNeeds = [];

  for (const need of needs) {
    const refs = skillRefsForNeed(need);

    if (refs.length === 0) {
      unmatchedNeeds.push({
        needId: need.id,
        text: need.text,
        reason: 'no-vocabulary-hit',
        message: 'No plain skill word was recognised in this line. Rephrase it, or pick a task from the industry list. The tool will not guess.'
      });
      continue;
    }

    const shared = refs.filter((r) => candidateSkills.has(r.skillId));
    if (shared.length === 0) {
      unmatchedNeeds.push({
        needId: need.id,
        text: need.text,
        reason: 'no-overlap',
        message: 'This need did not line up with any skill this candidate shared. That is an honest gap, and it may be what a job coach or training plan is for.'
      });
      continue;
    }

    for (const ref of shared) {
      const skill = SKILL_BY_ID.get(ref.skillId);
      const relatedTasks = industry
        ? industry.recurringTasks
            .filter((t) => t.skills.includes(ref.skillId))
            .map((t) => ({ taskId: t.id, label: t.label, viaSkillId: ref.skillId }))
        : [];
      const relatedTaskObjects = relatedTasks
        .map((rt) => (findTask(rt.taskId) || {}).task)
        .filter(Boolean);

      const interestHits = (candidate.interests || []).filter((interestId) =>
        relatedTaskObjects.some((t) => (t.area || []).includes(interestId))
      );

      raw.push({
        id: `${need.id}--${ref.skillId}`,
        need: { id: need.id, order: need.order, text: need.text, fromTaskId: need.fromTaskId },
        skill: { id: skill.id, name: skill.name },
        citations: {
          need: { source: 'employer', field: 'stated need', quote: ref.quote, via: ref.via },
          skill: { source: 'candidate', field: 'shared skills', quote: skill.name, via: candidate.source || 'the profile they shared' }
        },
        explanation: explain({
          need,
          needQuote: ref.quote,
          via: ref.via,
          candidateName: candidate.displayName,
          skillName: skill.name
        }),
        relatedTasks,
        preferenceNotes: relatedTaskObjects.flatMap((t) => preferenceNotesForTask(candidate, t)),
        interestNotes: interestHits.map((interestId) => ({
          interestId,
          text: `${candidate.displayName} named an interest in ${(INTEREST_BY_ID.get(interestId) || { name: interestId }).name}, and this kind of work sits in that area.`
        })),
        evidence: (candidate.evidence || [])
          .filter((e) => e.skill === ref.skillId)
          .map((e) => ({ kind: e.kind, caption: e.caption, forSkillId: e.skill }))
      });
    }
  }

  /* Fail-closed: anything that cannot cite both sides is dropped, and the drop
   * is reported so the interface can admit it rather than hide it. */
  const { kept, dropped } = enforceTraceability(raw);

  return {
    industry: industry ? { id: industry.id, name: industry.name } : null,
    candidate: {
      id: candidate.id,
      displayName: candidate.displayName,
      entryMode: candidate.entryMode || 'unknown',
      source: candidate.source || null,
      ownWords: candidate.ownWords || null,
      consentNote: (candidate.consent || {}).note || null
    },
    suggestions: kept,
    droppedSuggestions: dropped,
    unmatchedNeeds,
    meta: {
      needCount: needs.length,
      distinctTaskShapes: [...new Set(kept.flatMap((s) => s.relatedTasks.map((t) => t.label)))],
      ordering: 'the order you entered your needs - nothing here is sorted by goodness',
      decides: 'nothing'
    }
  };
}

/** Everything the vocabulary offers, for the manual-entry fallback UI. */
export function vocabularyForUi() {
  return { skills: SKILLS, preferences: PREFERENCES };
}
