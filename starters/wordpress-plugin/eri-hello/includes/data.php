<?php
if (!defined('ABSPATH')) exit;

/** Load bundled synthetic CSV once per request. Swap for $wpdb queries when you need a table. */
function eri_hello_jobs(): array {
    static $rows = null;
    if ($rows !== null) return $rows;
    $rows = [];
    $f = fopen(ERI_HELLO_DIR . 'data/job_postings.csv', 'r');
    $head = fgetcsv($f, null, ',', '"', '');
    while (($r = fgetcsv($f, null, ',', '"', '')) !== false) $rows[] = array_combine($head, $r);
    fclose($f);
    return $rows;
}

function eri_hello_search_jobs(string $q = '', int $limit = 10): array {
    $q = strtolower(trim($q));
    $hits = array_filter(eri_hello_jobs(), fn($j) => $q === '' ||
        str_contains(strtolower($j['title'] . ' ' . $j['neighborhood'] . ' ' . $j['category']), $q));
    return array_slice(array_values($hits), 0, max(1, $limit));
}
