// BDD step definitions (Cucumber.js). Spec: wiki/prds/02-job-fit-checker.md
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');
const { jobFit } = require('../../web/job-fit.js');

Given('I get {string}', function (benefit) { this.input = { benefit }; });
Given('the job is {int} hours a week at ${int} an hour near a bus', function (h, w) {
  Object.assign(this.input, { hoursPerWeek: h, wagePerHour: w, nearBus: true });
});
Given('the job is {int} hours a week at ${int} an hour with no bus and a {int} minute commute', function (h, w, m) {
  Object.assign(this.input, { hoursPerWeek: h, wagePerHour: w, nearBus: false, commuteMinutes: m });
});
When('I check the job', function () { this.result = jobFit(this.input, 2026); });
Then('I see monthly pay of ${int}', function (n) { assert.equal(this.result.monthlyEarnings, n); });
Then('I see an SSI estimate of about ${int}', function (n) { assert.ok(this.result.notes.some(t => t.includes('$' + n))); });
Then('I am told this is an estimate and to call WIPA', function () { assert.match(this.result.disclaimer, /Estimate only.*1-877-826-1752/); });
Then('I get a heads-up to talk to a benefits specialist', function () {
  assert.equal(this.result.level, 'heads-up'); assert.match(this.result.notes[0], /benefits specialist/);
});
Then('I am warned that getting there may be hard', function () { assert.equal(this.result.commuteOk, false); });
