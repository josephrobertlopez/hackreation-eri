<?php
declare(strict_types=1);

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/** TDD for the PHP + MySQL starter (runs on SQLite when DB_HOST is unset). */
final class DbTest extends TestCase
{
    #[Test]
    public function h_escapes_html_special_characters(): void
    {
        $this->assertSame('&lt;b&gt;&quot;x&quot; &amp; &#039;y&#039;&lt;/b&gt;', h('<b>"x" & \'y\'</b>'));
    }

    #[Test]
    public function seed_loads_all_60_postings(): void
    {
        ob_start(); require __DIR__ . '/../seed.php'; ob_end_clean();
        $this->assertSame(60, (int) db()->query('SELECT COUNT(*) FROM job_postings')->fetchColumn());
    }
}
