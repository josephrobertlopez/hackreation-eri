# Recommended stack

ERI's public sites run on **WordPress** (see [digital-properties.md](digital-properties.md)). So the safest bet for anything ERI keeps after the event is PHP, MySQL, WordPress and plain HTML/CSS/JavaScript. For a phone-first prototype, Expo + Supabase is the suggested option. **Confirm with ERI before you count on any of these being adopted.**

| Target | Tools | Starter in this repo |
| --- | --- | --- |
| Websites | HTML/CSS, JavaScript/jQuery | `starters/static-web` |
| | PHP, SQL/MySQL/phpMyAdmin | `starters/php-mysql` |
| | WordPress | `starters/wordpress-plugin`, `starters/eri-job-card` (block) |
| Mobile apps | JavaScript, React Native/Expo, Postgres/Supabase | `starters/expo-supabase` |
| AI | Chat assistants (Claude, ChatGPT) or an API key you bring | `starters/ai-helpers` |

## Ground rules
- **Prototypes stay standalone.** No connections to ERI systems, and no AI agents pointed at anything real.
- Use only data in `data/`, which is synthetic.
- Prefer no build step and no new paid services. If you add a dependency, say why in your team README.
- Something you hand ERI should run with the README in under 10 minutes.

## Picking a starter
- Job seekers on phones → `expo-supabase` (also runs on web)
- Staff tool or billing checker → `php-mysql`, then wrap it as a WordPress plugin
- Content ERI staff will edit → `wordpress-plugin` or `eri-job-card`
- Quick demo or calculator → `static-web`
