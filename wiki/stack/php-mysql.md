---
title: Plain PHP + MySQL best practices
summary: Supported PHP versions in late 2026, PDO prepared statements, error modes, utf8mb4, password_hash, sessions and CSRF tokens, escaping, uploads, env-var config, the dev-only built-in server, PSR-12 and phpMyAdmin safety, matched to starters/php-mysql.
tags: [php, mysql, pdo, security, csrf, sessions, phpmyadmin, psr-12, hackathon]
last_verified: 2026-10-23
next_review: 2027-01-05
review_owner: ERI senior web developer
confidence: high
sources:
  - {title: "PHP Supported Versions", url: https://www.php.net/supported-versions.php, accessed: 2026-10-23}
  - {title: "PHP Manual, Prepared statements and stored procedures (PDO)", url: https://www.php.net/manual/en/pdo.prepared-statements.php, accessed: 2026-10-23}
  - {title: "PHP Manual, PDO Errors and error handling", url: https://www.php.net/manual/en/pdo.error-handling.php, accessed: 2026-10-23}
  - {title: "PHP Manual, password_hash", url: https://www.php.net/manual/en/function.password-hash.php, accessed: 2026-10-23}
  - {title: "PHP Manual, htmlspecialchars", url: https://www.php.net/manual/en/function.htmlspecialchars.php, accessed: 2026-10-23}
  - {title: "PHP Manual, Securing Session INI Settings", url: https://www.php.net/manual/en/session.security.ini.php, accessed: 2026-10-23}
  - {title: "PHP Manual, POST method uploads", url: https://www.php.net/manual/en/features.file-upload.post-method.php, accessed: 2026-10-23}
  - {title: "PHP Manual, Built-in web server", url: https://www.php.net/manual/en/features.commandline.webserver.php, accessed: 2026-10-23}
  - {title: "MySQL 8.4 Reference Manual, The utf8mb4 Character Set", url: https://dev.mysql.com/doc/refman/8.4/en/charset-unicode-utf8mb4.html, accessed: 2026-10-23}
  - {title: "MySQL 8.4 Reference Manual, Unicode Character Sets (collations)", url: https://dev.mysql.com/doc/refman/8.4/en/charset-unicode-sets.html, accessed: 2026-10-23}
  - {title: "Oracle, MySQL Server Versions (8.0 EOL, 8.4 LTS)", url: https://docs.oracle.com/en-us/iaas/mysql-database/doc/mysql-server-versions.html, accessed: 2026-10-23}
  - {title: "phpMyAdmin docs, Installation: Securing your phpMyAdmin installation", url: https://docs.phpmyadmin.net/en/latest/setup.html, accessed: 2026-10-23}
  - {title: "PHP-FIG, PSR-12 Extended Coding Style", url: https://www.php-fig.org/psr/psr-12/, accessed: 2026-10-23}
  - {title: "OWASP SQL Injection Prevention Cheat Sheet", url: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html, accessed: 2026-10-23}
  - {title: "OWASP CSRF Prevention Cheat Sheet", url: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html, accessed: 2026-10-23}
---

# Plain PHP + MySQL best practices

## TL;DR
- **Supported PHP on 2026-10-23:** 8.2 (security fixes until **2026-12-31**), 8.3 (security until 2027-12-31), 8.4 (active until 2026-12-31, security until 2028-12-31), 8.5 (active until 2027-12-31). **8.1 and older are end of life.** Target **8.3+** (the starter's Docker image is `php:8.3-apache`); 8.2 is fine for the event but dies in ten weeks. `AGENTS.md` still says "PHP 8.1+", which is now EOL.
- **MySQL 8.0 reached end of life in April 2026** (per Oracle); use **8.4 LTS**. The starter's `mysql:8.0` image is fine for a demo; tell ERI it was tested on 8.0.
- Every query with input is a **PDO prepared statement**. Every echo goes through `h()` (`htmlspecialchars`). Every POST checks a **CSRF token**. Config comes from **env vars**.
- `php -S` and phpMyAdmin are **local dev tools only**. Never expose either to the internet.

## Minimal working example
Matches `starters/php-mysql/src/db.php` (env-var config, SQLite fallback, exceptions, `utf8mb4`):
```php
<?php // src/db.php
declare(strict_types=1);

function db(): PDO
{
    static $pdo = null;
    if ($pdo) {
        return $pdo;
    }
    $host = getenv('DB_HOST');
    if ($host) {
        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            $host, getenv('DB_PORT') ?: '3306', getenv('DB_NAME') ?: 'eri');
        $pdo = new PDO($dsn, getenv('DB_USER') ?: 'eri', getenv('DB_PASS') ?: 'eri');
    } else {
        $pdo = new PDO('sqlite:' . __DIR__ . '/../eri.sqlite');
    }
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // default since PHP 8.0; be explicit
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
}

function h(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_check(): void
{
    if (!hash_equals($_SESSION['csrf'] ?? '', (string) ($_POST['csrf'] ?? ''))) {
        http_response_code(403);
        exit('Invalid form token. Reload the page and try again.');
    }
}
```
A page with a search (GET) and a save form (POST), like `public/index.php`:
```php
<?php // public/save.php
declare(strict_types=1);
session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax', 'secure' => !empty($_SERVER['HTTPS'])]);
ini_set('session.use_strict_mode', '1');
session_start();
require __DIR__ . '/../src/db.php';

$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {             // state changes only on POST
    csrf_check();
    $id = (string) ($_POST['posting_id'] ?? '');
    if (!preg_match('/^[A-Z0-9-]{1,10}$/', $id)) {        // validate (allowlist), don't "clean"
        $msg = 'That job ID is not valid.';
    } else {
        $stmt = db()->prepare('INSERT INTO saved_jobs (posting_id) VALUES (:id)');
        $stmt->execute([':id' => $id]);
        $msg = 'Saved.';
    }
}
$sort = in_array($_GET['sort'] ?? '', ['title', 'posted_date'], true) ? $_GET['sort'] : 'posted_date'; // identifiers: allowlist
$jobs = db()->query("SELECT posting_id, title FROM job_postings ORDER BY $sort LIMIT 25")->fetchAll();
?>
<form method="post">
  <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
  <label for="posting_id">Job ID to save</label>
  <input id="posting_id" name="posting_id" required pattern="[A-Z0-9-]{1,10}">
  <button>Save</button>
</form>
<p role="status"><?= h($msg) ?></p>
```
Schema (MySQL 8.x only; for the SQLite fallback use `id INTEGER PRIMARY KEY` and drop the table options). `utf8mb4` stores all of Unicode; `utf8` (a deprecated alias of `utf8mb3`) cannot store 4-byte characters such as emoji. `utf8mb4_0900_ai_ci` is accent- and case-insensitive; that it is the server default is **(verify)** with `SHOW COLLATION LIKE 'utf8mb4%'`:
```sql
CREATE TABLE saved_jobs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  posting_id VARCHAR(10) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
Passwords (only if your prototype truly needs logins; prefer WordPress users when it lives in WP):
```php
$hash = password_hash($password, PASSWORD_DEFAULT);       // store in VARCHAR(255)
if (password_verify($password, $row['password_hash'])) {
    session_regenerate_id(true);                            // new session ID on login
    $_SESSION['user_id'] = (int) $row['id'];
    if (password_needs_rehash($row['password_hash'], PASSWORD_DEFAULT)) { /* re-hash and UPDATE */ }
}
```
Uploads (avoid them at a hackathon; if you must):
```php
$f = $_FILES['doc'] ?? null;
if (!$f || $f['error'] !== UPLOAD_ERR_OK || $f['size'] > 2_000_000) exit('Upload failed.');
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);  // never trust $f['type'] or $f['name']
$ext  = ['application/pdf' => 'pdf', 'image/png' => 'png'][$mime] ?? exit('File type not allowed.');
move_uploaded_file($f['tmp_name'], __DIR__ . '/../uploads/' . bin2hex(random_bytes(16)) . ".$ext"); // outside public/
```

## Do / Don't checklist
- [ ] **Do** bind every value (`:name` or `?`). Placeholders replace a **whole value**: `LIKE :q` with `"%$q%"` as the value, never `'%:q%'`.
- [ ] **Do** allowlist anything that can't be bound (column names, `ORDER BY`, `ASC/DESC`, table names).
- [ ] **Do** keep `ERRMODE_EXCEPTION`, catch at the top level, log the detail, show the user a plain-language message. Set `display_errors=Off` outside dev.
- [ ] **Do** use `charset=utf8mb4` in the DSN **and** in table definitions.
- [ ] **Do** read config with `getenv()` from env vars or a git-ignored `.env`; commit a `.env.example` with fake values.
- [ ] **Do** follow PSR-12: 4-space indent, ~120-char soft line limit, class/function braces on their own line, control-structure braces on the same line, visibility on every property and method, no closing `?>` in PHP-only files.
- [ ] **Don't** use `mysqli_query` with string concatenation, `addslashes`, or "escape everything" as the defense (OWASP: strongly discouraged).
- [ ] **Don't** connect as MySQL `root`; give the app a user with only the rights it needs (OWASP least privilege).
- [ ] **Don't** run `php -S` on a public network. The manual: "It should not be used on a public network."
- [ ] **Don't** use `md5`/`sha1` for passwords or pass a custom salt to `password_hash` (ignored since PHP 8.0).

## Security
- **SQL injection:** prepared statements are OWASP's primary defense; the PHP manual notes injection is still possible if other parts of the query are built from unescaped input.
- **XSS:** `htmlspecialchars` converts `& " ' < >` only. It is for HTML text and quoted attributes. For URLs, validate scheme (`http`/`https`) then escape; for JSON to JS, use `json_encode($x, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT)`.
- **CSRF:** synchronizer token in the session, compared with `hash_equals` (constant-time), POST-only state changes, `SameSite` cookies as defense in depth.
- **Sessions:** `session.use_strict_mode=1` (off by default, "mandatory for secure sessions"), `cookie_httponly`, `cookie_secure` on HTTPS, `cookie_samesite=Lax`, `use_only_cookies=1`; regenerate the ID on login.
- **Passwords:** `PASSWORD_DEFAULT` is bcrypt today (default cost 12 since PHP 8.4); bcrypt truncates input at 72 bytes.
- **phpMyAdmin:** in `docker-compose.yml`, bind it to localhost (`"127.0.0.1:8081:80"`) and do the same for MySQL (`"127.0.0.1:3306:3306"`); the starter currently publishes both on all interfaces. On any real server: HTTPS only, remove `setup/`, set `AllowRoot` false, use cookie auth plus 2FA or web-server auth, keep it patched. Never hand ERI a phpMyAdmin URL; hand them SQL files.

## Accessibility
- Server-rendered forms: `<label for>` on every field, `required` + a text error message (not color only), errors summarized at the top with focus moved there.
- Put result counts in `role="status"` (the starter does), tables get `<caption>` and `<th scope="col">` (see `challenges/01-funding-gap-finder/public/index.php`).
- `<html lang="en">`, a `<title>` per page, 16-18px base font, visible focus. See `wiki/domain/accessibility.md`.

## Common AI-assistant mistakes to watch for
- `"SELECT ... WHERE id = $_GET[id]"` or `"... LIKE '%$q%'"`: string-built SQL. Also `ORDER BY $_GET['sort']` with no allowlist.
- `PDO::ERRMODE_SILENT` / `@` suppression, or `echo $e->getMessage()` to the browser (leaks DSN, table names).
- Escaping on input (`htmlspecialchars` before INSERT) instead of on output; double-encoded text in the DB.
- `$_SESSION` used without `session_start()`, or a CSRF token that is never checked.
- `utf8` instead of `utf8mb4`; `VARCHAR(60)` for password hashes.
- Hard-coded DB passwords or API keys in `db.php`, or a `.env` committed to git.
- Trusting `$_FILES['x']['type']`, saving uploads under `public/` with the client's file name.
- Code written for PHP 7 (`create_function`, `each()`, missing types) or using functions that don't exist; run `php -l` and the page.

## How to hand off to ERI
1. README with run steps under 10 minutes: `php seed.php && php -S localhost:8080 -t public`, plus the Docker option. State PHP and MySQL versions tested.
2. Ship `sql/schema.sql` (and a seed script using synthetic `data/` only), `.env.example`, no `.env`, no `vendor/` unless needed.
3. Note how it would move into WordPress: PDO calls become `$wpdb->prepare()`, `h()` becomes `esc_html()`, the CSRF helper becomes a nonce, pages become a shortcode. See [wordpress-plugin.md](wordpress-plugin.md).
4. Run `php -l` on every file; optionally `phpcs --standard=PSR12 src public` **(verify PHPCS ships the PSR12 standard in your version)**.

## Sources
- [PHP Supported Versions](https://www.php.net/supported-versions.php) · [PDO prepared statements](https://www.php.net/manual/en/pdo.prepared-statements.php) · [PDO error handling](https://www.php.net/manual/en/pdo.error-handling.php) · [password_hash](https://www.php.net/manual/en/function.password-hash.php) · [htmlspecialchars](https://www.php.net/manual/en/function.htmlspecialchars.php)
- [Securing Session INI Settings](https://www.php.net/manual/en/session.security.ini.php) · [POST method uploads](https://www.php.net/manual/en/features.file-upload.post-method.php) · [Built-in web server](https://www.php.net/manual/en/features.commandline.webserver.php) · [MySQL utf8mb4](https://dev.mysql.com/doc/refman/8.4/en/charset-unicode-utf8mb4.html) · [MySQL Unicode collations](https://dev.mysql.com/doc/refman/8.4/en/charset-unicode-sets.html)
- [Oracle, MySQL Server Versions](https://docs.oracle.com/en-us/iaas/mysql-database/doc/mysql-server-versions.html) · [phpMyAdmin, Securing your installation](https://docs.phpmyadmin.net/en/latest/setup.html) · [PSR-12](https://www.php-fig.org/psr/psr-12/) · [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) · [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
