/*
 * Skills vocabulary — synthetic, written for this hackathon.
 *
 * Deliberate choices:
 *  - Every label is a thing a person DOES ("Greet customers"), never a trait
 *    and never a level. There is no rating, no tier and no ordering: ERI §9
 *    puts applicant scoring and AI assessment of suitability out of scope, so
 *    no field here can be turned into a number.
 *  - `starters` exist so a person can SAY what they are good at by picking a
 *    sentence instead of typing one (ERI §7, "support alternatives to typed
 *    input") and so ERI §4's "I am good at…" prompt has a no-typing path.
 *  - Nothing in this file names a disability, a diagnosis or a support need.
 *    ERI §10: the product "should not require disclosure of a disability or
 *    diagnosis." Not as a field, not as a category, not as a hint.
 *  - Labels are kept in step with the P4 (Employer Hub) task vocabulary so a
 *    team can demo the P1 → P4 handoff ERI names in P4 §12.
 */

export const SKILL_GROUPS = [
  { id: 'organizing', label: 'Keeping things organized' },
  { id: 'people', label: 'Working with people' },
  { id: 'steps', label: 'Following steps' },
  { id: 'care', label: 'Taking care of a space' },
  { id: 'making', label: 'Making and handling things' }
];

export const SKILLS = [
  {
    id: 'organize-supplies',
    label: 'Organize supplies',
    group: 'organizing',
    plain: 'Put supplies where they belong so other people can find them.',
    starters: [
      'I am good at putting supplies in order.',
      'Here is something I can do: I can set up a shelf so everything is easy to find.'
    ]
  },
  {
    id: 'sort-and-label',
    label: 'Sort and label items',
    group: 'organizing',
    plain: 'Sort things into groups and put the right label on each one.',
    starters: [
      'I am good at sorting things into the right groups.',
      'Here is something I can do: I can label items so nothing gets mixed up.'
    ]
  },
  {
    id: 'count-inventory',
    label: 'Count stock',
    group: 'organizing',
    plain: 'Count what is on the shelf and write the number down.',
    starters: [
      'I am good at counting carefully.',
      'Here is something I can do: I can count stock and write down what is low.'
    ]
  },
  {
    id: 'greet-customers',
    label: 'Greet customers',
    group: 'people',
    plain: 'Say hello to people when they come in and help them feel welcome.',
    starters: [
      'I am good at making people feel welcome.',
      'Here is something I can do: I can greet customers at the door.'
    ]
  },
  {
    id: 'answer-questions',
    label: 'Help someone find what they need',
    group: 'people',
    plain: 'Listen to what a person is looking for and show them where it is.',
    starters: [
      'I am good at helping people find things.',
      'Here is something I can do: I can walk a customer to the aisle they asked for.'
    ]
  },
  {
    id: 'work-on-a-team',
    label: 'Work with a team',
    group: 'people',
    plain: 'Do my part and tell my team when I am done.',
    starters: [
      'I am good at doing my part on a team.',
      'Here is something I can do: I can tell my team when my part is finished.'
    ]
  },
  {
    id: 'follow-a-checklist',
    label: 'Follow a checklist',
    group: 'steps',
    plain: 'Work through a list in order and check off each step.',
    starters: [
      'I am good at following a checklist to the end.',
      'Here is something I can do: I can open the store using the opening checklist.'
    ]
  },
  {
    id: 'follow-safety-steps',
    label: 'Follow safety steps',
    group: 'steps',
    plain: 'Wear the right gear and do the steps in the safe order.',
    starters: [
      'I am good at doing the safety steps every time.',
      'Here is something I can do: I can put on gloves and lift the safe way.'
    ]
  },
  {
    id: 'be-on-time',
    label: 'Arrive on time and ready',
    group: 'steps',
    plain: 'Get to work on time with what I need for the shift.',
    starters: [
      'I am good at being on time.',
      'Here is something I can do: I can start my shift ready to work.'
    ]
  },
  {
    id: 'clean-work-area',
    label: 'Clean a work area',
    group: 'care',
    plain: 'Wipe down, sweep and clear a space when the work is done.',
    starters: [
      'I am good at leaving a space clean.',
      'Here is something I can do: I can clean and reset a table between customers.'
    ]
  },
  {
    id: 'water-plants',
    label: 'Care for plants',
    group: 'care',
    plain: 'Water plants on a schedule and take off the dead leaves.',
    starters: [
      'I am good at taking care of plants.',
      'Here is something I can do: I can water every plant on the list each week.'
    ]
  },
  {
    id: 'maintain-displays',
    label: 'Keep a display looking good',
    group: 'care',
    plain: 'Straighten a display so it looks full and tidy.',
    starters: [
      'I am good at making a display look tidy.',
      'Here is something I can do: I can face the shelves at the end of the day.'
    ]
  },
  {
    id: 'assemble-kits',
    label: 'Put kits together',
    group: 'making',
    plain: 'Put the same set of parts into every box or bag.',
    starters: [
      'I am good at putting kits together the same way every time.',
      'Here is something I can do: I can pack 50 kits with no parts missing.'
    ]
  },
  {
    id: 'stock-shelves',
    label: 'Stock shelves',
    group: 'making',
    plain: 'Take products out of a box and put them on the shelf in the right place.',
    starters: [
      'I am good at stocking shelves neatly.',
      'Here is something I can do: I can stock a shelf with the labels facing out.'
    ]
  },
  {
    id: 'use-a-register',
    label: 'Use a cash register',
    group: 'making',
    plain: 'Ring up a sale and hand back the right change and receipt.',
    starters: [
      'I am good at ringing up a sale.',
      'Here is something I can do: I can take a payment and give the receipt.'
    ]
  },
  {
    id: 'sort-mail',
    label: 'Sort mail and deliveries',
    group: 'organizing',
    plain: 'Put mail and packages in the right bin or desk.',
    starters: [
      'I am good at getting mail to the right person.',
      'Here is something I can do: I can sort the morning mail by department.'
    ]
  }
];

export const SKILL_IDS = SKILLS.map((s) => s.id);

/** Find a vocabulary entry by id. Returns undefined for a custom skill. */
export function findSkill(id) {
  return SKILLS.find((s) => s.id === id);
}

/** Skills grouped for a pick-from-a-list control. Group order is as authored. */
export function skillsByGroup() {
  return SKILL_GROUPS.map((g) => ({
    ...g,
    skills: SKILLS.filter((s) => s.group === g.id)
  }));
}
