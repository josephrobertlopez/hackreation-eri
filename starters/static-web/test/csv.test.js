// TDD (node:test): node --test test/*.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { parseCSV } = require('../csv.js');

test('parses quoted fields with commas and escaped quotes', () => {
  assert.deepEqual(parseCSV('a,b\n"x, y","say ""hi"""\n'), [{ a: 'x, y', b: 'say "hi"' }]);
});
test('parses the bundled 60 synthetic job postings', () => {
  const rows = parseCSV(fs.readFileSync(__dirname + '/../job_postings.csv', 'utf8'));
  assert.equal(rows.length, 60);
  assert.equal(rows[0].synthetic, 'TRUE');
});
