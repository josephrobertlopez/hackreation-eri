/*
 * Inclusive job-post checker - rules engine (no dependencies, no data leaves the browser).
 * Flags phrases that may screen out qualified disabled applicants WITHOUT being essential.
 * Guidance, not legal advice. Employers decide what is truly essential.
 */
(function (root) {
  var RULES = [
    { re: /lift\s+\d+\s*(lbs?|pounds)/i, why: 'Lifting limits screen people out. Include them only if lifting is a real, frequent part of the job.', suggest: 'Occasionally moves items up to __ lbs, with or without assistance.' },
    { re: /driver'?s licen[cs]e/i, why: 'Many people with disabilities do not drive. Require it only if driving is part of the job.', suggest: 'Reliable way to get to work (bus line nearby).' },
    { re: /personal transportation|own (a )?(car|vehicle)/i, why: 'How someone gets to work is not a job duty.', suggest: 'Reliable way to get to work.' },
    { re: /stand(ing)? for \d+ hours/i, why: 'Standing for a whole shift is often not essential, and a stool may be a simple accommodation.', suggest: 'Works at a station; seating available on request.' },
    { re: /verbal communication|excellent communication/i, why: '"Verbal" excludes people who communicate in other ways (ASL, text, AAC).', suggest: 'Communicates clearly with customers and coworkers.' },
    { re: /hear (alarms|phone)/i, why: 'Hearing requirements can usually be met with visual or vibrating alerts.', suggest: 'Responds to alarms and calls (visual alerts available).' },
    { re: /personality (test|assessment)/i, why: 'Personality tests can screen out autistic and neurodivergent applicants, and timed online tests need accommodations.', suggest: 'Remove, or offer an accommodation-friendly alternative.' },
    { re: /fast[- ]paced|multitask under pressure/i, why: 'Vague stress language discourages applicants without describing the real work.', suggest: 'Describe the actual pace, e.g. "serves about 40 customers an hour at lunch."' },
    { re: /high school diploma required/i, why: 'Diplomas can exclude people who got a certificate of completion. Is it essential?', suggest: 'High school diploma or equivalent experience preferred.' },
    { re: /no exceptions/i, why: 'Blanket background rules can conflict with Wisconsin law on arrest and conviction records (must be "substantially related").', suggest: 'Background check; individual review.' }
  ];
  var ACCOMMODATION = 'We provide reasonable accommodations in applying and on the job. Ask us anytime.';

  function checkPost(text) {
    var flags = [];
    RULES.forEach(function (r) { var m = String(text).match(r.re); if (m) flags.push({ phrase: m[0], why: r.why, suggest: r.suggest }); });
    var hasAccommodation = /accommodation/i.test(text);
    return { flags: flags, score: Math.max(0, 100 - flags.length * 15 - (hasAccommodation ? 0 : 10)),
             addStatement: hasAccommodation ? null : ACCOMMODATION };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { checkPost: checkPost, RULES: RULES };
  else root.checkPost = checkPost;
})(this);
