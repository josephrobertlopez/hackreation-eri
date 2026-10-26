<?php
/**
 * Plugin Name: ERI Job Fit Checker (Hackreation)
 * Description: [eri_job_fit] shortcode - "Is this job right for me?" estimator. Runs in the browser; no data is sent or stored.
 * Version: 0.1.0
 * Requires PHP: 8.2
 * License: MIT
 */
if (!defined('ABSPATH')) exit;

add_shortcode('eri_job_fit', function () {
    $u = plugin_dir_url(__FILE__) . 'assets/';
    wp_enqueue_style('eri-job-fit', $u . 'style.css', [], '0.1.0');
    wp_enqueue_script('eri-job-fit-core', $u . 'job-fit.js', [], '0.1.0', true);
    wp_enqueue_script('eri-job-fit-app', $u . 'app.js', ['eri-job-fit-core'], '0.1.0', true);
    $html = file_get_contents(__DIR__ . '/assets/form.html');
    return $html;
});
