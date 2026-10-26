// TDD unit tests (node:test, built into Node 22). Spec: wiki/prds/02-job-fit-checker.md
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jobFit } = require('../web/job-fit.js');

describe('jobFit()', () => {
  it('AC-02.1 computes monthly pay as hours x wage x 4.33, rounded', () => {
    assert.equal(jobFit({ hoursPerWeek: 20, wagePerHour: 15, benefit: 'none', nearBus: true }, 2026).monthlyEarnings, 1299);
  });

  it('AC-02.2 estimates the SSI check as max - (pay - 85) / 2', () => {
    const r = jobFit({ hoursPerWeek: 20, wagePerHour: 15, benefit: 'SSI', nearBus: true }, 2026);
    assert.match(r.notes[0], /\$387/);
  });

  it('AC-02.2 never estimates a negative SSI check', () => {
    const r = jobFit({ hoursPerWeek: 40, wagePerHour: 30, benefit: 'SSI', nearBus: true }, 2026);
    assert.match(r.notes[0], /about \$0 a month/);
  });

  it('AC-02.3 warns when SSDI pay is above SGA', () => {
    const r = jobFit({ hoursPerWeek: 40, wagePerHour: 16, benefit: 'SSDI', nearBus: true }, 2026);
    assert.equal(r.level, 'heads-up');
    assert.match(r.notes[0], /\$1690/);
  });

  it('AC-02.3 explains trial work months between TWP and SGA', () => {
    const r = jobFit({ hoursPerWeek: 20, wagePerHour: 15, benefit: 'SSDI', nearBus: true }, 2026);
    assert.match(r.notes[0], /trial work/);
  });

  it('AC-02.4 uses 2027 numbers in 2027', () => {
    const r = jobFit({ hoursPerWeek: 10, wagePerHour: 12, benefit: 'SSDI', nearBus: true }, 2027);
    assert.match(r.notes[0], /\$1270/);
  });

  it('AC-02.5 always includes the estimate-only WIPA disclaimer', () => {
    for (const benefit of ['SSI', 'SSDI', 'both', 'none']) {
      const r = jobFit({ hoursPerWeek: 5, wagePerHour: 12, benefit, nearBus: true }, 2026);
      assert.match(r.disclaimer, /Estimate only/);
      assert.match(r.disclaimer, /1-877-826-1752/);
    }
  });

  it('AC-02.6 flags a long commute with no bus', () => {
    const r = jobFit({ hoursPerWeek: 20, wagePerHour: 15, benefit: 'none', nearBus: false, commuteMinutes: 70 }, 2026);
    assert.equal(r.commuteOk, false);
  });
});
