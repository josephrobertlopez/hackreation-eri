<?php
// GET /api.php -> JSON list of postings. A starting point for a WordPress or mobile front end.
require_once __DIR__ . '/../src/db.php';
header('Content-Type: application/json');
echo json_encode(db()->query('SELECT * FROM job_postings LIMIT 100')->fetchAll(), JSON_PRETTY_PRINT);
