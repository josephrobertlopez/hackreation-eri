<?php
// Usage: php seed.php   -> creates tables and loads data/job_postings.csv
require_once __DIR__ . '/src/db.php';
$pdo = db();
$pdo->exec(file_get_contents(__DIR__ . '/sql/schema.sql'));
$pdo->exec('DELETE FROM job_postings');
$f = fopen((is_file('/data/job_postings.csv') ? '/data/job_postings.csv' : __DIR__ . '/../../data/job_postings.csv'), 'r');
$head = fgetcsv($f, escape: '');
$sql = 'INSERT INTO job_postings (' . implode(',', $head) . ') VALUES (' . rtrim(str_repeat('?,', count($head)), ',') . ')';
$ins = $pdo->prepare($sql);
$n = 0;
while (($row = fgetcsv($f, escape: '')) !== false) { $ins->execute($row); $n++; }
echo "Seeded $n job postings\n";
