// =====================================================================
// TASK FILE: Sort the Mail Cart
// =====================================================================
// A job coach can edit this file. See fixtures/README.md first.
// Change only the words between the quote marks.
// Check your work:  node scripts/validate-task.mjs fixtures/sort-the-mail-cart.js
// =====================================================================

export const task = {
  id: 'sort-the-mail-cart',
  title: 'Sort the Mail Cart',
  where: 'Mail room, first floor',
  summary: 'Put the mail into the right bins for each floor.',

  steps: [
    {
      id: 'read-floor',
      title: 'Read the floor number',
      text: 'Pick up one letter. Read the floor number on the label.',
      image: {
        title: 'A letter with a floor number on the label',
        desc: 'An envelope. The address label shows the number 2 for floor two.',
        svg: `<svg viewBox="0 0 120 90" role="img" aria-labelledby="smc1t smc1d" focusable="false">
  <title id="smc1t">A letter with a floor number on the label</title>
  <desc id="smc1d">An envelope. The address label shows the number 2 for floor two.</desc>
  <rect x="2" y="2" width="116" height="86" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="24" y="26" width="72" height="44" fill="none" stroke="currentColor" stroke-width="3"/>
  <path d="M24 26 L60 50 L96 26" fill="none" stroke="currentColor" stroke-width="3"/>
  <rect x="64" y="54" width="26" height="12" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="77" y="64" font-size="10" text-anchor="middle" fill="currentColor">2</text>
</svg>`
      },
      audioTranscript: 'Pick up one letter. Read the floor number on the label.'
    },
    {
      id: 'match-bin',
      title: 'Find the matching bin',
      text: 'Each bin has a floor number. Find the bin with the same number.',
      image: {
        title: 'Three bins numbered one, two and three',
        desc: 'Three open bins stand in a row. Each bin has a number on the front.',
        svg: `<svg viewBox="0 0 120 90" role="img" aria-labelledby="smc2t smc2d" focusable="false">
  <title id="smc2t">Three bins numbered one, two and three</title>
  <desc id="smc2d">Three open bins stand in a row. Each bin has a number on the front.</desc>
  <rect x="2" y="2" width="116" height="86" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="14" y="36" width="28" height="34" fill="none" stroke="currentColor" stroke-width="3"/>
  <text x="28" y="60" font-size="14" text-anchor="middle" fill="currentColor">1</text>
  <rect x="46" y="36" width="28" height="34" fill="none" stroke="currentColor" stroke-width="3"/>
  <text x="60" y="60" font-size="14" text-anchor="middle" fill="currentColor">2</text>
  <rect x="78" y="36" width="28" height="34" fill="none" stroke="currentColor" stroke-width="3"/>
  <text x="92" y="60" font-size="14" text-anchor="middle" fill="currentColor">3</text>
</svg>`
      },
      audioTranscript: 'Each bin has a floor number. Find the bin with the same number.'
    },
    {
      id: 'drop-mail',
      title: 'Put the letter in the bin',
      text: 'Put the letter in the bin. Then pick up the next letter.',
      image: {
        title: 'A letter dropping into a bin',
        desc: 'A hand holds an envelope above an open bin and lets it fall in.',
        svg: `<svg viewBox="0 0 120 90" role="img" aria-labelledby="smc3t smc3d" focusable="false">
  <title id="smc3t">A letter dropping into a bin</title>
  <desc id="smc3d">A hand holds an envelope above an open bin and lets it fall in.</desc>
  <rect x="2" y="2" width="116" height="86" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="42" y="16" width="36" height="22" fill="none" stroke="currentColor" stroke-width="3"/>
  <path d="M42 16 L60 28 L78 16" fill="none" stroke="currentColor" stroke-width="3"/>
  <line x1="60" y1="42" x2="60" y2="52" stroke="currentColor" stroke-width="3"/>
  <path d="M54 48 l6 8 l6 -8" fill="none" stroke="currentColor" stroke-width="3"/>
  <rect x="38" y="58" width="44" height="22" fill="none" stroke="currentColor" stroke-width="3"/>
</svg>`
      },
      audioTranscript: 'Put the letter in the bin. Then pick up the next letter.'
    }
  ]
};
