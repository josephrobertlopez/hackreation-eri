/*
 * The prepared portfolio from ERI's suggested demo (§6):
 *
 *   "A job seeker creates a portfolio showing that they can organize supplies,
 *    greet customers, and follow a checklist. An employer opens the portfolio
 *    and reviews those skills."
 *
 * Built by calling the real API in web/portfolio.js, not by hand-writing a blob
 * of state. If a rule in `addSkill`/`addExample` would refuse this data, the
 * import throws and the tests go red — the sample cannot drift out of the rules.
 *
 * "Jamie Rivera" is invented. Nothing here describes a real person. ERI §10.
 */

import { emptyPortfolio, setProfile, addSkill, addStatement, addExample } from '../web/portfolio.js';
import { findSkill } from './skills.js';
import { findWorkExample, toExampleInput } from './work-examples.js';

/** ERI's three demo skills, in the order ERI names them. */
export const SAMPLE_SKILL_IDS = ['organize-supplies', 'greet-customers', 'follow-a-checklist'];

const SAMPLE_EXAMPLES = [
  ['ex-supply-shelf', 'organize-supplies'],
  ['ex-front-counter', 'greet-customers'],
  ['ex-greeting-audio', 'greet-customers'],
  ['ex-checklist-done', 'follow-a-checklist']
];

export function samplePortfolio() {
  let p = emptyPortfolio();
  p = setProfile(p, {
    displayName: 'Jamie R.',
    interests: ['Plants and gardens', 'Trains and buses', 'Helping people'],
    activities: ['Working with people', 'The same routine each day', 'Mornings']
  });

  for (const id of SAMPLE_SKILL_IDS) {
    const skill = findSkill(id);
    p = addSkill(p, { id: skill.id, label: skill.label, source: 'list', plain: skill.plain });
    p = addStatement(p, skill.id, skill.starters[0]);
  }

  for (const [exampleId, skillId] of SAMPLE_EXAMPLES) {
    p = addExample(p, toExampleInput(findWorkExample(exampleId), skillId));
  }
  return p;
}
