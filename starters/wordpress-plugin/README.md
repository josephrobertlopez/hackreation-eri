# WordPress plugin starter

ERI's sites run on **WordPress** (a multisite, likely with the Themeco X theme). A plugin is the easiest thing for ERI to install after the event.

The `eri-hello` plugin adds:

- a `[eri_jobs q="cook" limit="10"]` shortcode that renders an accessible list
- a REST endpoint at `GET /wp-json/eri/v1/jobs?q=cook`
- an admin page under **Tools > ERI Hello**

## Run it (pick one)

**A. wp-env (Docker, official WordPress tool)**
```bash
cd starters/wordpress-plugin
npx @wordpress/env start       # http://localhost:8888  (admin / password)
```

**B. Docker Compose (WordPress + MySQL + phpMyAdmin)**
```bash
docker compose up              # http://localhost:8000, phpMyAdmin :8081
```
Finish the WP install wizard, then **Plugins > Activate "ERI Hello"**. Add `[eri_jobs]` to a page.

**C. Any WordPress you already have:** zip `eri-hello/` and upload it under Plugins > Add New > Upload.

**No Docker? Smoke test without WordPress:**
```bash
php tests/smoke.php
```

## Conventions ERI will want
- Prefix everything with `eri_` and escape all output (`esc_html`, `esc_attr`).
- Keep it in one plugin folder, with no build step unless you must.
- Don't depend on paid plugins.
- Store synthetic data only. Use `$wpdb` with `prepare()` for any custom table.
