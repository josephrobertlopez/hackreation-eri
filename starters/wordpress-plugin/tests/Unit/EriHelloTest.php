<?php
declare(strict_types=1);

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

final class EriHelloTest extends TestCase
{
    #[Test]
    public function shortcode_renders_an_accessible_list(): void
    {
        $html = $GLOBALS['sc']['eri_jobs'](['q' => 'cook', 'limit' => 5]);
        $this->assertStringContainsString('Hello, ERI!', $html);
        $this->assertStringContainsString('role="status"', $html);
    }

    #[Test]
    public function search_returns_all_60_jobs_with_empty_query(): void
    {
        $this->assertCount(60, eri_hello_search_jobs('', 100));
    }

    #[Test]
    public function rest_route_is_registered_on_rest_api_init(): void
    {
        $this->assertArrayHasKey('rest_api_init', $GLOBALS['actions']);
    }
}
