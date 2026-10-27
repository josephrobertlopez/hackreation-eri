/*
 * Trusted resources. LINKS AND PHONE NUMBERS ONLY.
 *
 * This file deliberately contains no accommodation advice, no disclosure
 * scripts, and no paraphrase of anybody's guidance. Accommodation and
 * disclosure content is where a hackathon prototype can do real legal harm, so
 * the rule here is: name the source, link the source, stop.
 *
 * `whatYouWillFind` describes the DESTINATION, never what the employer should
 * do. test/guards.test.js fails on advice verbs ("you should", "you must",
 * "it is legal to", ...) anywhere in this file's strings. If you add a
 * resource and the test goes red, the sentence is advice — shorten it to the
 * page's own subject.
 *
 * URLs were taken from this repo's own knowledge base rather than invented.
 * Re-check them before a demo; links rot.
 */

export const RESOURCES = [
  {
    id: 'jan',
    publisher: 'Job Accommodation Network (JAN)',
    name: 'JAN: accommodation information and a free helpline',
    url: 'https://askjan.org/',
    phone: '1-800-526-7234',
    whatYouWillFind: 'JAN’s own accommodation information, free and confidential, for employers and employees.',
    forStep: ['accommodation-request', 'onboarding']
  },
  {
    id: 'jan-a-to-z',
    publisher: 'Job Accommodation Network (JAN)',
    name: 'JAN A to Z: accommodation ideas indexed by topic',
    url: 'https://askjan.org/a-to-z.cfm',
    phone: null,
    whatYouWillFind: 'JAN’s index of accommodation ideas, searchable by topic and by job function.',
    forStep: ['accommodation-request', 'task-design']
  },
  {
    id: 'eeoc-accommodation',
    publisher: 'U.S. Equal Employment Opportunity Commission (EEOC)',
    name: 'EEOC enforcement guidance: reasonable accommodation and undue hardship under the ADA',
    url: 'https://www.eeoc.gov/laws/guidance/enforcement-guidance-reasonable-accommodation-and-undue-hardship-under-ada',
    phone: '1-800-669-4000',
    whatYouWillFind: 'The EEOC’s own guidance document on reasonable accommodation and undue hardship.',
    forStep: ['accommodation-request', 'legal-question']
  },
  {
    id: 'eeoc-disclosure',
    publisher: 'U.S. Equal Employment Opportunity Commission (EEOC)',
    name: 'EEOC: the ADA and employment rights of an individual with a disability',
    url: 'https://www.eeoc.gov/publications/ada-your-employment-rights-individual-disability',
    phone: null,
    whatYouWillFind: 'The EEOC publication on employment rights under the ADA.',
    forStep: ['disclosure', 'legal-question']
  },
  {
    id: 'eeoc-milwaukee',
    publisher: 'U.S. Equal Employment Opportunity Commission (EEOC)',
    name: 'EEOC Milwaukee field office',
    url: 'https://www.eeoc.gov/field-office/milwaukee',
    phone: null,
    whatYouWillFind: 'Contact details for the EEOC office covering Wisconsin.',
    forStep: ['legal-question']
  },
  {
    id: 'dvr-offices',
    publisher: 'Wisconsin DVR (Division of Vocational Rehabilitation)',
    name: 'Wisconsin DVR office locations',
    url: 'https://dwd.wisconsin.gov/dvr/about/locations.htm',
    phone: null,
    whatYouWillFind: 'DVR offices across Wisconsin, including who an employer can talk to locally.',
    forStep: ['next-steps', 'onboarding']
  },
  {
    id: 'dwd-er-disability',
    publisher: 'Wisconsin DWD Equal Rights Division',
    name: 'Wisconsin Equal Rights: disability discrimination on the job',
    url: 'https://dwd.wisconsin.gov/er/civilrights/discrimination/disabilitiesonjob.htm',
    phone: null,
    whatYouWillFind: 'The state agency page on disability and employment in Wisconsin.',
    forStep: ['legal-question', 'disclosure']
  },
  {
    id: 'drw-cap',
    publisher: 'Disability Rights Wisconsin / Client Assistance Program',
    name: 'Disability Rights Wisconsin, Client Assistance Program',
    url: 'https://dwd.wisconsin.gov/dvr/partners/wrc/pdf/drw-designated-to-manage-cap.pdf',
    phone: '1-800-928-8778',
    whatYouWillFind: 'The designated Wisconsin protection and advocacy contact.',
    forStep: ['legal-question']
  },
  {
    id: 'wipa',
    publisher: 'Wisconsin WIPA',
    name: 'Wisconsin WIPA: benefits and work questions',
    url: null,
    phone: '1-877-826-1752',
    whatYouWillFind: 'Certified benefits counsellors, for a candidate’s questions about SSI, SSDI or Medicaid and work.',
    forStep: ['next-steps']
  },
  {
    id: 'eri-business',
    publisher: 'Employment Resources, Inc. (ERI)',
    name: 'ERI Business Services',
    url: 'https://eri-wi.org/business/',
    phone: null,
    whatYouWillFind: 'ERI’s own employer page, and the people who run this conversation for a living.',
    forStep: ['next-steps', 'onboarding', 'task-design']
  }
];

export const RESOURCE_BY_ID = new Map(RESOURCES.map((r) => [r.id, r]));

export function resourcesForStep(step) {
  return RESOURCES.filter((r) => r.forStep.includes(step));
}

/*
 * The referral line. Fixed string, never assembled from user input, shown on
 * every output that touches accommodation, disclosure or the law.
 * ERI's §10 bullet 7 is the requirement; AC-P4.9 is the acceptance criterion.
 */
export const LEGAL_REFERRAL = {
  heading: 'Legal and accommodation questions go to people, not to this tool',
  body: 'This prototype does not answer legal questions and does not decide anything. For a specific question about an accommodation, a disclosure, or your duties as an employer, talk to a qualified professional: JAN (1-800-526-7234, free), the EEOC, Wisconsin DVR, or your own employment counsel.',
  resourceIds: ['jan', 'eeoc-accommodation', 'dvr-offices', 'eeoc-milwaukee']
};

/* Shown wherever a human decision is the next step. ERI's §10 bullets 3 and 4. */
export const DECISION_NOTICE = {
  heading: 'This tool does not decide, rank or score',
  body: 'Everything below is a suggestion built from the needs you typed and the skills the candidate shared. It is not a score, not a ranking and not a hiring or accommodation decision. People make those, after a conversation.'
};
