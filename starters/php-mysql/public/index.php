<?php
require_once __DIR__ . '/../src/db.php';
$q = trim($_GET['q'] ?? '');
$stmt = db()->prepare('SELECT * FROM job_postings WHERE title LIKE :q OR neighborhood LIKE :q OR category LIKE :q ORDER BY posted_date DESC LIMIT 25');
$stmt->execute([':q' => "%$q%"]);
$jobs = $stmt->fetchAll();
?>
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hello ERI - PHP + MySQL starter</title>
<style>body{font:18px/1.5 system-ui,sans-serif;max-width:48rem;margin:auto;padding:1rem}input,button{font:inherit;padding:.5rem}li{margin:.5rem 0}</style></head>
<body>
<h1>Hello, ERI!</h1>
<p>PHP <?= h(PHP_VERSION) ?> · database: <?= h(db()->getAttribute(PDO::ATTR_DRIVER_NAME)) ?></p>
<form method="get" role="search">
  <label for="q">Search sample jobs</label>
  <input id="q" name="q" value="<?= h($q) ?>"> <button>Search</button>
</form>
<p role="status"><?= count($jobs) ?> result(s)</p>
<ul>
<?php foreach ($jobs as $j): ?>
  <li><strong><?= h($j['title']) ?></strong>, <?= h($j['employer']) ?> - <?= h($j['neighborhood']) ?>, <?= h($j['hours_per_week']) ?> h/wk, $<?= h($j['wage_per_hour']) ?>/h</li>
<?php endforeach; ?>
</ul>
<p><a href="api.php">JSON API</a> · all data is synthetic</p>
</body></html>
