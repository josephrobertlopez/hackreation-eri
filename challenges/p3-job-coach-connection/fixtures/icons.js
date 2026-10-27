/*
 * Inline SVG icons. No binary files, no icon font, no network request.
 * Every icon carries <title> and <desc> and is aria-hidden where a real text
 * label sits next to it (the label is the accessible name; the icon must not
 * repeat it to a screen reader). The <title>/<desc> are there for the cases
 * where the icon is inspected on its own, and for ERI's reviewers.
 *
 * Drawn on a 24x24 grid, stroke-only, currentColor, so they scale with the
 * button text and survive dark mode and Windows High Contrast.
 */

function svg(titleText, descText, body) {
  return [
    '<svg class="icon" viewBox="0 0 24 24" width="40" height="40"',
    ' fill="none" stroke="currentColor" stroke-width="2"',
    ' stroke-linecap="round" stroke-linejoin="round" role="img" focusable="false">',
    '<title>', titleText, '</title>',
    '<desc>', descText, '</desc>',
    body,
    '</svg>'
  ].join('');
}

export const ICONS = {
  question: svg(
    'Question',
    'A speech bubble with a question mark inside it.',
    '<path d="M21 12a8 8 0 1 1-3.2-6.4"/>' +
    '<path d="M4 20l1.6-4"/>' +
    '<path d="M10 9a2.5 2.5 0 1 1 3.4 2.3c-.8.4-1.4 1-1.4 1.9v.3"/>' +
    '<path d="M12 17h.01"/>'
  ),
  task: svg(
    'Task',
    'A clipboard holding a sheet of paper with a question mark on it.',
    '<rect x="5" y="3" width="14" height="18" rx="2"/>' +
    '<path d="M9 3h6v2H9z"/>' +
    '<path d="M10 10a2 2 0 1 1 2.8 1.8c-.6.3-1 .8-1 1.5v.2"/>' +
    '<path d="M11.8 17h.01"/>'
  ),
  schedule: svg(
    'Schedule',
    'A calendar page with a curved arrow turning over it.',
    '<rect x="3" y="5" width="18" height="16" rx="2"/>' +
    '<path d="M3 10h18M8 3v4M16 3v4"/>' +
    '<path d="M9 16a3 3 0 1 0 3-3"/>' +
    '<path d="M12 11v2.5h-2.4"/>'
  ),
  unexpected: svg(
    'Something unexpected',
    'A signpost with two arms pointing opposite ways, meaning the plan changed.',
    '<path d="M12 3v18"/>' +
    '<path d="M12 6h6l2 2.5-2 2.5h-6z"/>' +
    '<path d="M12 13H6l-2 2.5 2 2.5h6z"/>'
  ),
  help: svg(
    'I need help',
    'An open raised hand, the sign for asking a question.',
    '<path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11"/>' +
    '<path d="M12 11V4.5a1.5 1.5 0 0 1 3 0V11"/>' +
    '<path d="M15 11V6.5a1.5 1.5 0 0 1 3 0V13a7 7 0 0 1-7 7h-.5A6.5 6.5 0 0 1 4 13.5V11a1.5 1.5 0 0 1 3 0"/>' +
    '<path d="M6.8 11.6l.9 2.4"/>'
  ),
  emergency: svg(
    'Emergency',
    'A triangle with an exclamation mark inside, the standard danger sign.',
    '<path d="M10.3 3.9 2.6 17.4A2 2 0 0 0 4.3 20.4h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>' +
    '<path d="M12 9v4"/><path d="M12 16.5h.01"/>'
  ),
  history: svg(
    'My messages',
    'A stack of three message lines, meaning earlier messages.',
    '<path d="M4 7h16M4 12h16M4 17h10"/>'
  ),
  sent: svg(
    'Sent',
    'A paper plane, meaning the message left this screen.',
    '<path d="M21 3 3 10.5l6.5 2.5L12 21z"/><path d="M21 3 9.5 13"/>'
  ),
  opened: svg(
    'Opened',
    'An open envelope, meaning the coach opened the message.',
    '<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>' +
    '<path d="M3 9.5 12 16l9-6.5"/>'
  ),
  answered: svg(
    'Answered',
    'A speech bubble with a check mark inside, meaning there is a reply.',
    '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 9 9 0 0 1-3.8-.8L4 21l1.4-4.1A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>' +
    '<path d="M9 11.5l2.2 2.2L15.5 9.5"/>'
  )
};

export default ICONS;
