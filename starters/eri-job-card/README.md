# Gutenberg block starter (ERI Job Card)

A custom WordPress **block**. Editors drop a "Job Card" into any page and fill in title, employer, hours, wage and accommodations in the sidebar. Use this when your idea is content ERI staff will edit themselves.

Scaffolded with the official `@wordpress/create-block` tool.

```bash
cd starters/eri-job-card
npm install
npm run build          # outputs build/ (already committed, so the plugin works without building)
npm start              # watch mode while you code
```

To try it in WordPress, copy or mount this folder into `wp-content/plugins/` and activate "ERI Job Card". It's already mounted in `../wordpress-plugin/docker-compose.yml`, so run that and activate it. Then edit a page, add a block, and search "ERI Job Card".

**Heads-up:** ERI's main sites appear to use the Themeco X theme (Cornerstone builder), so a block may need a shortcode fallback. Ask ERI's web team.
