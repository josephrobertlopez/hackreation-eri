<?php
/**
 * ETL: turn three different funders' exports into ONE common ledger.
 *
 *   ledger row = funder, client_id, period, service, delivered, claimed,
 *                expected_amount, claimed_amount, evidence
 *
 * Once every funder looks like this, ONE gap check works for all of them.
 * Implemented: county units, DVR monthly support (SE-MSI / SE-RET), Ticket to Work.
 * TODO (teams): DVR Job Development & Hire incl. preferred outcome, late reports,
 *               Ticket missing-evidence months.
 */
require_once __DIR__ . '/csv.php';

const LEDGER_COLS = ['funder', 'client_id', 'period', 'service', 'delivered', 'claimed',
                     'expected_amount', 'claimed_amount', 'evidence'];

function etl_county(string $d): array {
    $key = fn($r) => $r['client_id'] . '|' . $r['month'];
    $del = []; foreach (read_csv("$d/county/units_delivered.csv") as $r) $del[$key($r)] = (int) $r['units_delivered'];
    $out = [];
    foreach (read_csv("$d/county/claims.csv") as $c) {
        $u = $del[$key($c)] ?? 0;
        $out[] = ['funder' => 'County', 'client_id' => $c['client_id'], 'period' => $c['month'],
            'service' => 'units', 'delivered' => $u, 'claimed' => (int) $c['units_claimed'],
            'expected_amount' => $u * (float) $c['rate_per_unit'],
            'claimed_amount' => (int) $c['units_claimed'] * (float) $c['rate_per_unit'],
            'evidence' => "units_delivered.csv $u units"];
    }
    return $out;
}

function etl_dvr_monthly(string $d): array {
    $rates = []; foreach (read_csv("$d/dvr/fee_schedule.csv") as $r) $rates[$r['service_code']] = (float) $r['rate'];
    $billed = [];
    foreach (read_csv("$d/dvr/invoices.csv") as $i)
        if ($i['service_month'] !== '') $billed[$i['client_id'] . '|' . $i['service_code'] . '|' . $i['service_month']] = (float) $i['amount'];
    $out = [];
    foreach (read_csv("$d/dvr/service_notes.csv") as $n) {
        if (!in_array($n['service_code'], ['SE-MSI', 'SE-RET'], true)) continue;
        if (!preg_match('/^Month (\d+)/', $n['note_text'], $m)) continue;
        $notEmployed = stripos($n['note_text'], 'not employed') !== false;   // DVR pays only months employed
        $k = $n['client_id'] . '|' . $n['service_code'] . '|' . $m[1];
        $out[] = ['funder' => 'DVR', 'client_id' => $n['client_id'], 'period' => 'month ' . $m[1],
            'service' => $n['service_code'], 'delivered' => $notEmployed ? 0 : 1, 'claimed' => isset($billed[$k]) ? 1 : 0,
            'expected_amount' => $notEmployed ? 0 : $rates[$n['service_code']],
            'claimed_amount' => $billed[$k] ?? 0, 'evidence' => $n['note_id']];
    }
    return $out;
}

function etl_ticket(string $d): array {
    // Simplified 2026 rules (see data/README.md): P1-M1 first month >= $1,210; P1-M2 3rd such month;
    // then P2 each month > $1,690 (SGA). Months without a pay stub are skipped (can't claim without evidence).
    $claims = []; foreach (read_csv("$d/ticket/payment_requests.csv") as $c) $claims[$c['beneficiary_id'] . '|' . $c['month']] = $c;
    $out = []; $state = [];
    foreach (read_csv("$d/ticket/monthly_earnings.csv") as $e) {
        $b = $e['beneficiary_id']; $s = &$state[$b]; $s ??= ['twp' => 0, 'm1' => false, 'm2' => false];
        if ($e['pay_stub_on_file'] !== 'TRUE') continue;
        $g = (int) $e['gross_earnings'];
        if ($g >= 1210) $s['twp']++;
        if (!$s['m1'] && $g >= 1210) { $s['m1'] = true; $type = 'P1-M1'; $amt = 1904; }
        elseif ($s['m1'] && !$s['m2'] && $s['twp'] >= 3) { $s['m2'] = true; $type = 'P1-M2'; $amt = 1904; }
        elseif ($s['m2'] && $g > 1690) { $type = 'P2'; $amt = 571; }
        else continue;
        $c = $claims["$b|{$e['month']}"] ?? null;
        $out[] = ['funder' => 'Ticket', 'client_id' => $b, 'period' => $e['month'], 'service' => $type,
            'delivered' => 1, 'claimed' => $c ? 1 : 0, 'expected_amount' => $amt,
            'claimed_amount' => $c ? (float) $c['amount_claimed'] : 0, 'evidence' => "gross \$$g, pay stub on file"];
        unset($s);
    }
    return $out;
}

function build_ledger(): array {
    $d = data_dir();
    return array_merge(etl_dvr_monthly($d), etl_ticket($d), etl_county($d));
}

/** The ONE generic check: money earned but not claimed, or claimed but not earned. */
function find_gaps(array $ledger): array {
    $gaps = [];
    foreach ($ledger as $r) {
        $diff = (float) $r['expected_amount'] - (float) $r['claimed_amount'];
        if ($diff > 0) $gaps[] = $r + ['flag' => 'UNDER-CLAIMED: review and claim if documented', 'amount_at_stake' => $diff];
        if ($diff < 0) $gaps[] = $r + ['flag' => 'OVER-CLAIMED: risk, correct before submitting', 'amount_at_stake' => $diff];
    }
    return $gaps;
}

if (PHP_SAPI === 'cli' && realpath($argv[0] ?? '') === __FILE__) {
    $ledger = build_ledger();
    write_csv(__DIR__ . '/../ledger.csv', $ledger, LEDGER_COLS);
    $gaps = find_gaps($ledger);
    echo "Hello, ERI! Ledger rows: " . count($ledger) . " | flags: " . count($gaps) . "\n";
    $by = []; foreach ($gaps as $g) { $by[$g['funder']] = ($by[$g['funder']] ?? 0) + $g['amount_at_stake']; }
    foreach ($by as $f => $amt) printf("  %-7s net at stake: $%s\n", $f, number_format($amt, 2));
    echo "Wrote ledger.csv. A person reviews every flag. Nothing is billed automatically.\n";
}
