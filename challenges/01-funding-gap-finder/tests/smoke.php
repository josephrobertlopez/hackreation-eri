<?php
// php tests/test.php  - checks the hello world against the planted data.
require __DIR__ . '/../src/etl.php';
$gaps = find_gaps(build_ledger());
$count = fn($f, $neg = false) => count(array_filter($gaps, fn($g) => $g['funder'] === $f && (($g['amount_at_stake'] < 0) === $neg)));
$fails = 0;
$ok = function ($c, $m) use (&$fails) { echo ($c ? 'PASS ' : 'FAIL ') . "$m\n"; if (!$c) $fails++; };
$ok($count('DVR') === 3, 'DVR: 3 missed monthly invoices found');
$ok(count(array_filter($gaps, fn($g) => $g['funder']==='DVR' && in_array($g['client_id'], ['C002','C021']))) === 0, 'DVR: not-employed months NOT flagged');
$ok($count('Ticket') === 5, 'Ticket: 5 unclaimed payments found');
$ok($count('County') === 10, 'County: 10 under-claimed months found');
$ok($count('County', true) === 4, 'County: 4 over-claims flagged as risk');
exit($fails ? 1 : 0);
