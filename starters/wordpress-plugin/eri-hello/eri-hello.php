<?php
/**
 * Plugin Name:  ERI Hello (Hackreation starter)
 * Description:  Hello-world plugin for Hackreation x ERI. Adds a [eri_jobs] shortcode, a REST endpoint and an admin page.
 * Version:      0.1.0
 * Requires PHP:      8.2
 * Author:       Hackreation team
 * License:      MIT
 * Text Domain:  eri-hello
 */

if (!defined('ABSPATH')) exit;

define('ERI_HELLO_DIR', plugin_dir_path(__FILE__));
define('ERI_HELLO_URL', plugin_dir_url(__FILE__));

require_once ERI_HELLO_DIR . 'includes/data.php';

/** [eri_jobs q="cook" limit="10"] - accessible list of synthetic job postings. */
add_shortcode('eri_jobs', function ($atts) {
    $a = shortcode_atts(['q' => '', 'limit' => 10], $atts, 'eri_jobs');
    $jobs = eri_hello_search_jobs($a['q'], (int) $a['limit']);
    wp_enqueue_style('eri-hello', ERI_HELLO_URL . 'assets/eri-hello.css', [], '0.1.0');
    ob_start(); ?>
    <section class="eri-hello" aria-labelledby="eri-hello-title">
      <h2 id="eri-hello-title"><?php echo esc_html__('Hello, ERI! Sample jobs', 'eri-hello'); ?></h2>
      <p role="status"><?php echo esc_html(count($jobs) . ' result(s)'); ?></p>
      <ul>
        <?php foreach ($jobs as $j): ?>
          <li><strong><?php echo esc_html($j['title']); ?></strong>, <?php echo esc_html($j['employer']); ?>
            - <?php echo esc_html($j['neighborhood'] . ', ' . $j['hours_per_week'] . ' h/wk, $' . $j['wage_per_hour'] . '/h'); ?></li>
        <?php endforeach; ?>
      </ul>
    </section>
    <?php return ob_get_clean();
});

/** GET /wp-json/eri/v1/jobs?q=cook */
add_action('rest_api_init', function () {
    register_rest_route('eri/v1', '/jobs', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true', // public synthetic data only
        'args'                => ['q' => ['sanitize_callback' => 'sanitize_text_field']],
        'callback'            => fn($req) => rest_ensure_response(eri_hello_search_jobs((string) $req->get_param('q'), 100)),
    ]);
});

/** Tools > ERI Hello admin page */
add_action('admin_menu', function () {
    add_management_page('ERI Hello', 'ERI Hello', 'manage_options', 'eri-hello', function () {
        echo '<div class="wrap"><h1>ERI Hello</h1><p>Plugin is running. Add <code>[eri_jobs]</code> to any page, or visit <code>/wp-json/eri/v1/jobs</code>.</p></div>';
    });
});
