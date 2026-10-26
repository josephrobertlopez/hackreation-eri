---
title: Stack best-practice pages index
summary: Index of wiki/stack/, the practical "how to build it right" pages for each technology in ERI's recommended stack (WordPress plugins and blocks, PHP/MySQL, security, JS/jQuery, HTML/CSS accessibility, Expo, Supabase, Docker, AI-assisted coding).
tags: [index, stack, wordpress, php, mysql, javascript, security, accessibility, hackathon]
last_verified: 2026-10-23
next_review: 2027-01-15
review_owner: ERI senior web developer
confidence: high
sources:
  - {title: "PHP Supported Versions", url: https://www.php.net/supported-versions.php, accessed: 2026-10-23}
  - {title: "Make WordPress Hosting, WordPress 7.0 compatibility", url: https://make.wordpress.org/hosting/handbook/compatibility/version/7-0/, accessed: 2026-10-23}
  - {title: "Make WordPress Core, WordPress 7.1 release page", url: https://make.wordpress.org/core/7-1/, accessed: 2026-10-23}
  - {title: "OWASP Top 10:2025", url: https://top10.owasp.org/2025/, accessed: 2026-10-23}
---

# Stack best practices

Practical, copy-pasteable pages for teams (and their AI coding assistants) building on ERI's stack in about 4 hours. Code examples match the repo's hello worlds in `starters/` and `challenges/`. Read [../company/tech-stack.md](../company/tech-stack.md) first to pick a starter, and [../../AGENTS.md](../../AGENTS.md) for the hard rules.

Every page uses the LLM-wiki frontmatter from [../knowledge/_PAGE_SPEC.md](../knowledge/_PAGE_SPEC.md) (`last_verified`, `next_review`, `confidence`, `sources`) with these body sections: **TL;DR, Minimal working example, Do / Don't checklist, Security, Accessibility, Common AI-assistant mistakes to watch for, How to hand off to ERI, Sources.** **(verify)** marks anything not confirmed from an opened official source.

## Pages

| Page | Use it for | Starter | Confidence | Next review |
| --- | --- | --- | --- | --- |
| [wordpress-plugin.md](wordpress-plugin.md) | Plugin header and layout, hooks, shortcodes, enqueueing (`strategy: defer`), REST routes with `permission_callback`, settings, capabilities, nonces, escaping, `$wpdb->prepare` + `dbDelta`, activation/uninstall, i18n, multisite, PHPCS | `starters/wordpress-plugin/eri-hello`, `challenges/02-job-fit-checker/wp-plugin` | high | 2027-01-15 |
| [wordpress-blocks.md](wordpress-blocks.md) | `block.json` apiVersion 3, `create-block` / `wp-scripts`, static vs dynamic `render.php`, Interactivity API, block accessibility, shortcode fallback for X/Cornerstone | `starters/eri-job-card` | medium | 2027-01-15 |
| [php-mysql.md](php-mysql.md) | Supported PHP versions, PDO prepared statements, utf8mb4, `password_hash`, sessions + CSRF tokens, escaping, uploads, env config, `php -S` dev only, PSR-12, phpMyAdmin safety | `starters/php-mysql`, `challenges/01-funding-gap-finder` | high | 2027-01-05 |
| [security-checklist-web.md](security-checklist-web.md) | One-page OWASP Top 10:2025 checklist mapped to WordPress and plain-PHP functions; paste it into your team README | all | high | 2027-04-23 |
| [javascript-jquery.md](javascript-jquery.md) | Plain JS first, jQuery where WordPress loads it, XSS-safe DOM, fetch errors, Node tests | `starters/static-web`, `challenges/02-job-fit-checker` | see page | see page |
| [html-css-accessibility.md](html-css-accessibility.md) | Accessible forms and results (WCAG 2.2 AA), live regions, contrast, reflow, a 10-minute test routine | all | see page | see page |
| [expo-react-native.md](expo-react-native.md) | Expo SDK 58 starter, `npx expo install`, env vars, accessibility props, web export | `starters/expo-supabase` | see page | see page |
| [supabase-postgres.md](supabase-postgres.md) | RLS on every table, keys, auth, migrations, CSV import, plain-Postgres fallback | `starters/expo-supabase` | see page | see page |
| [docker-dev.md](docker-dev.md) | Docker Compose for WordPress + MySQL + phpMyAdmin, `.env`, teardown, event dev environments | `starters/wordpress-plugin`, `starters/php-mysql` | see page | see page |
| [ai-assisted-coding.md](ai-assisted-coding.md) | Getting good, safe results from Claude / ChatGPT / Copilot in a 4-hour build | all | see page | see page |

The last six pages are maintained separately; check each page's own frontmatter for its confidence and review date.

## Key version facts (as of 2026-10-23)

| Item | Fact | Source |
| --- | --- | --- |
| WordPress | 7.1.x is current (7.1 released, scheduled for 2026-08-19; 7.1.1 scheduled 2026-09-17). 7.0 released 2026-05-20 | make.wordpress.org/core |
| WordPress minimum PHP | 7.4 from WordPress 7.0; Hosting team recommends PHP 8.4/8.5 and MySQL 8.4 for new installs | make.wordpress.org/hosting |
| PHP | Supported: 8.2 (security until 2026-12-31), 8.3 (to 2027-12-31), 8.4 (to 2028-12-31), 8.5 (to 2029-12-31). 8.1 and older are EOL | php.net |
| MySQL | 8.0 EOL April 2026; 8.4 is the LTS line | Oracle MySQL docs |
| Block API | `apiVersion` 3 (since WP 6.3); iframe editor not yet enforced in 7.0 | Block Editor Handbook, make/core |
| OWASP | Top 10:2025 is the current edition | top10.owasp.org |

## Gaps to flag to ERI
- ERI's production PHP, MySQL/MariaDB and WordPress versions are unknown **(verify with ERI's web team)**; pages assume PHP 8.2+ and WP 6.8+.
- `AGENTS.md` says "PHP 8.1+"; PHP 8.1 is end of life. Suggest "PHP 8.2+ (8.3 preferred)".
- `starters/php-mysql/docker-compose.yml` publishes MySQL (3306) and phpMyAdmin (8081) on all interfaces; bind them to `127.0.0.1` on shared networks.
