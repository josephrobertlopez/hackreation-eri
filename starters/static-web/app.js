// Loads the synthetic CSV and filters it. Works from `python3 -m http.server`.
// (Opening index.html via file:// blocks fetch() in some browsers - use a local server.)
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

$(async function () {
  const jobs = parseCSV(await (await fetch('job_postings.csv')).text());
  function render(term) {
    const t = term.toLowerCase();
    const hits = jobs.filter(j => (j.title + ' ' + j.neighborhood + ' ' + j.category).toLowerCase().includes(t));
    $('#count').text(`${hits.length} of ${jobs.length} jobs`);
    $('#jobs').html(hits.slice(0, 25).map(j =>
      `<li><strong>${esc(j.title)}</strong> - ${esc(j.employer)}<br><span class="meta">${esc(j.neighborhood)} · ${esc(j.hours_per_week)} h/wk · $${esc(j.wage_per_hour)}/h${j.near_bus_line === 'TRUE' ? ' · near bus' : ''}</span></li>`).join(''));
  }
  $('#q').on('input', e => render(e.target.value));
  render('');
});
