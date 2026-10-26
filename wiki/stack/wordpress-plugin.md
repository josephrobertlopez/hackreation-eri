---
title: WordPress plugin best practices
summary: How to write a small, safe, multisite-friendly WordPress plugin (header, hooks, shortcodes, enqueueing, REST, settings, nonces, escaping, $wpdb, activation/uninstall, i18n, PHPCS) that ERI's web team can adopt.
tags: [wordpress, plugin, php, shortcode, rest-api, security, multisite, hackathon]
last_verified: 2026-10-23
next_review: 2027-01-15
review_owner: ERI senior web developer
confidence: high
sources:
  - {title: "Plugin Handbook, Header Requirements", url: https://developer.wordpress.org/plugins/plugin-basics/header-requirements/, accessed: 2026-10-23}
  - {title: "Plugin Handbook, Best Practices", url: https://developer.wordpress.org/plugins/plugin-basics/best-practices/, accessed: 2026-10-23}
  - {title: "Common APIs, Security (Escaping, Sanitizing, Nonces)", url: https://developer.wordpress.org/apis/security/, accessed: 2026-10-23}
  - {title: "REST API Handbook, Adding Custom Endpoints", url: https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/, accessed: 2026-10-23}
  - {title: "REST API Handbook, Authentication", url: https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/, accessed: 2026-10-23}
  - {title: "wp_enqueue_script() reference", url: https://developer.wordpress.org/reference/functions/wp_enqueue_script/, accessed: 2026-10-23}
  - {title: "wpdb::prepare() reference", url: https://developer.wordpress.org/reference/classes/wpdb/prepare/, accessed: 2026-10-23}
  - {title: "Plugin Handbook, Creating Tables with Plugins (dbDelta)", url: https://developer.wordpress.org/plugins/creating-tables-with-plugins/, accessed: 2026-10-23}
  - {title: "Plugin Handbook, Uninstall Methods", url: https://developer.wordpress.org/plugins/plugin-basics/uninstall-methods/, accessed: 2026-10-23}
  - {title: "Plugin Handbook, How to Internationalize Your Plugin", url: https://developer.wordpress.org/plugins/internationalization/how-to-internationalize-your-plugin/, accessed: 2026-10-23}
  - {title: "register_setting() reference", url: https://developer.wordpress.org/reference/functions/register_setting/, accessed: 2026-10-23}
  - {title: "Learn WordPress, Building plugins and themes that support multisite", url: https://learn.wordpress.org/lesson/building-plugins-and-themes-that-support-multisite/, accessed: 2026-10-23}
  - {title: "WordPress.org, Roles and Capabilities", url: https://wordpress.org/documentation/article/roles-and-capabilities/, accessed: 2026-10-23}
  - {title: "WordPress Coding Standards (WPCS) on GitHub", url: https://github.com/WordPress/wordpress-coding-standards, accessed: 2026-10-23}
  - {title: "Make WordPress Hosting, WordPress 7.0 compatibility", url: https://make.wordpress.org/hosting/handbook/compatibility/version/7-0/, accessed: 2026-10-23}
  - {title: "Make WordPress Core, WordPress 7.1 release page", url: https://make.wordpress.org/core/7-1/, accessed: 2026-10-23}
---

# WordPress plugin best practices

## TL;DR
- **Current WordPress is 7.1.x** (7.1 released, scheduled for 2026-08-19; 7.1.1 scheduled for 2026-09-17). WordPress 7.0 (released 2026-05-20) raised the **minimum PHP to 7.4**; the Hosting team recommends **PHP 8.4/8.5 and MySQL 8.4** for new installs. Write for **PHP 8.2+** and test on what ERI's host actually runs **(verify with ERI)**.
- Ship one folder, `eri-<thing>/`, with a header, an `ABSPATH` guard, `eri_`-prefixed everything, and a shortcode **or** REST route. Copy `starters/wordpress-plugin/eri-hello/`.
- Security in one line: **validate/sanitize input, check capability, verify nonce, `$wpdb->prepare()`, escape late on output.** REST routes **must** have `permission_callback` (`__return_true` only for public synthetic data).

## Minimal working example
Layout (root stays minimal, per the Handbook): `eri-hello/eri-hello.php` (header + hooks), `uninstall.php`, `includes/data.php` (logic), `assets/` (css/js), `languages/`.

`eri-hello.php`, extending the repo starter with a POST route, a setting and a table:
```php
<?php
/**
 * Plugin Name:       ERI Hello (Hackreation starter)
 * Description:       [eri_jobs] shortcode, REST endpoint and admin page.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      8.2
 * License:           GPL-2.0-or-later
 * Text Domain:       eri-hello
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
define( 'ERI_HELLO_DIR', plugin_dir_path( __FILE__ ) ); define( 'ERI_HELLO_URL', plugin_dir_url( __FILE__ ) );
require_once ERI_HELLO_DIR . 'includes/data.php';

// Register assets once; enqueue only where used. $args array (strategy) needs WP 6.3+.
add_action( 'wp_enqueue_scripts', function () {
	wp_register_style( 'eri-hello', ERI_HELLO_URL . 'assets/eri-hello.css', [], '0.1.0' );
	wp_register_script( 'eri-hello', ERI_HELLO_URL . 'assets/eri-hello.js', [ 'jquery' ], '0.1.0',
		[ 'in_footer' => true, 'strategy' => 'defer' ] );
	wp_localize_script( 'eri-hello', 'eriHello', [ 'root' => esc_url_raw( rest_url( 'eri/v1/' ) ),
		'nonce' => wp_create_nonce( 'wp_rest' ) ] ); // JS sends it as the X-WP-Nonce header
} );

add_action( 'init', fn() => add_shortcode( 'eri_jobs', 'eri_hello_shortcode' ) ); // callback RETURNS html
function eri_hello_shortcode( $atts ) {
	$a    = shortcode_atts( [ 'q' => '', 'limit' => 10 ], $atts, 'eri_jobs' );
	$jobs = eri_hello_search_jobs( sanitize_text_field( $a['q'] ), absint( $a['limit'] ) );
	wp_enqueue_style( 'eri-hello' ); wp_enqueue_script( 'eri-hello' );
	ob_start(); ?>
	<section class="eri-hello" aria-labelledby="eri-hello-title">
		<h2 id="eri-hello-title"><?php esc_html_e( 'Sample jobs', 'eri-hello' ); ?></h2>
		<p role="status"><?php echo esc_html( sprintf( _n( '%d result', '%d results', count( $jobs ), 'eri-hello' ), count( $jobs ) ) ); ?></p>
		<ul><?php foreach ( $jobs as $j ) : ?>
			<li><strong><?php echo esc_html( $j['title'] ); ?></strong>, <?php echo esc_html( $j['employer'] ); ?></li>
		<?php endforeach; ?></ul>
	</section>
	<?php return ob_get_clean();
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'eri/v1', '/jobs', [
		'methods'             => WP_REST_Server::READABLE,
		'permission_callback' => '__return_true', // public, synthetic data only
		'args'                => [ 'q' => [ 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ] ],
		'callback'            => fn( $req ) => rest_ensure_response( eri_hello_search_jobs( (string) $req['q'], 100 ) ),
	] );
	register_rest_route( 'eri/v1', '/saved', [
		'methods'             => WP_REST_Server::CREATABLE,
		'permission_callback' => fn() => current_user_can( 'edit_posts' ), // capability, not just "logged in"
		'args'                => [ 'posting_id' => [ 'required' => true,
			'validate_callback' => fn( $v ) => (bool) preg_match( '/^[A-Z0-9-]{1,10}$/', (string) $v ) ] ],
		'callback'            => 'eri_hello_save',
	] );
} );
function eri_hello_save( WP_REST_Request $req ) { global $wpdb;
	$ok = $wpdb->insert( $wpdb->prefix . 'eri_saved',
		[ 'user_id' => get_current_user_id(), 'posting_id' => $req['posting_id'] ], [ '%d', '%s' ] );
	return $ok ? new WP_REST_Response( [ 'saved' => true ], 201 ) : new WP_Error( 'eri_db', 'Could not save', [ 'status' => 500 ] );
}

// Settings page under Settings > ERI Hello (Settings API handles its own nonce).
add_action( 'admin_init', fn() => register_setting( 'eri_hello', 'eri_hello_options', [ 'type' => 'array',
	'default' => [ 'limit' => 10 ], 'sanitize_callback' => fn( $v ) => [ 'limit' => min( 100, absint( $v['limit'] ?? 10 ) ) ] ] ) );
add_action( 'admin_menu', function () {
	add_options_page( 'ERI Hello', 'ERI Hello', 'manage_options', 'eri-hello', function () {
		if ( ! current_user_can( 'manage_options' ) ) { return; }
		$o = get_option( 'eri_hello_options' ); ?>
		<div class="wrap"><h1><?php esc_html_e( 'ERI Hello', 'eri-hello' ); ?></h1>
		<form method="post" action="options.php"><?php settings_fields( 'eri_hello' ); ?>
			<label for="eri-limit"><?php esc_html_e( 'Results per page', 'eri-hello' ); ?></label>
			<input id="eri-limit" type="number" name="eri_hello_options[limit]" value="<?php echo esc_attr( $o['limit'] ); ?>">
			<?php submit_button(); ?></form></div>
	<?php } );
} );

// Custom table: dbDelta is picky (each column on its own line, two spaces after PRIMARY KEY, KEY not INDEX).
function eri_hello_install() { global $wpdb;
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	dbDelta( "CREATE TABLE {$wpdb->prefix}eri_saved (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user_id bigint(20) unsigned NOT NULL,
  posting_id varchar(10) NOT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY  (id),
  KEY user_id (user_id)
) {$wpdb->get_charset_collate()};" );
	update_option( 'eri_hello_db_version', '1' );
}
register_activation_hook( __FILE__, function ( $network_wide ) { // $network_wide: true on "Network Activate"
	if ( is_multisite() && $network_wide ) {
		foreach ( get_sites( [ 'fields' => 'ids' ] ) as $id ) { switch_to_blog( $id ); eri_hello_install(); restore_current_blog(); }
	} else { eri_hello_install(); }
} );
// Activation does not run on update, nor for sites created later: check a stored schema version
// (per site) instead. Alternative for new sites: hook `wp_initialize_site`.
add_action( 'plugins_loaded', function () { if ( get_option( 'eri_hello_db_version' ) !== '1' ) { eri_hello_install(); } } );
```
Reading with `$wpdb`: placeholders unquoted, `%i` for identifiers (WP 6.2+), `esc_like()` for LIKE.
```php
$rows = $wpdb->get_results( $wpdb->prepare(
	"SELECT * FROM %i WHERE user_id = %d AND posting_id LIKE %s",
	$wpdb->prefix . 'eri_saved', get_current_user_id(), '%' . $wpdb->esc_like( $q ) . '%' ), ARRAY_A );
```
`uninstall.php` (runs when the plugin is deleted, not deactivated):
```php
<?php
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) { die; } global $wpdb;
delete_option( 'eri_hello_options' ); delete_option( 'eri_hello_db_version' );
$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}eri_saved" ); // current site only; looping all sites is costly
```
```js
jQuery(function ($) { // assets/eri-hello.js (jQuery bundled with WordPress)
  $.ajax({ url: eriHello.root + 'saved', method: 'POST', data: { posting_id: 'P001' },
    beforeSend: function (x) { x.setRequestHeader('X-WP-Nonce', eriHello.nonce); } })
   .done(function () { $('#eri-msg').text('Saved'); }); // .text(), never .html() with data
});
```

## Do / Don't checklist
- [ ] **Do** prefix functions, options, transients, handles, tables and the REST namespace (`eri_`, `eri/v1`). Handbook: 4-5+ letter prefix, never `wp_` or `__`. Put an `ABSPATH` guard in every file with top-level code.
- [ ] **Do** register assets on `wp_enqueue_scripts`, enqueue inside the shortcode so they load only where used, and use `[ 'strategy' => 'defer' ]` (WP 6.3+). Declare `jquery` as a dependency; **don't** load jQuery from a CDN.
- [ ] **Do** return (not echo) from shortcodes, using `ob_start()` / `ob_get_clean()`.
- [ ] **Do** give REST `args` a `validate_callback` / `sanitize_callback` and return `WP_Error` with a `status`.
- [ ] **Do** gate admin pages with a capability (`manage_options` for settings). `is_admin()` is **not** a permission check.
- [ ] **Don't** run `CREATE TABLE`, `flush_rewrite_rules()` or HTTP calls on every page load; **don't** use `extract()`, `eval()`, `$_REQUEST` or raw `$_GET` in SQL.
- [ ] **Don't** depend on a paid plugin. For a free dependency, use the `Requires Plugins:` header with its wordpress.org slug (added in WP 6.5 **(verify)**).

## Security
- **Input:** `wp_unslash()` then sanitize: `sanitize_text_field`, `sanitize_textarea_field`, `sanitize_email`, `sanitize_key`, `absint`, `esc_url_raw`. The Handbook says validation (reject) beats sanitization (clean).
- **Authorization:** `current_user_can( 'cap' )` in every REST `permission_callback`, admin page and form handler. **CSRF:** forms use `wp_nonce_field( 'eri_save', 'eri_nonce' )` + `check_admin_referer( 'eri_save', 'eri_nonce' )`; AJAX uses `check_ajax_referer()`; REST uses the `wp_rest` nonce in `X-WP-Nonce` (without it, the API treats the user as logged out). Nonces last 12-24 hours and are **never** authentication.
- **SQL:** `$wpdb->prepare()` with unquoted `%s %d %f %i`, or `$wpdb->insert/update/delete` with format arrays. **Output:** escape late, at the echo: `esc_html`, `esc_attr`, `esc_url`, `esc_textarea`, `wp_kses_post` (for allowed HTML), `esc_html__()` for translated text.
- **Multisite:** only Super Admins have `unfiltered_html`, `install_plugins`, `edit_users` on a network. Don't let your plugin give site admins a path around that (e.g. saving raw HTML from a setting).

## Accessibility
- Every input gets a `<label for>`; admin forms use the standard `form-table` markup and `submit_button()`.
- Result counts and save confirmations go in a `role="status"` region; move focus to new content after submit.
- Use real headings (`h2` in content, `h1` only on admin pages), buttons for actions, links for navigation. Front-end CSS must not remove focus outlines; check contrast against ERI's X theme colors. See `wiki/domain/accessibility.md`.

## Common AI-assistant mistakes to watch for
- `'permission_callback' => '__return_true'` on a **write** route, or no callback at all (WP 5.5+ logs `_doing_it_wrong`). Nonce checked but no capability, or the reverse.
- Quoting placeholders (`'%s'`) inside `prepare()`, or interpolating `$_GET` into SQL "because it's sanitized". Hard-coding `wp_` as the table prefix.
- `echo` inside a shortcode (output jumps to the top of the page); escaping early, then concatenating more data.
- `wp_enqueue_script` outside a hook, hard-coded `<script src>` tags, a second copy of jQuery.
- `.html()` / `innerHTML` with API data. `challenges/02-job-fit-checker/.../app.js` builds HTML strings: fine for fixed copy, unsafe for user or API text.
- Invented functions or arguments: check each at developer.wordpress.org/reference. Text domain as a variable, or `__( "Hi $name" )` instead of `sprintf( __( 'Hi %s', 'eri-hello' ), $name )` with a `/* translators: */` comment.
- Assuming single-site: per-site tables need a per-site install, and network-wide settings use `get_site_option()`.

## How to hand off to ERI
1. Run PHPCS with WordPress Coding Standards (WPCS 3.x, Composer-only) and fix or explain what it reports. Rulesets: `WordPress`, `WordPress-Core`, `WordPress-Extra`, `WordPress-Docs`.
   ```bash
   composer config allow-plugins.dealerdirect/phpcodesniffer-composer-installer true && composer require --dev wp-coding-standards/wpcs:"^3.0"
   vendor/bin/phpcs --standard=WordPress-Extra --extensions=php eri-hello/
   ```
2. Zip the plugin folder (`eri-hello/` at the zip root) with `uninstall.php` and a README listing: what it does, shortcode/route names, options and tables it creates, the capability it needs, and tested WP/PHP versions.
3. State whether it was tested **per-site** or **network-activated** (`Network: true` header only if it must be network-wide). Test on a clean multisite: `wp core multisite-install` in the Docker starter **(verify the command works in the starter image)**. No secrets, no external calls, synthetic data only. List every dependency and why.

## Sources
- [Plugin Handbook, Header Requirements](https://developer.wordpress.org/plugins/plugin-basics/header-requirements/) · [Plugin Handbook, Best Practices](https://developer.wordpress.org/plugins/plugin-basics/best-practices/) · [Common APIs, Security](https://developer.wordpress.org/apis/security/) · [REST API Handbook, Adding Custom Endpoints](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/)
- [REST API Handbook, Authentication](https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/) · [wp_enqueue_script()](https://developer.wordpress.org/reference/functions/wp_enqueue_script/) · [wpdb::prepare()](https://developer.wordpress.org/reference/classes/wpdb/prepare/) · [Creating Tables with Plugins](https://developer.wordpress.org/plugins/creating-tables-with-plugins/)
- [Uninstall Methods](https://developer.wordpress.org/plugins/plugin-basics/uninstall-methods/) · [How to Internationalize Your Plugin](https://developer.wordpress.org/plugins/internationalization/how-to-internationalize-your-plugin/) · [register_setting()](https://developer.wordpress.org/reference/functions/register_setting/) · [Learn WordPress, Multisite plugins](https://learn.wordpress.org/lesson/building-plugins-and-themes-that-support-multisite/)
- [Roles and Capabilities](https://wordpress.org/documentation/article/roles-and-capabilities/) · [WordPress Coding Standards](https://github.com/WordPress/wordpress-coding-standards) · [WordPress 7.0 compatibility (Hosting)](https://make.wordpress.org/hosting/handbook/compatibility/version/7-0/) · [WordPress 7.1 release page](https://make.wordpress.org/core/7-1/)
