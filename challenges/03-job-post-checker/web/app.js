document.getElementById('post-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var r = checkPost(e.target.post.value);
  var esc = function (s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
  var out = document.getElementById('post-result');
  out.innerHTML = '<h2>Inclusion score: ' + r.score + '/100</h2>' +
    (r.flags.length ? '<ol>' + r.flags.map(function (f) {
      return '<li><strong>"' + esc(f.phrase) + '"</strong><br>' + f.why + '<br><em>Try:</em> ' + f.suggest + '</li>'; }).join('') + '</ol>'
      : '<p>No common barriers found.</p>') +
    (r.addStatement ? '<p><strong>Add this line:</strong> ' + r.addStatement + '</p>' : '') +
    '<p>Want help hiring people with disabilities? <a href="https://eri-wi.org/business/">Talk to ERI Business Services</a>.</p>' +
    '<p><small>Guidance only, not legal advice. You decide which requirements are essential.</small></p>';
  // Move focus to the result heading so screen readers read the result once.
  var h = out.querySelector('h2'); h.setAttribute('tabindex', '-1'); h.focus();
});
