/*
 * Every word the two screens say, in one file, so ERI can read the product's
 * language without reading its code - and so the tests can hold the language
 * to the brief.
 *
 * Two of these strings are load-bearing and have tests of their own:
 *
 *   DISCLOSURE.availability - ERI section 10 forbids implying that a job coach
 *   is always there the moment you need one. So nothing in this app reports
 *   presence - no green dot, no when-were-they-here line, no three-dots
 *   indicator - and nothing predicts how long a reply takes.
 *   test/conformance.test.mjs scans every screen, every fixture and every
 *   source file for the phrases that would break that and fails on a match,
 *   which is also why this comment paraphrases the rule instead of quoting it:
 *   the scan reads its own source too. ERI's exact sentence is in
 *   spec/acceptance.md under P3-P3.
 *
 *   STATUS.sent.detail - the honest version of "sent". A message that has left
 *   the employee's screen and has not been opened says so, and says that this
 *   app cannot tell them more. The dishonest version - a timer that flips to
 *   "seen" - is what test/state-machine.test.mjs exists to prevent.
 */

export const APP = {
  name: 'Job Coach Connection',
  employeeTitle: 'Ask for help',
  coachTitle: 'Coach dashboard',
  demoBanner: 'Hackathon demonstration. The coach inbox on this computer is simulated. No message leaves this browser.'
};

export const DISCLOSURE = {
  // Shown on every employee screen, outside the screen that changes, so the
  // recipient is named by construction rather than by remembering to repeat it.
  recipientBanner: 'Any message you send here goes to Maria Delgado, job coach, ERI Employment Services. Nobody else.',
  whoHeading: 'Who gets this message',
  who: 'Only Maria Delgado, your job coach at ERI Employment Services.',
  sharedHeading: 'What Maria can see',
  shared: 'Your name, which kind of help you picked, your message if you send one, and the time you sent it.',
  notShared: 'Nothing else. Maria cannot see what you are doing at work, where you are, or how fast you work.',
  availabilityHeading: 'When Maria reads it',
  availability: 'Maria is a job coach for four worksites and is not always at a computer. This app does not promise a reply, and it cannot tell you when she will read your message. If you need an answer today, tell the person in charge at your worksite as well.',
  production: 'A real version of this tool would need a secure sign-in, protected messages, a record retention policy, and reply expectations agreed with ERI. None of that is in this one-day prototype.'
};

export const STATUS = {
  sent: {
    label: 'Sent',
    detail: 'Your message left this screen. Maria has not opened it yet. This app cannot tell you more than that.',
    iconName: 'sent'
  },
  seen: {
    label: 'Maria opened it',
    detail: 'Maria Delgado opened your message. She has not answered yet.',
    iconName: 'opened'
  },
  answered: {
    label: 'Maria answered',
    detail: 'Maria Delgado answered. Her message is below.',
    iconName: 'answered'
  }
};

export const EMPLOYEE_UI = {
  helpButton: 'I Need Help',
  helpButtonHint: 'Ask Maria Delgado for help with your work.',
  chooseHeading: 'What do you need help with?',
  chooseHint: 'Pick one. You can change it before you send.',
  composeHeading: 'Send this to Maria Delgado?',
  pickMessageHeading: 'Add a message (you do not have to)',
  typeLabel: 'Or type your own short message',
  typeHint: 'You can send with no message at all.',
  tryFirstHeading: 'Try this first, if you want',
  sendButton: 'Send to Maria Delgado',
  backButton: 'Go back',
  sentHeading: 'Your message is sent',
  sentConfirm: 'Sent to Maria Delgado.',
  historyButton: 'My messages',
  historyHeading: 'My messages',
  historyEmpty: 'You have not sent any messages yet.',
  homeButton: 'Back to the start'
};

export const COACH_UI = {
  heading: 'Requests for Maria Delgado',
  empty: 'No requests yet. Open the employee screen in another tab and send one.',
  openButton: 'Open this request',
  replyHeading: 'Reply',
  pickReplyLabel: 'Pick a reply',
  typeReplyLabel: 'Or write a short reply',
  sendReplyButton: 'Send reply',
  notMonitoring: 'You see the requests people choose to send you. This dashboard does not show what anyone is doing at work.',
  noDiagnosis: 'There is no place here to record a disability or a diagnosis, because answering a question about a task does not need one.'
};

export default { APP, DISCLOSURE, STATUS, EMPLOYEE_UI, COACH_UI };
