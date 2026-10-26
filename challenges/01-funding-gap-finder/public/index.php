<?php
require __DIR__ . '/../src/etl.php';
$gaps = find_gaps(build_ledger());
$funder = $_GET['funder'] ?? '';
if ($funder) $gaps = array_values(array_filter($gaps, fn($g) => $g['funder'] === $funder));
usort($gaps, fn($a, $b) => abs($b['amount_at_stake']) <=> abs($a['amount_at_stake']));
$total = array_sum(array_map(fn($g) => max(0, $g['amount_at_stake']), $gaps));
$h = fn($s) => htmlspecialchars((string) $s, ENT_QUOTES);
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Funding gap finder - Hello ERI</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:70rem;margin:auto;padding:1rem}table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid #ccc;padding:.4rem;text-align:left}th{background:#f2f2f2}.risk{color:#a00;font-weight:600}.visually-hidden{position:absolute;left:-9999px}select,button{font:inherit;padding:.4rem}</style></head>
<body><main><h1>Hello, ERI! Funding gap finder</h1>
<p><strong>Synthetic data.</strong> Flags are for human review. Nothing is billed automatically.</p>
<form method="get"><label for="funder">Funder</label>
<select id="funder" name="funder"><option value="">All</option><?php foreach (['DVR','Ticket','County'] as $f): ?><option <?= $f===$funder?'selected':'' ?>><?= $f ?></option><?php endforeach; ?></select>
<button>Filter</button></form>
<p role="status"><?= count($gaps) ?> flags · under-claimed total: $<?= number_format($total, 2) ?></p>
<table><caption class="visually-hidden">Flags</caption><thead><tr><th scope="col">Funder</th><th scope="col">Client</th><th scope="col">Period</th><th scope="col">Service</th><th scope="col">Expected</th><th scope="col">Claimed</th><th scope="col">Flag</th><th scope="col">Evidence</th></tr></thead><tbody>
<?php foreach ($gaps as $g): ?><tr><td><?= $h($g['funder']) ?></td><td><?= $h($g['client_id']) ?></td><td><?= $h($g['period']) ?></td><td><?= $h($g['service']) ?></td><td>$<?= number_format($g['expected_amount'], 2) ?></td><td>$<?= number_format($g['claimed_amount'], 2) ?></td><td class="<?= $g['amount_at_stake']<0?'risk':'' ?>"><?= $h($g['flag']) ?></td><td><?= $h($g['evidence']) ?></td></tr><?php endforeach; ?>
</tbody></table></main></body></html>
