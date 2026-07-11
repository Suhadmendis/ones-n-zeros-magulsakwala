<?php
// Run once after deploy (CLI: php migrate.php) or visit /api/migrate.php in a browser.
require __DIR__ . '/db.php';

$pdo = db_connect();
ensure_schema($pdo);

echo "Schema ensured.\n";
