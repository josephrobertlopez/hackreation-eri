/*
 * Sample work examples — synthetic. No real person, workplace or recording.
 * ERI §10: "sample media should be used for the hackathon."
 *
 * Every entry carries its own text alternative, and the kind decides which one
 * is required (ERI §7: "labels or text alternatives for images and captions or
 * transcripts for audio/video"):
 *
 *   photo    -> alt         (what the picture shows)
 *   video    -> caption     (what happens, in order) + alt for the still
 *   audio    -> transcript  (the words, written out)
 *   written  -> body        (the example itself is the text)
 *
 * `addExample()` in web/portfolio.js refuses an example that is missing the
 * text alternative its kind requires. That refusal is the enforcement; this
 * file is just the sample data that satisfies it.
 *
 * The audio and video entries are STAND-INS. This prototype records nothing and
 * ships no media files, so those two entries carry a poster drawing plus the
 * full transcript or caption. They are labelled as stand-ins in the UI, not
 * passed off as recordings.
 */

export const WORK_EXAMPLES = [
  {
    id: 'ex-supply-shelf',
    skillIds: ['organize-supplies', 'sort-and-label'],
    kind: 'photo',
    title: 'Supply shelf I set up',
    mediaId: 'photo-supply-shelf',
    alt: 'A supply shelf with boxes in a row, labeled jars, and squared stacks of paper.',
    note: 'I set up this shelf at my work training. Everything has a label.'
  },
  {
    id: 'ex-front-counter',
    skillIds: ['greet-customers', 'answer-questions'],
    kind: 'photo',
    title: 'The front counter I get ready',
    mediaId: 'photo-front-counter',
    alt: 'A clean service counter with a Hello sign, and two people facing each other across it.',
    note: 'I open the counter and say hello to each person who comes in.'
  },
  {
    id: 'ex-checklist-done',
    skillIds: ['follow-a-checklist', 'be-on-time'],
    kind: 'photo',
    title: 'My opening checklist, finished',
    mediaId: 'photo-checklist-done',
    alt: 'A clipboard with a three-task list. Every box has a check mark.',
    note: 'I do every step on the list before the store opens.'
  },
  {
    id: 'ex-greeting-audio',
    skillIds: ['greet-customers'],
    kind: 'audio',
    title: 'How I greet a customer',
    mediaId: 'audio-poster',
    sampleStandIn: true,
    transcript:
      'Good morning, welcome in. If you need anything, I am right here at the counter. ' +
      'Would you like a basket today?',
    note: 'This is what I say when someone comes in.'
  },
  {
    id: 'ex-stocking-video',
    skillIds: ['stock-shelves', 'maintain-displays'],
    kind: 'video',
    title: 'Stocking a shelf, start to finish',
    mediaId: 'video-poster',
    sampleStandIn: true,
    alt: 'A video still with a play triangle.',
    caption:
      'I open the box and check the labels. ' +
      'I put the oldest product at the front and the new product behind it. ' +
      'I turn every label to face out. ' +
      'I flatten the empty box and take it to the back.',
    note: 'Four steps. I do them in the same order every time.'
  },
  {
    id: 'ex-kit-count',
    skillIds: ['assemble-kits', 'count-inventory'],
    kind: 'written',
    title: 'Fifty kits, nothing missing',
    body:
      'At my work training I packed fifty welcome kits. ' +
      'Each kit needed a folder, a pen and two forms. ' +
      'I laid the parts out in four piles and took one from each pile. ' +
      'My supervisor checked ten kits and all ten were right.',
    note: 'I like work where I can set up the parts first.'
  },
  {
    id: 'ex-mail-sort',
    skillIds: ['sort-mail'],
    kind: 'written',
    title: 'Morning mail route',
    body:
      'I sort the morning mail into five bins, one for each department. ' +
      'Anything with no department goes in the front office bin. ' +
      'I take the bins around before ten o clock.',
    note: 'I learned the five bins in two days.'
  },
  {
    id: 'ex-plant-round',
    skillIds: ['water-plants', 'clean-work-area'],
    kind: 'written',
    title: 'Weekly plant round',
    body:
      'There are twelve plants on my list. ' +
      'I water them every Tuesday and take off the dead leaves. ' +
      'I wipe up any water on the floor so nobody slips.',
    note: 'I have not missed a Tuesday.'
  }
];

export const WORK_EXAMPLE_IDS = WORK_EXAMPLES.map((e) => e.id);

/** Sample examples offered for a given skill id. Empty array is fine. */
export function examplesForSkill(skillId) {
  return WORK_EXAMPLES.filter((e) => e.skillIds.includes(skillId));
}

export function findWorkExample(id) {
  return WORK_EXAMPLES.find((e) => e.id === id);
}

/**
 * Shape a sample example for `addExample()` under one chosen skill.
 * The sample belongs to several skills; the portfolio entry belongs to one, so
 * the id is suffixed and the same sample can be used under two skills.
 */
export function toExampleInput(workExample, skillId) {
  return {
    id: workExample.id + '--' + skillId,
    skillId,
    kind: workExample.kind,
    title: workExample.title,
    mediaId: workExample.mediaId || '',
    alt: workExample.alt || '',
    caption: workExample.caption || '',
    transcript: workExample.transcript || '',
    body: workExample.body || '',
    note: workExample.note || '',
    sampleStandIn: workExample.sampleStandIn === true
  };
}
