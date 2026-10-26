<?php
declare(strict_types=1);

use Behat\Behat\Context\Context;

require_once __DIR__ . '/../../src/etl.php';

/** BDD step definitions for features/funding_gaps.feature. */
final class FeatureContext implements Context
{
    private array $ledger = [];
    private array $gaps = [];

    /** @Given the synthetic exports for DVR, Ticket to Work and the county contract */
    public function theSyntheticExports(): void
    {
        foreach (['dvr/invoices.csv', 'ticket/monthly_earnings.csv', 'county/claims.csv'] as $f) {
            if (!is_file(data_dir() . "/$f")) throw new RuntimeException("Missing data/$f");
        }
    }

    /** @When I build the ledger and run the gap check */
    public function iBuildTheLedgerAndRunTheGapCheck(): void
    {
        $this->ledger = build_ledger();
        $this->gaps = find_gaps($this->ledger);
    }

    /** @Then the ledger contains rows for :a, :b and :c */
    public function theLedgerContainsRowsFor(string $a, string $b, string $c): void
    {
        $funders = array_unique(array_column($this->ledger, 'funder'));
        foreach ([$a, $b, $c] as $f) {
            if (!in_array($f, $funders, true)) throw new RuntimeException("No ledger rows for $f");
        }
    }

    /** @Then there are :n under-claimed flags for :funder */
    public function underClaimed(int $n, string $funder): void
    {
        $this->assertCount($n, fn ($g) => $g['funder'] === $funder && $g['amount_at_stake'] > 0, "under-claimed $funder");
    }

    /** @Then there are :n over-claimed flags for :funder */
    public function overClaimed(int $n, string $funder): void
    {
        $this->assertCount($n, fn ($g) => $g['funder'] === $funder && $g['amount_at_stake'] < 0, "over-claimed $funder");
    }

    /** @Then every over-claimed flag has a negative amount at stake */
    public function overClaimsAreNegative(): void
    {
        foreach ($this->gaps as $g) {
            if (str_starts_with($g['flag'], 'OVER') && $g['amount_at_stake'] >= 0) throw new RuntimeException('Over-claim with non-negative amount');
        }
    }

    /** @Then client :id has no flags */
    public function clientHasNoFlags(string $id): void
    {
        $this->assertCount(0, fn ($g) => $g['client_id'] === $id, "flags for $id");
    }

    /** @Then every flag has evidence */
    public function everyFlagHasEvidence(): void
    {
        foreach ($this->gaps as $g) {
            if (trim((string) $g['evidence']) === '') throw new RuntimeException('Flag without evidence');
        }
    }

    private function assertCount(int $n, callable $pred, string $what): void
    {
        $got = count(array_filter($this->gaps, $pred));
        if ($got !== $n) throw new RuntimeException("Expected $n $what, got $got");
    }
}
