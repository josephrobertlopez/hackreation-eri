/*
 * Sample imagery for Show Your Skills. ERI problem statement §10: "sample media
 * should be used for the hackathon." Nothing here is a real person's recording.
 *
 * Every entry is inline SVG so an exported portfolio file is self-contained and
 * works with no network and no other files next to it. No binary assets.
 * Every SVG carries <title> (short name) and <desc> (long description), and
 * every entry also carries `alt` for the HTML <img>/<figure> path.
 *
 * `fixtures/media/*.svg` are generated from this file by
 * `node fixtures/write-media-files.mjs`; test/fixtures.test.js fails if they drift.
 */

const PHOTO_SUPPLY_SHELF = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="t-shelf d-shelf">
  <title id="t-shelf">A supply shelf after it was organized</title>
  <desc id="d-shelf">Three shelves. The top shelf holds four boxes of the same size lined up in a row. The middle shelf holds six labeled jars. The bottom shelf holds stacked paper, squared to the edge.</desc>
  <rect width="320" height="200" fill="#f4f1ea"/>
  <rect x="24" y="24" width="272" height="152" fill="none" stroke="#6b5e4a" stroke-width="4"/>
  <line x1="24" y1="76" x2="296" y2="76" stroke="#6b5e4a" stroke-width="4"/>
  <line x1="24" y1="128" x2="296" y2="128" stroke="#6b5e4a" stroke-width="4"/>
  <g fill="#3f6d8e">
    <rect x="38" y="40" width="52" height="32"/><rect x="100" y="40" width="52" height="32"/>
    <rect x="162" y="40" width="52" height="32"/><rect x="224" y="40" width="52" height="32"/>
  </g>
  <g fill="#8e5a3f">
    <rect x="40" y="94" width="30" height="30" rx="4"/><rect x="82" y="94" width="30" height="30" rx="4"/>
    <rect x="124" y="94" width="30" height="30" rx="4"/><rect x="166" y="94" width="30" height="30" rx="4"/>
    <rect x="208" y="94" width="30" height="30" rx="4"/><rect x="250" y="94" width="30" height="30" rx="4"/>
  </g>
  <g fill="#d9d2c4" stroke="#6b5e4a" stroke-width="2">
    <rect x="40" y="140" width="110" height="10"/><rect x="40" y="152" width="110" height="10"/>
    <rect x="40" y="164" width="110" height="10"/>
  </g>
</svg>`;

const PHOTO_FRONT_COUNTER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="t-counter d-counter">
  <title id="t-counter">A front counter set up to greet customers</title>
  <desc id="d-counter">A clean service counter. A sign on the counter reads Hello. Two shapes stand on opposite sides of the counter, facing each other, as a greeting happens.</desc>
  <rect width="320" height="200" fill="#eef2f4"/>
  <rect x="0" y="140" width="320" height="60" fill="#c9d4da"/>
  <circle cx="86" cy="86" r="20" fill="#3f6d8e"/>
  <path d="M60 140 q26 -34 52 0 z" fill="#3f6d8e"/>
  <circle cx="236" cy="92" r="18" fill="#8e5a3f"/>
  <path d="M212 140 q24 -30 48 0 z" fill="#8e5a3f"/>
  <rect x="128" y="120" width="68" height="44" fill="#fff" stroke="#44515a" stroke-width="3"/>
  <text x="162" y="148" font-family="system-ui, sans-serif" font-size="18" text-anchor="middle" fill="#1b1b1b">Hello</text>
</svg>`;

