---
title: Web security checklist for hackathon code
summary: One-page OWASP-based checklist (injection, XSS, CSRF, access control, auth, secrets, dependencies, CORS, errors, logging without PII) mapped to the exact WordPress and plain-PHP functions to use, for code handed to ERI.
tags: [security, owasp, checklist, wordpress, php, javascript, privacy, hackathon]
last_verified: 2026-10-23
next_review: 2027-04-23
review_owner: ERI senior web developer
confidence: high
sources:
  - {title: "OWASP Top 10:2025", url: https://top10.owasp.org/2025/, accessed: 2026-10-23}
  - {title: "OWASP SQL Injection Prevention Cheat Sheet", url: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html, accessed: 2026-10-23}
  - {title: "OWASP Cross Site Scripting Prevention Cheat Sheet", url: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html, accessed: 2026-10-23}
  - {title: "OWASP Cross-Site Request Forgery Prevention Cheat Sheet", url: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html, accessed: 2026-10-23}
  - {title: "OWASP HTML5 Security Cheat Sheet (CORS, local storage)", url: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html, accessed: 2026-10-23}
  - {title: "OWASP Logging Cheat Sheet", url: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html, accessed: 2026-10-23}
  - {title: "WordPress Common APIs, Security", url: https://developer.wordpress.org/apis/security/, accessed: 2026-10-23}
  - {title: "WordPress Common APIs, Nonces", url: https://developer.wordpress.org/apis/security/nonces/, accessed: 2026-10-23}
  - {title: "WordPress Common APIs, Escaping Data", url: https://developer.wordpress.org/apis/security/escaping/, accessed: 2026-10-23}
  - {title: "WordPress REST API Handbook, Adding Custom Endpoints", url: https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/, accessed: 2026-10-23}
  - {title: "PHP Manual, PDO prepared statements", url: https://www.php.net/manual/en/pdo.prepared-statements.php, accessed: 2026-10-23}
  - {title: "PHP Manual, Securing Session INI Settings", url: https://www.php.net/manual/en/session.security.ini.php, accessed: 2026-10-23}
  - {title: "PHP Manual, password_hash", url: https://www.php.net/manual/en/function.password-hash.php, accessed: 2026-10-23}
  - {title: "PHP Supported Versions", url: https://www.php.net/supported-versions.php, accessed: 2026-10-23}
  - {title: "phpMyAdmin docs, Securing your phpMyAdmin installation", url: https://docs.phpmyadmin.net/en/latest/setup.html, accessed: 2026-10-23}
---

# Web security checklist for hackathon code

## TL;DR
- Five habits cover most of the risk: **bind SQL parameters, escape on output, check a token on every state change, check permission on every endpoint, keep secrets and real client data out of the code.**
- The current list is **OWASP Top 10:2025**: A01 Broken Access Control, A02 Security Misconfiguration, A03 Software Supply Chain Failures, A04 Cryptographic Failures, A05 Injection, A06 Insecure Design, A07 Authentication Failures, A08 Software or Data Integrity Failures, A09 Security Logging and Alerting Failures, A10 Mishandling of Exceptional Conditions.
- Run this list **before the demo** and paste it, ticked, into your team README.

## Minimal working example
The same "save a job" action, done safely in both stacks:

| Step | WordPress | Plain PHP (`starters/php-mysql`) |
| --- | --- | --- |
| Only POST changes data | `WP_REST_Server::CREATABLE` / `admin_post_eri_save` | `if ($_SERVER['REQUEST_METHOD'] === 'POST')` |
| CSRF token | `wp_nonce_field('eri_save','eri_nonce')` → `check_admin_referer('eri_save','eri_nonce')`; REST: `X-WP-Nonce` with `wp_create_nonce('wp_rest')` | `csrf_token()` in a hidden field → `hash_equals($_SESSION['csrf'], $_POST['csrf'])` |
| Permission | `current_user_can('edit_posts')` in `permission_callback` | `if (empty($_SESSION['user_id'])) { http_response_code(403); exit; }` |
| Validate input | `validate_callback`, `preg_match`, `in_array(..., true)` | same, then reject with a message |
| Sanitize input | `sanitize_text_field(wp_unslash($_POST['x']))`, `absint`, `sanitize_email` | `trim`, `(int)`, `filter_var($x, FILTER_VALIDATE_EMAIL)` |
| Query | `$wpdb->prepare('... WHERE id = %d', $id)` / `$wpdb->insert($t, $data, $formats)` | `$pdo->prepare('... WHERE id = :id')->execute([':id' => $id])` |
| Output | `esc_html`, `esc_attr`, `esc_url`, `wp_kses_post` | `htmlspecialchars($s, ENT_QUOTES, 'UTF-8')` (the starter's `h()`) |
| JS output | `.text()` / `textContent` | `.text()` / `textContent` |

```php
// WordPress form handler (admin-post.php), all five habits in one handler
add_action( 'admin_post_eri_save', function () {
	if ( ! current_user_can( 'edit_posts' ) ) { wp_die( esc_html__( 'Not allowed.', 'eri-hello' ), 403 ); }
	check_admin_referer( 'eri_save', 'eri_nonce' );
	$id = sanitize_text_field( wp_unslash( $_POST['posting_id'] ?? '' ) );
	if ( ! preg_match( '/^[A-Z0-9-]{1,10}$/', $id ) ) { wp_safe_redirect( add_query_arg( 'eri_err', 1, wp_get_referer() ) ); exit; }
	global $wpdb;
	$wpdb->insert( $wpdb->prefix . 'eri_saved', [ 'user_id' => get_current_user_id(), 'posting_id' => $id ], [ '%d', '%s' ] );
	wp_safe_redirect( add_query_arg( 'eri_saved', 1, wp_get_referer() ) ); exit;
} );
```

## Do / Don't checklist
**Injection (A05)**
- [ ] Every SQL value is a bound parameter (`$wpdb->prepare`, PDO `prepare/execute`). No string-built SQL with request data.
- [ ] Column/table/sort names come from an allowlist (`%i` in `$wpdb->prepare` for identifiers, WP 6.2+).
- [ ] No `eval`, `exec`, `system`, `shell_exec`, `unserialize` on user input. Use `json_decode`.
- [ ] The app's DB user is not `root` and has no admin rights.

**XSS**
- [ ] Every echo is escaped for its context, as late as possible (`esc_html`/`esc_attr`/`esc_url` or `h()`).
- [ ] JS uses `textContent` / jQuery `.text()` / `.val()`. `innerHTML`, `.html()`, `.append(string)` only with fixed, trusted strings.
- [ ] No user data inside `<script>`, inline `on*=` handlers, `style` blocks or unquoted attributes. Pass data with `wp_localize_script` / `json_encode` and attach handlers with `addEventListener` / `.on()`.
- [ ] Rich HTML from users: `wp_kses_post` (WP) or DOMPurify (JS). CSP is defense in depth, not the fix.

**CSRF**
- [ ] Every POST/PUT/DELETE checks a nonce or session token; no state changes on GET.
- [ ] Session cookies are `SameSite=Lax` or `Strict`, `HttpOnly`, `Secure` on HTTPS. Remember OWASP: "XSS can defeat all CSRF mitigation techniques."

**Access control and auth (A01, A07)**
- [ ] Every REST route has a real `permission_callback`; `__return_true` only for public synthetic data.
- [ ] Admin pages check a capability (`manage_options`); `is_admin()` and nonces are not permission checks.
- [ ] Use WordPress logins when inside WP. In plain PHP: `password_hash(PASSWORD_DEFAULT)`, `password_verify`, `session_regenerate_id(true)` on login, `session.use_strict_mode=1`.
- [ ] IDs in URLs (`?client=17`) are checked against the current user; never "security by unguessable ID".

**Secrets, config and data (A02, A04)**
- [ ] API keys and DB passwords come from env vars or a git-ignored `.env`; `.env.example` has fake values. `git grep -nE "sk-|api_key|password\s*="` returns nothing real.
- [ ] Only synthetic data from `data/`. No real names, SSNs, case notes or benefits data, ever.
- [ ] `display_errors=Off` and `WP_DEBUG_DISPLAY` false outside local dev; `php -S` and phpMyAdmin never on a public network (bind Docker ports to `127.0.0.1`).
- [ ] Anything AI-related can be switched off and is gated behind recorded consent (see `AGENTS.md`).

**Dependencies (A03, A08)**
- [ ] Fewest possible dependencies, each explained in the README. Pin versions (no `"latest"`), commit lock files, run `npm audit` / `composer audit`.
- [ ] jQuery and React come from WordPress (`'jquery'` dependency, `@wordpress/element`), not CDNs. If you must use a CDN in a static page, pin the exact version and add `integrity` (SRI).
- [ ] Supported runtimes: PHP 8.2+ (8.1 is EOL; 8.2 security support ends 2026-12-31), WordPress 7.1.x, MySQL 8.4 LTS.

**CORS**
- [ ] No `Access-Control-Allow-Origin: *` on anything that isn't public. Allowlist exact origins; never echo back the request's `Origin` unchecked.
- [ ] CORS is not access control. Endpoints still need auth and CSRF checks.
- [ ] Don't put tokens or session IDs in `localStorage`; one XSS can read it all.

**Errors and logging (A09, A10)**
- [ ] Catch exceptions at the top; show a plain-language message; log the detail server-side. Fail closed (deny) when a check errors.
- [ ] Logs never contain passwords, session IDs, access tokens, API keys, connection strings or PII (OWASP Logging). Log IDs, not names.
- [ ] No `console.log` of form data in shipped JS; no `var_dump`/`print_r` left in pages.

## Security
This whole page is the security section. When unsure, the rules from the WordPress Security handbook apply everywhere: **never trust user input, escape as late as possible, escape everything from untrusted sources (including your own database), never assume, and prefer validation (reject) over sanitization (clean).**

## Accessibility
Security UX must be accessible too: error and "session expired / invalid token" messages are text (not color only), announced via `role="alert"` or moved focus, and tell the person what to do next ("Reload the page and try again"). Don't use CAPTCHAs that fail WCAG 2.2 SC 3.3.8 (Accessible Authentication) **(verify the criterion text if you add one)**.

## Common AI-assistant mistakes to watch for
- Adds a nonce **or** a capability check, not both. Or adds `'permission_callback' => '__return_true'` to make a 401 go away.
- "Sanitizes" input and then concatenates it into SQL; quotes `'%s'` placeholders in `$wpdb->prepare`.
- Escapes on input, then prints raw on output.
- Builds HTML strings in JS from API responses with `+` and `.html()`.
- Sets `Access-Control-Allow-Origin: *` to fix a dev CORS error.
- Hard-codes an API key "for now", or writes a seed file with realistic-looking names.
- Prints `$e->getMessage()` or a stack trace to the browser; logs whole `$_POST` arrays.
- Suggests disabling TLS verification or `WP_DEBUG` display on a shared site.

## How to hand off to ERI
1. Paste this checklist into the team README with each box ticked or marked "N/A because ...".
2. List every endpoint/route, its method, its permission check and its CSRF check in one table.
3. List secrets needed (names only, e.g. `ANTHROPIC_API_KEY`) and where they are read.
4. State that all data is synthetic and that nothing connects to ERI systems.
5. Point to the stack page used: [wordpress-plugin.md](wordpress-plugin.md), [wordpress-blocks.md](wordpress-blocks.md) or [php-mysql.md](php-mysql.md).

## Sources
- [OWASP Top 10:2025](https://top10.owasp.org/2025/) · [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) · [XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) · [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) · [HTML5 Security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html) · [Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [WordPress Security](https://developer.wordpress.org/apis/security/) · [Nonces](https://developer.wordpress.org/apis/security/nonces/) · [Escaping Data](https://developer.wordpress.org/apis/security/escaping/) · [REST Custom Endpoints](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/)
- [PDO prepared statements](https://www.php.net/manual/en/pdo.prepared-statements.php) · [Session INI security](https://www.php.net/manual/en/session.security.ini.php) · [password_hash](https://www.php.net/manual/en/function.password-hash.php) · [PHP Supported Versions](https://www.php.net/supported-versions.php) · [phpMyAdmin security](https://docs.phpmyadmin.net/en/latest/setup.html)
