<?php
declare(strict_types=1);

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/**
 * TDD: the ETL against this challenge's own synthetic data (challenges/01-funding-gap-finder/data/).
 * Spec: wiki/prds/01-funding-gap-finder.md
 */
final class EtlTest extends TestCase
{
    /** AC-01.1: all three funders end up in one ledger with identical columns. */
    #[Test]
    public function it_builds_one_ledger_with_the_same_columns_for_every_funder(): void
    {
        $ledger = build_ledger();
        $funders = array_unique(array_column($ledger, 'funder'));
        sort($funders);
        $this->assertSame(['County', 'DVR', 'Ticket'], $funders);
        foreach ($ledger as $row) {
            $this->assertSame(LEDGER_COLS, array_keys($row));
        }
    }

    /** AC-01.3: DVR "not employed" months are expected $0. */
    #[Test]
    public function it_sets_expected_to_zero_for_not_employed_months(): void
    {
        $notEmployed = array_filter(etl_dvr_monthly(data_dir()), fn ($r) => $r['delivered'] === 0);
        $this->assertNotEmpty($notEmployed);
        foreach ($notEmployed as $r) {
            $this->assertSame(0, $r['expected_amount']);
        }
    }

    /** AC-01.4: Ticket months without a pay stub are not claimable, so they're absent from the ledger. */
    #[Test]
    public function it_skips_ticket_months_without_a_pay_stub(): void
    {
        foreach (etl_ticket(data_dir()) as $r) {
            $this->assertStringContainsString('pay stub on file', $r['evidence']);
        }
    }
}