const PHOTO_CHECKLIST = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="t-list d-list">
  <title id="t-list">A finished opening checklist</title>
  <desc id="d-list">A clipboard holding a list of three tasks. All three have a check mark drawn in the box beside them.</desc>
  <rect width="320" height="200" fill="#f2f4ee"/>
  <rect x="80" y="20" width="160" height="164" rx="8" fill="#fff" stroke="#55614a" stroke-width="4"/>
  <rect x="136" y="10" width="48" height="20" rx="6" fill="#55614a"/>
  <g stroke="#55614a" stroke-width="3" fill="none">
    <rect x="100" y="60" width="20" height="20"/><rect x="100" y="104" width="20" height="20"/><rect x="100" y="148" width="20" height="20"/>
  </g>
  <g stroke="#2f6b3f" stroke-width="5" fill="none" stroke-linecap="round">
    <polyline points="103,71 109,77 119,61"/><polyline points="103,115 109,121 119,105"/><polyline points="103,159 109,165 119,149"/>
  </g>
  <g fill="#9aa392">
    <rect x="132" y="64" width="86" height="8"/><rect x="132" y="108" width="72" height="8"/><rect x="132" y="152" width="90" height="8"/>
  </g>
</svg>`;

const AUDIO_POSTER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120" role="img" aria-labelledby="t-audio d-audio">
  <title id="t-audio">Sample audio stand-in</title>
  <desc id="d-audio">A drawing of a sound wave. This prototype ships no recorded audio; the words that would be spoken are written out in the transcript below.</desc>
  <rect width="320" height="120" fill="#f0eef4"/>
  <g stroke="#5a4f7a" stroke-width="6" stroke-linecap="round">
    <line x1="54" y1="44" x2="54" y2="76"/>
    <line x1="78" y1="30" x2="78" y2="90"/><line x1="102" y1="48" x2="102" y2="72"/>
    <line x1="126" y1="24" x2="126" y2="96"/><line x1="150" y1="40" x2="150" y2="80"/>
    <line x1="174" y1="34" x2="174" y2="86"/><line x1="198" y1="52" x2="198" y2="68"/>
    <line x1="222" y1="28" x2="222" y2="92"/><line x1="246" y1="46" x2="246" y2="74"/>
    <line x1="270" y1="56" x2="270" y2="64"/>
  </g>
</svg>`;

const VIDEO_POSTER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" role="img" aria-labelledby="t-video d-video">
  <title id="t-video">Sample video stand-in</title>
  <desc id="d-video">A still picture with a play triangle in the middle. This prototype ships no recorded video; what happens in it is written out in the captions below.</desc>
  <rect width="320" height="180" fill="#e9eceb"/>
  <rect x="0" y="130" width="320" height="50" fill="#ccd3cf"/>
  <circle cx="160" cy="84" r="40" fill="#44515a"/>
  <polygon points="148,62 148,106 184,84" fill="#fff"/>
</svg>`;

/** id -> { kind, label, alt, svg }. `kind` is how the example is shown, not a file type. */
export const MEDIA = {
  'photo-supply-shelf': {
    kind: 'photo',
    label: 'Supply shelf, after',
    alt: 'A supply shelf with boxes in a row, labeled jars, and squared stacks of paper.',
    svg: PHOTO_SUPPLY_SHELF
  },
  'photo-front-counter': {
    kind: 'photo',
    label: 'Front counter, ready for customers',
    alt: 'A clean service counter with a Hello sign, and two people facing each other across it.',
    svg: PHOTO_FRONT_COUNTER
  },
  'photo-checklist-done': {
    kind: 'photo',
    label: 'Opening checklist, all done',
    alt: 'A clipboard with a three-task list. Every box has a check mark.',
    svg: PHOTO_CHECKLIST
  },
  'audio-poster': {
    kind: 'audio',
    label: 'Sample audio stand-in',
    alt: 'A drawing of a sound wave. Sample stand-in: this prototype ships no recorded audio.',
    svg: AUDIO_POSTER
  },
  'video-poster': {
    kind: 'video',
    label: 'Sample video stand-in',
    alt: 'A video still with a play triangle. Sample stand-in: this prototype ships no recorded video.',
    svg: VIDEO_POSTER
  }
};

export const MEDIA_IDS = Object.keys(MEDIA);
