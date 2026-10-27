// =====================================================================
// TASK FILE: Wipe the Break Room Tables
// =====================================================================
// A job coach can edit this file. See fixtures/README.md first.
// Change only the words between the quote marks.
// Check your work:  node scripts/validate-task.mjs fixtures/wipe-the-break-room.js
// =====================================================================

export const task = {
  id: 'wipe-the-break-room',
  title: 'Wipe the Break Room Tables',
  where: 'Break room, second floor',
  summary: 'Clean the four tables in the break room.',

  steps: [
    {
      id: 'get-cleaner',
      title: 'Get the cleaner and cloths',
      text: 'Take the spray bottle and two cloths from the cart.',
      image: {
        title: 'A spray bottle and two folded cloths',
        desc: 'A spray bottle stands beside two folded cloths on a shelf.',
        svg: `<svg viewBox="0 0 120 90" role="img" aria-labelledby="wbr1t wbr1d" focusable="false">
  <title id="wbr1t">A spray bottle and two folded cloths</title>
  <desc id="wbr1d">A spray bottle stands beside two folded cloths on a shelf.</desc>
  <rect x="2" y="2" width="116" height="86" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="26" y="34" width="22" height="32" rx="3" fill="none" stroke="currentColor" stroke-width="3"/>
  <path d="M30 34 v-8 h14 v8" fill="none" stroke="currentColor" stroke-width="3"/>
  <path d="M44 26 h12 l-6 6" fill="none" stroke="currentColor" stroke-width="3"/>
  <rect x="66" y="42" width="30" height="10" fill="none" stroke="currentColor" stroke-width="3"/>
  <rect x="66" y="56" width="30" height="10" fill="none" stroke="currentColor" stroke-width="3"/>
  <line x1="12" y1="74" x2="108" y2="74" stroke="currentColor" stroke-width="4"/>
</svg>`
      },
      audioTranscript: 'Take the spray bottle and two cloths from the cart.'
    },
    {
      id: 'clear-tables',
      title: 'Clear the tables',
      text: 'Move the cups and papers off the table. Throw away trash.',
      image: {
        title: 'An empty table and a bin',
        desc: 'A table with nothing on it. A trash bin stands next to it.',
        svg: `<svg viewBox="0 0 120 90" role="img" aria-labelledby="wbr2t wbr2d" focusable="false">
  <title id="wbr2t">An empty table and a bin</title>
  <desc id="wbr2d">A table with nothing on it. A trash bin stands next to it.</desc>
  <rect x="2" y="2" width="116" height="86" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <line x1="14" y1="40" x2="70" y2="40" stroke="currentColor" stroke-width="4"/>
  <line x1="20" y1="40" x2="20" y2="72" stroke="currentColor" stroke-width="3"/>
  <line x1="64" y1="40" x2="64" y2="72" stroke="currentColor" stroke-width="3"/>
  <path d="M84 40 h22 l-4 32 h-14 z" fill="none" stroke="currentColor" stroke-width="3"/>
  <line x1="80" y1="40" x2="110" y2="40" stroke="currentColor" stroke-width="3"/>
</svg>`
      },
      audioTranscript: 'Move the cups and papers off the table. Throw away trash.'
    },
    {
      id: 'spray-and-wipe',
      title: 'Spray and wipe',
      text: 'Spray the table. Wipe it with the cloth. Wipe the whole top.',
      image: {
        title: 'A hand wiping a table top',
        desc: 'A cloth moves across a table top in a straight line.',
        svg: `<svg viewBox="0 0 120 90" role="img" aria-labelledby="wbr3t wbr3d" focusable="false">
  <title id="wbr3t">A hand wiping a table top</title>
  <desc id="wbr3d">A cloth moves across a table top in a straight line.</desc>
  <rect x="2" y="2" width="116" height="86" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <line x1="14" y1="54" x2="106" y2="54" stroke="currentColor" stroke-width="4"/>
  <rect x="40" y="34" width="26" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="3"/>
  <path d="M70 40 h18" fill="none" stroke="currentColor" stroke-width="3"/>
  <path d="M84 34 l8 6 l-8 6" fill="none" stroke="currentColor" stroke-width="3"/>
  <line x1="24" y1="54" x2="24" y2="76" stroke="currentColor" stroke-width="3"/>
  <line x1="96" y1="54" x2="96" y2="76" stroke="currentColor" stroke-width="3"/>
</svg>`
      },
      audioTranscript: 'Spray the table. Wipe it with the cloth. Wipe the whole top.'
    },
    {
      id: 'put-back',
      title: 'Put the supplies back',
      text: 'Put the spray and cloths back on the cart. You are done.',
      image: {
        title: 'Supplies back on the cart',
        desc: 'The spray bottle and cloths sit back on the cleaning cart.',
        svg: `<svg viewBox="0 0 120 90" role="img" aria-labelledby="wbr4t wbr4d" focusable="false">
  <title id="wbr4t">Supplies back on the cart</title>
  <desc id="wbr4d">The spray bottle and cloths sit back on the cleaning cart.</desc>
  <rect x="2" y="2" width="116" height="86" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="30" y="26" width="18" height="26" rx="3" fill="none" stroke="currentColor" stroke-width="3"/>
  <rect x="58" y="36" width="28" height="16" fill="none" stroke="currentColor" stroke-width="3"/>
  <line x1="18" y1="56" x2="100" y2="56" stroke="currentColor" stroke-width="4"/>
  <circle cx="34" cy="70" r="8" fill="none" stroke="currentColor" stroke-width="3"/>
  <circle cx="84" cy="70" r="8" fill="none" stroke="currentColor" stroke-width="3"/>
</svg>`
      },
      audioTranscript: 'Put the spray and cloths back on the cart. You are done.'
    }
  ]
};
