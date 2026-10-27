/*
 * Fictional candidate profiles. Every one of these people is invented.
 *
 * SHAPE NOTE (the design call — see spec/acceptance.md, P4-M3):
 * ERI's §6 step 3 has the EMPLOYER typing the candidate's skills. We default to
 * loading a profile instead, in the shape a person would have sent it, because
 * an employer narrating a disabled person's abilities is the exact framing
 * ERI's §10 guards against. Manual entry still exists as a fallback for the
 * employer who has no profile in front of them.
 *
 * The field list is the contract with a sibling project (P1 Show Your Skills).
 * Skill, interest and preference ids come from fixtures/vocabulary.js, so a P1
 * portfolio can emit them and this hub reads them with no translation.
 *
 * There is no disability field, no diagnosis field, no medical field, and no
 * free-text "about their condition" field. Not hidden, not optional: absent.
 * test/guards.test.js fails if one ever appears.
 *
 * `consent` is load-bearing, not decoration. ERI's §10 bullet 2 asks for
 * permission before candidate portfolio information is shared, so
 * loadCandidate() in web/match.js refuses a profile whose consent is missing
 * or not approved. test/guards.test.js proves the refusal by tampering.
 */

export const CANDIDATES = [
  {
    id: 'cand-avery',
    displayName: 'Avery (fictional)',
    source: 'Show Your Skills portfolio (sample)',
    sharedOn: '2026-10-20',
    consent: {
      shareApproved: true,
      approvedOn: '2026-10-20',
      scope: 'skills, interests and work preferences only',
      sharedWith: 'this employer, for this conversation',
      note: 'Avery chose which parts of their portfolio to share. Nothing about health or disability is included, and the employer did not ask.'
    },
    ownWords: 'I like knowing where everything goes. If you show me the system once I will keep it that way.',
    skills: ['organizing', 'sorting', 'counting-stock', 'attention-to-detail', 'labelling', 'restocking-shelves', 'following-checklists'],
    interests: ['merchandise-and-retail', 'tidy-spaces'],
    preferences: ['routine-work', 'no-customer-contact', 'set-schedule', 'part-time', 'demonstrated-instructions'],
    evidence: [
      { skill: 'organizing', kind: 'photo set', caption: 'Before and after photos of a reorganized storage room at a volunteer shop.' },
      { skill: 'counting-stock', kind: 'work sample', caption: 'A stock count sheet Avery filled in over four weeks.' }
    ]
  },
  {
    id: 'cand-bo',
    displayName: 'Bo (fictional)',
    source: 'Show Your Skills portfolio (sample)',
    sharedOn: '2026-10-21',
    consent: {
      shareApproved: true,
      approvedOn: '2026-10-21',
      scope: 'skills, interests and work preferences only',
      sharedWith: 'this employer, for this conversation',
      note: 'Bo asked their job developer to send the skills page only.'
    },
    ownWords: 'I am fast on a keyboard and I spot the rows that do not add up.',
    skills: ['data-entry', 'attention-to-detail', 'careful-repetition', 'filing', 'written-notes', 'scanning-barcodes'],
    interests: ['computers-and-data', 'books-and-paper'],
    preferences: ['seated-work', 'quiet-space', 'working-alone', 'written-instructions', 'part-time'],
    evidence: [
      { skill: 'data-entry', kind: 'work sample', caption: '300 rows typed from scanned forms with two corrections.' },
      { skill: 'attention-to-detail', kind: 'written description', caption: 'Bo describes the check they run before sending a file.' }
    ]
  },
  {
    id: 'cand-cass',
    displayName: 'Cass (fictional)',
    source: 'Show Your Skills portfolio (sample)',
    sharedOn: '2026-10-19',
    consent: {
      shareApproved: true,
      approvedOn: '2026-10-19',
      scope: 'skills, interests and work preferences only',
      sharedWith: 'this employer, for this conversation',
      note: 'Cass shared this after meeting the employer at a job fair.'
    },
    ownWords: 'Plants are the thing. I did the watering round at the community garden for two summers.',
    skills: ['plant-care', 'site-route', 'following-checklists', 'cleaning', 'light-lifting', 'measuring'],
    interests: ['plants-and-outdoors', 'tidy-spaces'],
    preferences: ['routine-work', 'moving-around', 'working-alone', 'set-schedule', 'demonstrated-instructions'],
    evidence: [
      { skill: 'plant-care', kind: 'video', caption: 'Two minutes of Cass running the watering round, with their own narration.' }
    ]
  },
  {
    id: 'cand-dee',
    displayName: 'Dee (fictional)',
    source: 'Show Your Skills portfolio (sample)',
    sharedOn: '2026-10-22',
    consent: {
      shareApproved: true,
      approvedOn: '2026-10-22',
      scope: 'skills, interests and work preferences only',
      sharedWith: 'this employer, for this conversation',
      note: 'Dee wrote the summary themselves and approved sending it.'
    },
    ownWords: 'I like people. I would rather be out front than in a back room.',
    skills: ['greeting-customers', 'answering-questions', 'cleaning', 'display-setup', 'organizing'],
    interests: ['helping-people', 'merchandise-and-retail'],
    preferences: ['working-with-others', 'customer-contact', 'variety', 'moving-around', 'one-point-of-contact'],
    evidence: [
      { skill: 'greeting-customers', kind: 'audio', caption: 'Dee recorded how they welcome someone into a shop.' }
    ]
  },
  {
    id: 'cand-emi',
    displayName: 'Emi (fictional)',
    source: 'Show Your Skills portfolio (sample)',
    sharedOn: '2026-10-18',
    consent: {
      shareApproved: true,
      approvedOn: '2026-10-18',
      scope: 'skills, interests and work preferences only',
      sharedWith: 'this employer, for this conversation',
      note: 'Emi shared the kitchen section of their portfolio only.'
    },
    ownWords: 'Give me the prep list and the same bench every day and I am happy.',
    skills: ['food-prep', 'dishwashing', 'measuring', 'careful-repetition', 'following-checklists', 'equipment-checks'],
    interests: ['food-and-kitchen', 'making-and-building'],
    preferences: ['routine-work', 'no-customer-contact', 'quiet-space', 'set-schedule', 'written-instructions'],
    evidence: [
      { skill: 'food-prep', kind: 'photo set', caption: 'Trays Emi prepped on a community kitchen shift.' }
    ]
  }
];

export const CANDIDATE_BY_ID = new Map(CANDIDATES.map((c) => [c.id, c]));

/* ERI's §7 demonstration: a retail business, and a fictional job seeker with
 * strong organizational skills who enjoys routine work with merchandise. */
export const DEMO = {
  industryId: 'retail',
  candidateId: 'cand-avery',
  needs: [
    'We never know our real inventory until someone counts it.',
    'Nobody has time to organize the merchandise in the stockroom.',
    'New stock sits in the back room with no price tags for days.',
    'The shelves need facing and restocking before we open.',
    'Our product displays go messy by Thursday and nobody resets them.'
  ]
};
