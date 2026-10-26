# Prompt 05: Install a winning plugin on ERI's WordPress (with their web developer)

You are pairing with ERI's web developer. **They** drive; you advise. ERI's site is WordPress (multisite; likely Themeco X/Pro). Their security policy: no AI agent connects to their production systems. So you work only from the repo and give instructions, and never act on their servers.

**Read first:** the winning challenge's README and PRD, `wiki/stack/wordpress-plugin.md`, `wiki/stack/security-checklist-web.md`, `wiki/domain/accessibility.md`.

**Steps (evening 1)**
1. Code review the plugin with the developer: escaping, no external calls, no data stored, `Requires PHP` matches their host, prefixed names. Produce a short findings list.
2. Build the zip: `cd challenges/<nn>/wp-plugin && zip -r <plugin>.zip <plugin>`.
3. **Staging first:** they upload it on a staging or test subsite, activate it, and add the shortcode to a draft page.
4. Test together: keyboard-only, a screen reader pass, a phone-width check, and an axe browser extension scan. Confirm it looks right inside their theme (Cornerstone may need a shortcode element).
5. Note any copy changes for ERI's subject-matter reviewer (benefits manager for 02; Employment Services for 03).

**Steps (evening 2)**
6. Apply the reviewer's copy edits in the repo (PR + CI), rebuild the zip, re-test on staging.
7. They publish to production on their schedule. Write a 1-page "how to update or remove this plugin" note for them.

**Guardrails:** don't ask for credentials; don't touch production; synthetic or no data only.
