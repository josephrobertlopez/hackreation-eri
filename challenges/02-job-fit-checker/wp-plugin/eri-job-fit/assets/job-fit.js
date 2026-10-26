/*
 * "Is this job right for me?" - core logic (no dependencies).
 * Works in the browser, in the WordPress plugin, and in Node tests.
 * ESTIMATE ONLY. Real cases need a benefits specialist (WIPA 1-877-826-1752).
 * Numbers: SSA 2026 and 2027 (see wiki/knowledge/benefits/benefits-quick-reference-2026.md).
 */
(function (root) {
  var SSA = {
    2026: { twp: 1210, sga: 1690, ssiFbr: 994 },
    2027: { twp: 1270, sga: 1770, ssiFbr: 1029 }
  };
  var WEEKS_PER_MONTH = 4.33;

  function jobFit(input, year) {
    year = year || (new Date().getFullYear() >= 2027 ? 2027 : 2026);
    var n = SSA[year];
    var hours = Number(input.hoursPerWeek) || 0;
    var wage = Number(input.wagePerHour) || 0;
    var monthly = Math.round(hours * wage * WEEKS_PER_MONTH);
    var notes = [];
    var level = 'ok'; // ok | heads-up

    if (input.benefit === 'SSDI' || input.benefit === 'both') {
      if (monthly > n.sga) { level = 'heads-up'; notes.push('This job may pay more than $' + n.sga + ' a month. That can affect SSDI after your trial work months. Talk to a benefits specialist before you say yes.'); }
      else if (monthly >= n.twp) { level = 'heads-up'; notes.push('Months over $' + n.twp + ' count as SSDI "trial work" months. You get 9. A benefits specialist can help you track them.'); }
      else notes.push('This pay is under the SSDI trial work amount ($' + n.twp + ' a month).');
    }
    if (input.benefit === 'SSI' || input.benefit === 'both') {
      var reduction = Math.max(0, Math.round((monthly - 85) / 2));
      var check = Math.max(0, n.ssiFbr - reduction);
      level = 'heads-up';
      notes.push('SSI usually goes down $1 for every $2 you earn after the first $85. Rough guess: your SSI check could be about $' + check + ' a month, plus about $' + monthly + ' from work. Your Medicaid may continue even if the check stops.');
    }
    var commuteOk = input.nearBus === true || Number(input.commuteMinutes) <= Number(input.maxCommuteMinutes || 45);
    notes.push(commuteOk ? 'Getting there looks doable.' : 'Getting there may be hard. Ask about bus routes or a ride.');

    return {
      year: year, monthlyEarnings: monthly, level: level, commuteOk: commuteOk, notes: notes,
      disclaimer: 'Estimate only. Not benefits advice. Call Wisconsin WIPA at 1-877-826-1752 or talk to your ERI benefits specialist.'
    };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { jobFit: jobFit, SSA: SSA };
  else root.jobFit = jobFit;
})(this);
