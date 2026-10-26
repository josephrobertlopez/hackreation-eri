// BDD step definitions (Cucumber.js). Spec: wiki/prds/03-job-post-checker.md
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');
const { checkPost } = require('../../web/checker.js');

Given('my job post says {string}', function (text) { this.text = text; });
When('I check my post', function () { this.result = checkPost(this.text); });
Then('{string} is flagged with a reason and a suggested rewrite', function (phrase) {
  const f = this.result.flags.find(x => x.phrase.toLowerCase().includes(phrase.toLowerCase()));
  assert.ok(f, `"${phrase}" not flagged`); assert.ok(f.why && f.suggest);
});
Then('I am offered an accommodation statement', function () { assert.ok(this.result.addStatement); });
Then('nothing is flagged', function () { assert.deepEqual(this.result.flags, []); });
