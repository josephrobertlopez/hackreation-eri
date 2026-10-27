/*
 * The four common support needs (ERI MVP step 2).
 *
 * The first three are ERI's own examples from section 4. The fourth comes from
 * their user story "a simple way to explain that I am confused or that
 * something unexpected happened".
 *
 * Each one carries BOTH an icon and a text label - the icon is never the only
 * thing on the button (ERI section 7).
 *
 * `tryFirst` is deliberate. ERI's key design question is how to help people ask
 * for support "without creating unnecessary dependence on a job coach", so each
 * need offers one thing to try that needs nobody. It is a suggestion shown next
 * to the Send button, never a step you have to clear to send.
 */

import { ICONS } from './icons.js';

export const SUPPORT_NEEDS = [
  {
    id: 'question',
    label: 'I have a question',
    icon: ICONS.question,
    iconName: 'question',
    coachSummary: 'Has a question',
    tryFirst: 'If it is about today only, the person in charge at your worksite can also answer.'
  },
  {
    id: 'task',
    label: 'I do not understand my task',
    icon: ICONS.task,
    iconName: 'task',
    coachSummary: 'Does not understand a task',
    tryFirst: 'Your task cards are in the blue folder by the door. Step 1 is on the first card.'
  },
  {
    id: 'schedule',
    label: 'My schedule changed',
    icon: ICONS.schedule,
    iconName: 'schedule',
    coachSummary: 'Schedule changed',
    tryFirst: 'The new schedule is on the board in the break room. You can take a photo of it.'
  },
  {
    id: 'unexpected',
    label: 'Something unexpected happened',
    icon: ICONS.unexpected,
    iconName: 'unexpected',
    coachSummary: 'Something unexpected happened',
    tryFirst: 'If you are not sure what to do next, it is fine to stop and wait. You are not in trouble.'
  }
];

export const SUPPORT_NEED_IDS = SUPPORT_NEEDS.map((n) => n.id);

export function needById(id) {
  return SUPPORT_NEEDS.find((n) => n.id === id) || null;
}

export default SUPPORT_NEEDS;
