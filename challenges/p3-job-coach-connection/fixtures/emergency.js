/*
 * The emergency path. ERI section 10:
 *
 *   "It should also distinguish routine coaching requests from emergencies and
 *    direct users to established emergency procedures when needed."
 *
 * ERI put that in the privacy section, not in the MVP list and not in the
 * success criteria, which makes it the easiest requirement in the whole brief
 * to skip while still demoing well. We treat it as blocking.
 *
 * Two rules it has to satisfy, and both are tested:
 *   1. Emergency is a DIFFERENT path, not a louder version of the help request.
 *      It is reachable from the home screen without going through the request
 *      flow, it is styled differently, and it sends nothing.
 *   2. It points at procedures that already exist at the worksite - 911, the
 *      person in charge, the posted plan - and never at this app.
 *
 * ERI section 9 also puts "medical or emergency response services" out of
 * scope. Routing to an existing procedure is not building one. Building a
 * dispatch feature would be the violation.
 */

export const EMERGENCY = {
  triggerLabel: 'Is this an emergency?',
  heading: 'Is someone hurt or in danger?',
  lead: 'Do not use this app for an emergency. This app only sends a message to a job coach, and a job coach is not always at your worksite.',
  steps: [
    {
      id: 'call-911',
      label: 'Call 911',
      detail: 'Use a phone. Say where you are and what happened.'
    },
    {
      id: 'tell-person-in-charge',
      label: 'Tell the person in charge at your worksite',
      detail: 'They are trained for this. You will not be in trouble for telling them.'
    },
    {
      id: 'posted-plan',
      label: 'Follow the emergency plan posted at your worksite',
      detail: 'It is on the wall near the door, with the exits and the meeting place.'
    }
  ],
  afterward: 'When everyone is safe, you can send a message here so Maria Delgado knows what happened.',
  sendsNothing: 'This screen does not send anything to anyone.'
};

export default EMERGENCY;
