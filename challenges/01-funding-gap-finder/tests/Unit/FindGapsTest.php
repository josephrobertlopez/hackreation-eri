<?php
declare(strict_types=1);

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/**
 * TDD: unit tests for the generic gap check, using tiny in-memory ledgers (no files).
 * Spec: wiki/prds/01-funding-gap-finder.md
 */
final class FindGapsTest extends TestCase
{
    private function row(float $expected, float $claimed): array
    {
        return ['funder' => 'Test', 'client_id' => 'X1', 'period' => '2026-01', 'service' => 's',
                'delivered' => 1, 'claimed' => $claimed > 0 ? 1 : 0,
                'expected_amount' => $expected, 'claimed_amount' => $claimed, 'evidence' => 'N1'];
    }

    /** AC-01.2 / AC-01.5: earned but not (fully) claimed is flagged with the money at stake. */
    #[Test]
    public function it_flags_under_claimed_rows_with_amount_at_stake(): void
    {
        $gaps = find_gaps([$this->row(500, 0)]);
        $this->assertCount(1, $gaps);
        $this->assertStringStartsWith('UNDER-CLAIMED', $gaps[0]['flag']);
        $this->assertSame(500.0, $gaps[0]['amount_at_stake']);
    }

    /** AC-01.6: claimed more than earned is a RISK with a negative amount. */
    #[Test]
    public function it_flags_over_claims_as_risk_with_negative_amount(): void
    {
        $gaps = find_gaps([$this->row(100, 200)]);
        $this->assertStringStartsWith('OVER-CLAIMED', $gaps[0]['flag']);
        $this->assertLessThan(0, $gaps[0]['amount_at_stake']);
    }

    /** A matching claim produces no flag. */
    #[Test]
    public function it_ignores_rows_that_match(): void
    {
        $this->assertSame([], find_gaps([$this->row(1600, 1600)]));
    }

    /** AC-01.3: a not-employed month has expected $0, so nothing is flagged. */
    #[Test]
    public function it_does_not_flag_zero_expected_unclaimed_months(): void
    {
        $this->assertSame([], find_gaps([$this->row(0, 0)]));
    }

    /** AC-01.7: evidence survives into the flag. */
    #[Test]
    public function it_keeps_the_evidence_on_each_flag(): void
    {
        $this->assertSame('N1', find_gaps([$this->row(10, 0)])[0]['evidence']);
    }
}
