<?php
// Minimal WordPress function stubs so plugin logic can be unit-tested without WordPress.
// (For full integration tests use wp-env + the WP test suite; see wiki/stack/wordpress-plugin.md.)
require __DIR__ . '/../vendor/autoload.php';
define('ABSPATH', __DIR__);
$GLOBALS['sc'] = []; $GLOBALS['actions'] = [];
function plugin_dir_path($f) { return dirname($f) . '/'; }
function plugin_dir_url($f) { return 'http://example.test/'; }
function add_shortcode($t, $cb) { $GLOBALS['sc'][$t] = $cb; }
function add_action($h, $cb) { $GLOBALS['actions'][$h] = $cb; }
function shortcode_atts($d, $a) { return array_merge($d, (array) $a); }
function wp_enqueue_style(...$a) {}
function esc_html($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
function esc_html__($s) { return esc_html($s); }
require __DIR__ . '/../eri-hello/eri-hello.php';
