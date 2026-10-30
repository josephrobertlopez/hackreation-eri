# Static web starter (HTML/CSS/jQuery)

The fastest way to show an idea. Nothing to install.

```bash
cd starters/static-web
python3 -m http.server 8000     # or: npx serve .
# open http://localhost:8000
```

You should see "Hello, ERI!" and a searchable list of 60 synthetic Milwaukee jobs.

- `index.html`: page, with a skip link, labels and a live region for screen readers
- `app.js`: loads `job_postings.csv` (a copy of `data/job_postings.csv`) with jQuery
- `style.css`: high-contrast, dark-mode aware, visible focus rings

**Good for:** quick prototypes of any of P1 to P4.
**Ships to ERI as:** a page or block dropped into their WordPress site.
