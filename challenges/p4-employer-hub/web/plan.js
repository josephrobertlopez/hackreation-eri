/*
 * The employer action plan. ERI's §6 step 6 and §9 bullet 5.
 *
 * Also ERI's §7, which asks for something specific and easy to miss: the
 * demonstration ends with "questions the employer and candidate can discuss
 * with an employment specialist". So the plan's job is to hand the conversation
 * to people, with a written artifact they can both look at.
 *
 * Every step is an action for a HUMAN. Nothing here approves, denies, hires,
 * screens or decides - web/guards.js findDecisionLanguage() fails the suite if
 * decision language ever creeps into these strings.
 */

import { RESOURCES, LEGAL_REFERRAL, DECISION_NOTICE, resourcesForStep } from '../fixtures/resources.js';

/**
 * A draft set of responsibilities, grouped from the suggestions. ERI's §4
 * "job task development": help the employer see what COMBINATION of tasks could
 * add up to a real job. Each line still names the need and skill it came from,
 * so the bundle inherits the traceability of its parts.
 */
export function draftTaskBundle(result) {
  const byTask = new Map();

  for (const s of result.suggestions) {
    for (const rt of s.relatedTasks) {
      if (!byTask.has(rt.label)) byTask.set(rt.label, { label: rt.label, taskId: rt.taskId, becauseOf: [] });
      byTask.get(rt.label).becauseOf.push({
        needId: s.need.id,
        needQuote: s.citations.need.quote,
        skillId: s.skill.id,
        skillQuote: s.citations.skill.quote
      });
    }
  }

  /* Insertion order = the employer's need order, because suggestions already
   * arrive in it. Not sorted, and deliberately not sorted. */
  return [...byTask.values()];
}

/**
 * The plan. Fixed steps, filled in with the session's own citations.
 * `cites` is empty for the generic steps and populated where a step exists
 * because of something the employer or candidate actually said.
 */
export function buildActionPlan(result) {
  const name = result.candidate.displayName;
  const bundle = draftTaskBundle(result);
  const steps = [];

  steps.push({
    step: 1,
    heading: 'Read the suggestions back and cross out the wrong ones',
    detail: 'You know your floor. Anything here that does not match how the work really runs should go. The tool has no opinion about that.',
    cites: []
  });

  if (bundle.length) {
    steps.push({
      step: 2,
      heading: 'Mark up a draft set of responsibilities',
      detail: `There are ${bundle.length === 1 ? 'one draft responsibility' : 'several draft responsibilities'} below, each one built from a need you typed. Decide which belong together as one role, and what you would pay for it.`,
      cites: bundle.flatMap((b) => b.becauseOf.map((c) => ({ needId: c.needId, needQuote: c.needQuote, skillQuote: c.skillQuote })))
    });
  }

  steps.push({
    step: bundle.length ? 3 : 2,
    heading: `Share the draft with ${name} and ask what they would change`,
    detail: 'They are the authority on their own work. This is the point at which the tool stops being useful and a conversation starts.',
    cites: []
  });

  steps.push({
    step: bundle.length ? 4 : 3,
    heading: 'Bring an employment specialist into the conversation',
    detail: 'A job developer or employment specialist does this for a living: shaping tasks, arranging a trial, sorting training and follow-along support. Wisconsin DVR and ERI Business Services are both below.',
    cites: []
  });

  steps.push({
    step: bundle.length ? 5 : 4,
    heading: 'Decide how the work will be taught, before the first day',
    detail: `${name} said how they like to be shown a task. Write the training down in that form - a checklist, a demonstration, a short video - and name the one person they can ask questions.`,
    cites: result.suggestions
      .flatMap((s) => s.preferenceNotes)
      .filter((n) => n.label === 'fits')
      .slice(0, 3)
      .map((n) => ({ preferenceId: n.preferenceId, note: n.text }))
  });

  const gaps = result.unmatchedNeeds.map((u) => ({
    needId: u.needId,
    text: u.text,
    talkAbout:
      u.reason === 'no-overlap'
        ? 'Nothing in the shared profile lines up with this one. Ask whether training, a different task split, or a second person is the answer.'
        : 'The tool recognised no skill words here. Say it a different way, or pick the closest task from the industry list.'
  }));

  return {
    heading: `Draft action plan: ${result.industry ? result.industry.name : 'your business'} and ${name}`,
    decisionNotice: DECISION_NOTICE,
    draftResponsibilities: bundle,
    steps,
    questionsForSpecialist: QUESTIONS_FOR_SPECIALIST,
    openQuestions: gaps,
    legalReferral: LEGAL_REFERRAL,
    resources: [
      ...resourcesForStep('next-steps'),
      ...resourcesForStep('accommodation-request').filter((r) => !resourcesForStep('next-steps').includes(r))
    ],
    allResources: RESOURCES,
    provenance: {
      builtFrom: 'the needs you typed and the skills the candidate shared, nothing else',
      storedAnywhere: 'no - this page keeps nothing and sends nothing',
      decides: 'nothing'
    }
  };
}

/*
 * ERI's §7 asks for these explicitly. Fixed list, written as questions for two
 * people and a specialist to answer together - never as questions about a
 * disability, and never as questions this tool answers.
 */
export const QUESTIONS_FOR_SPECIALIST = [
  'Which of these tasks is genuinely recurring, and which is seasonal?',
  'If we bundled three of these into one part-time role, what would a normal week look like?',
  'How is this work taught today, and would writing that down as a checklist help everyone?',
  'Who is the one person this new starter asks when something is unclear?',
  'What does a paid work trial look like here, and who arranges it?',
  'What training or follow-along support is available, and who pays for it?',
  'If the new starter asks us for a change to how the work is done, who do we call for help thinking it through?',
  'What would make us say, three months in, that this went well?'
];
