document.getElementById('fit-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var f = e.target;
  var r = jobFit({
    hoursPerWeek: f.hours.value, wagePerHour: f.wage.value, benefit: f.benefit.value,
    nearBus: f.bus.checked, commuteMinutes: 0
  });
  var out = document.getElementById('fit-result');
  out.innerHTML = '<h2>' + (r.level === 'ok' ? 'Looks okay' : 'Good to know') + '</h2>' +
    '<p>About <strong>$' + r.monthlyEarnings + '</strong> a month from this job.</p><ul>' +
    r.notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul><p><em>' + r.disclaimer + '</em></p>';
  // Move focus to the result heading so screen readers read the result once.
  var h = out.querySelector('h2'); h.setAttribute('tabindex', '-1'); h.focus();
});
