<?php
// CLI only: php import_content.php
require __DIR__ . '/db.php';

$pdo = db_connect();
$inPath = __DIR__ . '/../content-translations.json';
$rows = json_decode(file_get_contents($inPath), true);

$stmt = $pdo->prepare('UPDATE content SET content_si = :content_si WHERE id = :id');

$updated = 0;
foreach ($rows as $row) {
    if (empty($row['content_si'])) {
        continue;
    }
    $stmt->execute([
        ':content_si' => $row['content_si'],
        ':id' => $row['id'],
    ]);
    $updated++;
}

echo "Updated $updated of " . count($rows) . " rows.\n";
