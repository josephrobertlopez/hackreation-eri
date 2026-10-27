/*
 * Pick-a-chip options for the profile step, so interests and preferred work
 * activities can be entered WITHOUT TYPING (ERI §7: "support alternatives to
 * typed input"). Typing is still available and is never required.
 *
 * ERI §4 asks for "a name or display name, interests, and preferred work
 * activities" — and nothing else. There is no field here for a disability, a
 * diagnosis, a support need, an accommodation, an age, an address or a
 * benefits status, because ERI §10 says the product must not require
 * disclosure of a disability or diagnosis, and a field that exists gets
 * filled in.
 */

export const INTEREST_OPTIONS = [
  'Animals',
  'Cooking',
  'Music',
  'Sports',
  'Plants and gardens',
  'Cars and bikes',
  'Art and drawing',
  'Computers',
  'Trains and buses',
  'Being outside',
  'Helping people',
  'Fixing things'
];

export const ACTIVITY_OPTIONS = [
  'Working with my hands',
  'Working with people',
  'Working on my own',
  'Working in a quiet place',
  'The same routine each day',
  'Something different each day',
  'Mornings',
  'Afternoons',
  'Being on my feet',
  'Sitting down',
  'Indoors',
  'Outdoors'
];
