<?php
// One PDO connection. MySQL when DB_HOST is set (Docker / ERI hosting),
// otherwise a local SQLite file so `php -S` works with zero setup.
function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $host = getenv('DB_HOST');
    if ($host) {
        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            $host, getenv('DB_PORT') ?: '3306', getenv('DB_NAME') ?: 'eri');
        $pdo = new PDO($dsn, getenv('DB_USER') ?: 'eri', getenv('DB_PASS') ?: 'eri');
    } else {
        $pdo = new PDO('sqlite:' . __DIR__ . '/../eri.sqlite');
    }
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
}

function h(?string $s): string { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
