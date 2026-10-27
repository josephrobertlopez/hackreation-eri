/*
 * Inline SVG only. No binary files anywhere in this challenge.
 *
 * Every figure carries role="img", aria-labelledby, a <title> and a <desc>, and
 * uses currentColor so it survives dark mode and forced-colours. The <desc> is
 * the long description a screen reader reads; it is written to be useful on its
 * own, not a restatement of the heading above it.
 *
 * test/a11y-source.test.js fails if any svg here lacks title, desc or role.
 */

/* The whole mechanism in one picture: the employer's words on the left, the
 * candidate's words on the right, and a suggestion only where a line exists. */
export function traceDiagram() {
  return `
<svg class="figure" viewBox="0 0 440 190" role="img" aria-labelledby="trace-t trace-d" focusable="false">
  <title id="trace-t">How a suggestion is built</title>
  <desc id="trace-d">Two columns joined by lines. The left column is headed "needs you typed" and lists three business needs. The right column is headed "skills the candidate shared" and lists three skills. A line is drawn only where one of the employer's needs and one of the candidate's skills name the same thing, and each line becomes one suggestion. Needs with no line stay unmatched and are listed separately rather than being filled in by the tool.</desc>
  <g fill="none" stroke="currentColor" stroke-width="2">
    <rect x="4" y="34" width="150" height="34" rx="6"/>
    <rect x="4" y="78" width="150" height="34" rx="6"/>
    <rect x="4" y="122" width="150" height="34" rx="6"/>
    <rect x="286" y="34" width="150" height="34" rx="6"/>
    <rect x="286" y="78" width="150" height="34" rx="6"/>
    <rect x="286" y="122" width="150" height="34" rx="6"/>
    <path d="M154 51 L286 51"/>
    <path d="M154 95 L286 139"/>
  </g>
  <g fill="currentColor" font-size="11" font-family="system-ui, sans-serif">
    <text x="4" y="22" font-weight="700">Needs you typed</text>
    <text x="286" y="22" font-weight="700">Skills they shared</text>
    <text x="14" y="55">count the inventory</text>
    <text x="14" y="99">face the shelves</text>
    <text x="14" y="143">train new starters</text>
    <text x="296" y="55">counting stock</text>
    <text x="296" y="99">labelling</text>
    <text x="296" y="143">restocking shelves</text>
    <text x="168" y="178" font-size="10" font-style="italic">no line, no suggestion</text>
  </g>
</svg>`;
}

/* A small mark for the action plan panel. */
export function planMark() {
  return `
<svg class="mark" viewBox="0 0 24 24" role="img" aria-labelledby="plan-t plan-d" focusable="false">
  <title id="plan-t">Action plan</title>
  <desc id="plan-d">A sheet of paper with three ticked lines, standing for a short list of next steps the employer can act on.</desc>
  <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <rect x="4" y="2.5" width="16" height="19" rx="2"/>
    <path d="M7.5 8 l2 2 l4-4"/>
    <path d="M7.5 14 l2 2 l4-4"/>
    <path d="M15.5 17.5 h2"/>
  </g>
</svg>`;
}
