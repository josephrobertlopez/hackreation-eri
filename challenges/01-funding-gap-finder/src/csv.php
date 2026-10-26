<?php
/** Read a CSV into an array of associative rows. */
function read_csv(string $path): array {
    $f = fopen($path, 'r');
    $head = fgetcsv($f, null, ',', '"', '');
    $rows = [];
    while (($r = fgetcsv($f, null, ',', '"', '')) !== false) $rows[] = array_combine($head, $r);
    fclose($f);
    return $rows;
}
function write_csv(string $path, array $rows, array $cols): void {
    $f = fopen($path, 'w');
    fputcsv($f, $cols, ',', '"', '');
    foreach ($rows as $r) fputcsv($f, array_map(fn($c) => $r[$c] ?? '', $cols), ',', '"', '');
    fclose($f);
}
// This challenge reads its OWN copy of the data (challenges stay decoupled).
function data_dir(): string { return realpath(__DIR__ . '/../data'); }
