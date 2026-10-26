<?php
// No-WordPress smoke test: stubs the few WP functions the plugin calls.
// Run: php tests/smoke.php
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
$html = $GLOBALS['sc']['eri_jobs'](['q' => 'cook', 'limit' => 5]);
assert(str_contains($html, 'Hello, ERI!'));
echo (str_contains($html, 'Hello, ERI!') ? "PASS" : "FAIL") . " shortcode renders\n";
echo (count(eri_hello_search_jobs('', 100)) === 60 ? "PASS" : "FAIL") . " loads 60 jobs\n";
$ok = isset($GLOBALS['actions']['rest_api_init']) && str_contains($html, 'Hello, ERI!') && count(eri_hello_search_jobs('', 100)) === 60;
echo (isset($GLOBALS['actions']['rest_api_init']) ? "PASS" : "FAIL") . " REST route hooked\n";
exit($ok ? 0 : 1);
