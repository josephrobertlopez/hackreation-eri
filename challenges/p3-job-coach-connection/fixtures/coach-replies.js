/*
 * Predefined coach replies (ERI section 4: "Allow the coach to send a short
 * written or predefined response").
 *
 * Written to be read by the employee, not by a case file: short sentences,
 * concrete next action, no jargon. None of them promises when the coach gets
 * there, and none of them claims she is at a desk waiting.
 */

export const COACH_REPLIES = [
  { id: 'r1', text: 'I read your message. Start with step 1 on the first task card, and send me another message when you finish it.' },
  { id: 'r2', text: 'Thank you for telling me. Your task today is the same as last week. The picture card by the door shows the order.' },
  { id: 'r3', text: 'I wrote down your schedule change. You do not need to do anything else about it.' },
  { id: 'r4', text: 'Let us talk about this. I can come to your worksite later today.' },
  { id: 'r5', text: 'You did the right thing by asking. For now, work on the next task on your list.' },
  { id: 'r6', text: 'I need a little more information. Can you send me one more message about what changed?' }
];

export function replyById(id) {
  return COACH_REPLIES.find((r) => r.id === id) || null;
}

export default COACH_REPLIES;
