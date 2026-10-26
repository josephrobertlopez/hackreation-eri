---
title: WordPress block (Gutenberg) best practices
summary: How to build a block ERI staff can edit (block.json apiVersion 3, create-block, wp-scripts, static vs dynamic render.php, Interactivity API, block accessibility) and when a shortcode is the better choice on ERI's X/Cornerstone sites.
tags: [wordpress, gutenberg, block, block-json, interactivity-api, accessibility, shortcode, hackathon]
last_verified: 2026-10-23
next_review: 2027-01-15
review_owner: ERI senior web developer
confidence: medium
sources:
  - {title: "Block Editor Handbook, Metadata in block.json", url: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/, accessed: 2026-10-23}
  - {title: "Block Editor Handbook, Get started with create-block", url: https://developer.wordpress.org/block-editor/getting-started/devenv/get-started-with-create-block/, accessed: 2026-10-23}
  - {title: "@wordpress/create-block package reference", url: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/, accessed: 2026-10-23}
  - {title: "@wordpress/scripts package reference", url: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/, accessed: 2026-10-23}
  - {title: "Block Editor Handbook, Static or Dynamic rendering of a block", url: https://developer.wordpress.org/block-editor/getting-started/fundamentals/static-dynamic-rendering/, accessed: 2026-10-23}
  - {title: "Interactivity API reference", url: https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/, accessed: 2026-10-23}
  - {title: "Interactivity API, API reference (directives and store)", url: https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/api-reference/, accessed: 2026-10-23}
  - {title: "Block Editor Handbook, Accessibility", url: https://developer.wordpress.org/block-editor/how-to-guides/accessibility/, accessed: 2026-10-23}
  - {title: "Make WordPress Core, Iframed Editor Changes in WordPress 7.0", url: https://make.wordpress.org/core/2026/02/24/iframed-editor-changes-in-wordpress-7-0/, accessed: 2026-10-23}
  - {title: "Common APIs, Security: Escaping Data", url: https://developer.wordpress.org/apis/security/escaping/, accessed: 2026-10-23}
  - {title: "wp_interactivity_data_wp_context() reference", url: https://developer.wordpress.org/reference/functions/wp_interactivity_data_wp_context/, accessed: 2026-10-23}
  - {title: "@wordpress/api-fetch package reference", url: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-api-fetch/, accessed: 2026-10-23}
---

# WordPress block (Gutenberg) best practices

## TL;DR
- Use a block when **ERI staff will edit the content** in the block editor. Use a **shortcode** when the output is data-driven, or when the page is built in **Cornerstone (Themeco X/Pro)**, which ERI's main site appears to use. Best handoff: one plugin with a **dynamic block and a shortcode sharing the same PHP render function**.
- `block.json` with `"apiVersion": 3` (introduced in WP 6.3). In WP 7.0 the post editor is iframed only if **every block in the post** is v3+; the iframe is **not enforced** in 7.0 but is planned, so v2 blocks are a liability.
- Scaffold with `npx @wordpress/create-block@latest` (Node **>= 22.13.0** per the package docs). `wp-scripts build --blocks-manifest` plus `wp_register_block_types_from_metadata_collection()` (WP 6.8+) is what `starters/eri-job-card/` uses.
- Prefer **dynamic** (`render.php`) blocks for hackathon code: changing markup later doesn't trigger "This block contains unexpected or invalid content".

## Minimal working example
Scaffold (dynamic variant), then build:
```bash
npx @wordpress/create-block@latest --namespace="eri" --slug="eri-job-card" --variant="dynamic"
cd eri-job-card && npm start          # watch; `npm run build` for production, `npm run plugin-zip` to ship
```
For `viewScriptModule` add `--experimental-modules` to the `build` and `start` scripts (`wp-scripts build --blocks-manifest --experimental-modules`), or scaffold with `--template @wordpress/create-block-interactive-template` **(verify template name in the External Project Templates guide)**.
`src/eri-job-card/block.json` (same attributes as the repo starter, plus `render` and a view module):
```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "eri/eri-job-card",
  "version": "0.1.0",
  "title": "ERI Job Card",
  "category": "widgets",
  "icon": "id-alt",
  "textdomain": "eri-job-card",
  "supports": { "html": false, "interactivity": true },
  "attributes": {
    "title":          { "type": "string", "default": "Dishwasher" },
    "employer":       { "type": "string", "default": "Cream City Cafe" },
    "hours":          { "type": "number", "default": 20 },
    "wage":           { "type": "string", "default": "14.00" },
    "accommodations": { "type": "string", "default": "Flexible schedule; written instructions" }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "render": "file:./render.php",
  "viewScriptModule": "file:./view.js"
}
```
`src/eri-job-card/render.php` (receives `$attributes`, `$content`, `$block`; escape everything):
```php
<?php
$a  = $attributes;
$id = wp_unique_id( 'eri-acc-' );
?>
<article <?php echo get_block_wrapper_attributes(); ?>
	aria-label="<?php echo esc_attr( sprintf( __( '%1$s at %2$s', 'eri-job-card' ), $a['title'], $a['employer'] ) ); ?>"
	data-wp-interactive="eri/job-card" <?php echo wp_interactivity_data_wp_context( [ 'open' => false ] ); ?>>
	<h3><?php echo esc_html( $a['title'] ); ?></h3>
	<p><?php echo esc_html( sprintf( '%s · %d h/wk · $%s/h', $a['employer'], $a['hours'], $a['wage'] ) ); ?></p>
	<button type="button" data-wp-on--click="actions.toggle" data-wp-bind--aria-expanded="context.open"
		aria-controls="<?php echo esc_attr( $id ); ?>"><?php esc_html_e( 'Accommodations', 'eri-job-card' ); ?></button>
	<p id="<?php echo esc_attr( $id ); ?>" data-wp-bind--hidden="!context.open"><?php echo esc_html( $a['accommodations'] ); ?></p>
</article>
```
`src/eri-job-card/view.js` (Interactivity API; namespace must match `data-wp-interactive`):
```js
import { store, getContext } from '@wordpress/interactivity';
store( 'eri/job-card', {
	actions: { toggle: () => { const ctx = getContext(); ctx.open = ! ctx.open; } },
} );
```
`save.js` for a dynamic block returns `null` (only the comment delimiter and attributes are stored):
```js
export default function save() { return null; }
```
Keep `edit.js` from the starter: `InspectorControls` + labelled `TextControl`s, `useBlockProps()` on the wrapper. Render a live preview in the editor with `ServerSideRender` only if needed **(verify package status before adding)**.

**Shortcode fallback for Cornerstone pages** (same plugin, same output):
```php
add_action( 'init', function () {
	wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	add_shortcode( 'eri_job_card', function ( $atts ) {
		$atts = shortcode_atts( [ 'title' => 'Dishwasher', 'employer' => 'Cream City Cafe', 'hours' => 20,
			'wage' => '14.00', 'accommodations' => '' ], $atts, 'eri_job_card' );
		return render_block( [ 'blockName' => 'eri/eri-job-card', 'attrs' => array_map( 'sanitize_text_field', $atts ),
			'innerBlocks' => [], 'innerHTML' => '', 'innerContent' => [] ] );
	} );
} );
```
Usage in any Cornerstone text/raw element or classic page: `[eri_job_card title="Line cook" hours="25"]` **(verify which Cornerstone element ERI uses for shortcodes)**. Cast `hours` with `absint()` in render.php if it can come from a shortcode.

## Do / Don't checklist
- [ ] **Do** use `apiVersion: 3`, `$schema`, `textdomain`, and `file:` paths in `block.json`; register from metadata, not by hand.
- [ ] **Do** prefix the block name with the `eri/` namespace and keep the plugin slug `eri-*`.
- [ ] **Do** use `useBlockProps()` in edit, `useBlockProps.save()` in static save, `get_block_wrapper_attributes()` in render.php.
- [ ] **Do** commit `build/` for the handoff (the starter does) so ERI can activate without Node, and pin `@wordpress/*` versions instead of `"latest"`.
- [ ] **Do** use `viewScriptModule` for Interactivity API code and `viewScript` for classic scripts (they're not compatible with each other).
- [ ] **Don't** change a static block's `save()` output after content exists: saved posts fail validation. Add a `deprecated` entry or go dynamic.
- [ ] **Don't** fetch data in `save()` or put secrets in block attributes (attributes are stored in post content, visible in the editor and REST).
- [ ] **Don't** add React libraries the editor already provides; import from `@wordpress/element`, `@wordpress/components`, `@wordpress/i18n`.

## Security
- Attributes are user-editable input. Escape in render.php (`esc_html`, `esc_attr`, `esc_url`, `wp_kses_post` for intended HTML).
- Validate attribute types in `block.json` (`type`, `enum`) and cast in PHP (`absint`, `(float)`).
- `data-wp-context` must be valid JSON: build it with `wp_interactivity_data_wp_context( $array )` (WP 6.5+), never by string concatenation.
- Make REST calls from the editor with `apiFetch` (`@wordpress/api-fetch`); when WordPress loads it, it registers root-URL and nonce middleware so `X-WP-Nonce` is sent. The route still needs a real `permission_callback`.

## Accessibility
- Every editor control needs a visible label (`TextControl label=`). Don't hide settings only in the toolbar.
- Front-end markup: one meaningful heading level that fits the page (the starter uses `h3`), real `<button>` for toggles with `aria-expanded` + `aria-controls`, `hidden` for collapsed panels.
- The Handbook asks that **all content sit inside landmarks**; a block is content inside the theme's `main`, so don't add extra `<main>` or `role="region"` wrappers without a label.
- Check keyboard order, visible focus and contrast in both the editor and the X theme front end. See `wiki/domain/accessibility.md` (WCAG 2.2 AA).

## Common AI-assistant mistakes to watch for
- Emitting `apiVersion: 2` (or 1), `registerBlockType` with all metadata in JS, or old `wp.blocks` globals with no build.
- Static blocks whose `save()` uses `Date.now()`, random IDs or fetched data, which causes validation errors on reload.
- Forgetting `--blocks-manifest` / the manifest file, so `wp_register_block_types_from_metadata_collection()` registers nothing.
- `dangerouslySetInnerHTML` or unescaped `echo $attributes['x']` in render.php.
- Mixing `viewScript` and Interactivity API imports; forgetting `"interactivity": true` in `supports`.
- Assuming the site uses the block editor everywhere. ERI's Cornerstone pages may never show your block, so ship the shortcode too.
- `"latest"` dependencies (as in the starter's `package.json`) left in for the handoff, so the build differs next month.

## How to hand off to ERI
1. `npm run build` then `npm run plugin-zip`. The zip must have a root folder named after the plugin.
2. README: block name, attributes, shortcode equivalent, tested WP version (7.1.x) and Node version, and whether `build/` is committed.
3. Show the block in the block editor **and** the shortcode on a Cornerstone or classic page; note which ERI site(s) it targets on the multisite.
4. Run `npm run lint:js` and `lint:css`; run PHPCS on PHP files (see [wordpress-plugin.md](wordpress-plugin.md)).

## Sources
- [Metadata in block.json](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/) · [Get started with create-block](https://developer.wordpress.org/block-editor/getting-started/devenv/get-started-with-create-block/) · [@wordpress/create-block](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/) · [@wordpress/scripts](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [Static or Dynamic rendering](https://developer.wordpress.org/block-editor/getting-started/fundamentals/static-dynamic-rendering/) · [Interactivity API](https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/) · [Interactivity API reference](https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/api-reference/) · [Block Editor accessibility](https://developer.wordpress.org/block-editor/how-to-guides/accessibility/)
- [Iframed Editor Changes in WordPress 7.0](https://make.wordpress.org/core/2026/02/24/iframed-editor-changes-in-wordpress-7-0/) · [Escaping Data](https://developer.wordpress.org/apis/security/escaping/) · [wp_interactivity_data_wp_context()](https://developer.wordpress.org/reference/functions/wp_interactivity_data_wp_context/) · [@wordpress/api-fetch](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-api-fetch/)
