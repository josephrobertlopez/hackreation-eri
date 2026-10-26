// TDD unit tests (node:test). Spec: wiki/prds/03-job-post-checker.md
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { checkPost } = require('../web/checker.js');

describe('checkPost()', () => {
  it('AC-03.1 flags barrier phrases with why and a suggested rewrite', () => {
    const r = checkPost("Must be able to lift 50 lbs. Valid driver's license required.");
    assert.equal(r.flags.length, 2);
    for (const f of r.flags) { assert.ok(f.why.length > 10); assert.ok(f.suggest.length > 5); }
  });

  it('AC-03.2 suggests an accommodation statement when missing', () => {
    assert.match(checkPost('Stock shelves.').addStatement, /accommodations/);
  });

  it('AC-03.3 finds nothing in an inclusive post', () => {
    const r = checkPost('Training provided. Reasonable accommodations available on request.');
    assert.deepEqual(r.flags, []);
    assert.equal(r.addStatement, null);
  });

  it('AC-03.4 flags most of the 60 synthetic postings', () => {
    const csv = fs.readFileSync(path.join(__dirname, '..', 'data', 'job_postings.csv'), 'utf8');
    const flagged = csv.trim().split('\n').slice(1).filter(l => checkPost(l).flags.length > 0).length;
    assert.ok(flagged > 20, `only ${flagged} flagged`);
  });

  it('scores lower with more barriers', () => {
    assert.ok(checkPost("lift 50 lbs. driver's license. stand for 8 hours").score < checkPost('lift 50 lbs').score);
  });
});
