/*
 * The people in the demonstration. All fictional.
 *
 * ERI section 10: "The system must clearly identify who can receive messages."
 * With a simulated inbox there is no real recipient, so "your coach" is not
 * enough - the recipient is NAMED, on every screen, and the demonstration
 * says out loud that the inbox is simulated.
 *
 * Note what is NOT here: no disability, no diagnosis, no case number, no
 * support level. The coach never needed them to answer a question about a task.
 */

export const COACH = {
  id: 'coach-maria-delgado',
  name: 'Maria Delgado',
  title: 'Job coach',
  org: 'ERI Employment Services',
  simulated: true,
  worksites: 4,
  initials: 'MD'
};

export const EMPLOYEE = {
  id: 'employee-sam-rivera',
  name: 'Sam Rivera',
  jobTitle: 'Stock assistant',
  worksite: 'Lincoln Avenue store',
  coachId: COACH.id
};

export default { COACH, EMPLOYEE };
