<?php
/**
 * Plugin Name: ERI Inclusive Job Post Checker (Hackreation)
 * Description: [eri_job_post_checker] shortcode - employers paste a job post and get inclusive-language suggestions. Runs in the browser; nothing is stored.
 * Version: 0.1.0
 * Requires PHP: 8.2
 * License: MIT
 */
if (!defined('ABSPATH')) exit;

add_shortcode('eri_job_post_checker', function () {
    $u = plugin_dir_url(__FILE__) . 'assets/';
    wp_enqueue_style('eri-jpc', $u . 'style.css', [], '0.1.0');
    wp_enqueue_script('eri-jpc-core', $u . 'checker.js', [], '0.1.0', true);
    wp_enqueue_script('eri-jpc-app', $u . 'app.js', ['eri-jpc-core'], '0.1.0', true);
    return file_get_contents(__DIR__ . '/assets/form.html');
});
