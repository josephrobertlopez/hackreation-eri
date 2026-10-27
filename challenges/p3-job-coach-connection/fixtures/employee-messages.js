/*
 * Predefined employee messages - the alternative to typing (ERI section 7,
 * success criterion 5, and the user story "I want to ask for help using
 * pictures because typing messages can be difficult").
 *
 * Short, plain language, first person, one idea each. Picking one is a single
 * tap and is OPTIONAL: a request sends with no message at all.
 */

export const EMPLOYEE_MESSAGES = {
  question: [
    { id: 'q1', text: 'Can you call me when you have time?' },
    { id: 'q2', text: 'I want to ask about my hours.' },
    { id: 'q3', text: 'I have a question about my break.' }
  ],
  task: [
    { id: 't1', text: 'I am not sure what to do first.' },
    { id: 't2', text: 'I do not understand the words on the paper.' },
    { id: 't3', text: 'Can you show me this task again?' }
  ],
  schedule: [
    { id: 's1', text: 'My hours changed and I am not sure when to come in.' },
    { id: 's2', text: 'Someone asked me to work a different day.' },
    { id: 's3', text: 'I need to check which days I work this week.' }
  ],
  unexpected: [
    { id: 'u1', text: 'Something changed and I do not know what to do.' },
    { id: 'u2', text: 'The machine I use is not working.' },
    { id: 'u3', text: 'I am confused and I would like some help.' }
  ]
};

export function messagesFor(needId) {
  return EMPLOYEE_MESSAGES[needId] || [];
}

export default EMPLOYEE_MESSAGES;
