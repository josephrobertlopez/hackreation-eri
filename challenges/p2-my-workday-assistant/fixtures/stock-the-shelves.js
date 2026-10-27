// =====================================================================
// TASK FILE: Stock the Shelves
// =====================================================================
// This is a TASK GUIDE. A job coach can edit this file in any text
// editor. You do not need to be a programmer. Read the comments and
// change the words inside the quote marks.
//
// Rules for editing:
//   1. Keep every quote mark ('). Change only the words between them.
//   2. One short sentence at a time. Ten words or fewer is best.
//   3. Every step needs text, a picture and an audio transcript.
//   4. When you are done, check your file:
//        node scripts/validate-task.mjs fixtures/stock-the-shelves.js
//      It will tell you, in plain words, if anything is missing.
//
// This guide is ERI's suggested demo (problem statement section 6). It
// has FIVE steps, because ERI's success criteria (section 8) ask for a
// sample five-step task. ERI's four demo actions are steps 2 to 5.
// =====================================================================

export const task = {
  // A short id. Lower case, dashes instead of spaces. Must be unique.
  id: 'stock-the-shelves',

  // The name the worker sees on the task list.
  title: 'Stock the Shelves',

  // Where the task happens. Keep it short.
  where: 'Aisle 3, grocery side',

  // One sentence that says what the task is.
  summary: 'Put the new product on the shelves in aisle 3.',

  // The steps, in order. The worker sees one step at a time.
  steps: [
    {
      id: 'find-aisle',
      title: 'Find aisle 3',
      text: 'Walk to aisle 3. The sign hangs above the shelf.',
      image: {
        title: 'An aisle sign with the number 3',
        desc: 'A sign hangs above a shelf. The sign shows the number 3.',
        svg: `<svg viewBox="0 0 120 90" role="img" aria-labelledby="sts1t sts1d" focusable="false">
  <title id="sts1t">An aisle sign with the number 3</title>
  <desc id="sts1d">A sign hangs above a shelf. The sign shows the number 3.</desc>
  <rect x="2" y="2" width="116" height="86" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <line x1="60" y1="8" x2="60" y2="20" stroke="currentColor" stroke-width="3"/>
  <rect x="38" y="20" width="44" height="30" rx="4" fill="none" stroke="currentColor" stroke-width="3"/>
  <text x="60" y="44" font-size="22" text-anchor="middle" fill="currentColor">3</text>
  <line x1="14" y1="66" x2="106" y2="66" stroke="currentColor" stroke-width="4"/>
  <line x1="14" y1="80" x2="106" y2="80" stroke="currentColor" stroke-width="4"/>
</svg>`
      },
      audioTranscript: 'Walk to aisle 3. The sign hangs above the shelf.'
    },
    {
      id: 'gather-supplies',
      title: 'Get your supplies',
      text: 'Get a cart. Get a box cutter. Bring both to the aisle.',
      image: {
        title: 'A cart holding two boxes',
        desc: 'A flat cart on four wheels. Two closed boxes sit on top.',
        svg: `<svg viewBox="0 0 120 90" role="img" aria-labelledby="sts2t sts2d" focusable="false">
  <title id="sts2t">A cart holding two boxes</title>
  <desc id="sts2d">A flat cart on four wheels. Two closed boxes sit on top.</desc>
  <rect x="2" y="2" width="116" height="86" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="24" y="24" width="30" height="24" fill="none" stroke="currentColor" stroke-width="3"/>
  <rect x="60" y="24" width="30" height="24" fill="none" stroke="currentColor" stroke-width="3"/>
  <line x1="18" y1="56" x2="100" y2="56" stroke="currentColor" stroke-width="4"/>
  <circle cx="34" cy="70" r="8" fill="none" stroke="currentColor" stroke-width="3"/>
  <circle cx="84" cy="70" r="8" fill="none" stroke="currentColor" stroke-width="3"/>
</svg>`
      },
      audioTranscript: 'Get a cart. Get a box cutter. Bring both to the aisle.'
    },
    {
      id: 'check-labels',
      title: 'Check the product labels',
      text: 'Read the label on the box. Find the same label on the shelf.',
      image: {
        title: 'A box label seen through a magnifying glass',
        desc: 'A box with a label. A magnifying glass is held over the label.',
        svg: `<svg viewBox="0 0 120 90" role="img" aria-labelledby="sts3t sts3d" focusable="false">
  <title id="sts3t">A box label seen through a magnifying glass</title>
  <desc id="sts3d">A box with a label. A magnifying glass is held over the label.</desc>
  <rect x="2" y="2" width="116" height="86" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="16" y="26" width="48" height="40" fill="none" stroke="currentColor" stroke-width="3"/>
  <rect x="24" y="36" width="32" height="12" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="82" cy="44" r="16" fill="none" stroke="currentColor" stroke-width="3"/>
  <line x1="93" y1="56" x2="104" y2="68" stroke="currentColor" stroke-width="4"/>
</svg>`
      },
      audioTranscript: 'Read the label on the box. Find the same label on the shelf.'
    },
    {
      id: 'place-product',
      title: 'Put the product on the shelf',
      text: 'Put the oldest product in front. Put the new product behind it.',
      image: {
        title: 'Products placed in a row on a shelf',
        desc: 'A shelf holds four cans in a row. A hand adds one more.',
        svg: `<svg viewBox="0 0 120 90" role="img" aria-labelledby="sts4t sts4d" focusable="false">
  <title id="sts4t">Products placed in a row on a shelf</title>
  <desc id="sts4d">A shelf holds four cans in a row. A hand adds one more.</desc>
  <rect x="2" y="2" width="116" height="86" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <line x1="12" y1="62" x2="108" y2="62" stroke="currentColor" stroke-width="4"/>
  <rect x="18" y="38" width="16" height="24" fill="none" stroke="currentColor" stroke-width="3"/>
  <rect x="40" y="38" width="16" height="24" fill="none" stroke="currentColor" stroke-width="3"/>
  <rect x="62" y="38" width="16" height="24" fill="none" stroke="currentColor" stroke-width="3"/>
  <rect x="84" y="38" width="16" height="24" fill="none" stroke="currentColor" stroke-width="3"/>
  <path d="M84 30 q8 -14 20 -6" fill="none" stroke="currentColor" stroke-width="3"/>
</svg>`
      },
      audioTranscript: 'Put the oldest product in front. Put the new product behind it.'
    },
    {
      id: 'clean-up',
      title: 'Clean up and finish',
      text: 'Flatten the empty boxes. Put the cart back. Tell your supervisor.',
      image: {
        title: 'A broom and a flattened box',
        desc: 'A broom leans next to a flat folded box. The floor is clear.',
        svg: `<svg viewBox="0 0 120 90" role="img" aria-labelledby="sts5t sts5d" focusable="false">
  <title id="sts5t">A broom and a flattened box</title>
  <desc id="sts5d">A broom leans next to a flat folded box. The floor is clear.</desc>
  <rect x="2" y="2" width="116" height="86" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <line x1="36" y1="18" x2="30" y2="58" stroke="currentColor" stroke-width="3"/>
  <path d="M22 58 h18 l4 14 h-26 z" fill="none" stroke="currentColor" stroke-width="3"/>
  <rect x="60" y="56" width="44" height="12" fill="none" stroke="currentColor" stroke-width="3"/>
  <line x1="12" y1="78" x2="108" y2="78" stroke="currentColor" stroke-width="4"/>
</svg>`
      },
      audioTranscript: 'Flatten the empty boxes. Put the cart back. Tell your supervisor.'
    }
  ]
};
