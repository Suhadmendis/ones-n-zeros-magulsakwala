<?php
// CLI only: php export_content.php
require __DIR__ . '/db.php';

$pdo = db_connect();
$stmt = $pdo->query('SELECT id, page, section, `key`, content_en, content_si FROM content ORDER BY page, section, id');

$data = [];
foreach ($stmt as $row) {
    $data[] = [
        'id' => (int) $row['id'],
        'page' => $row['page'],
        'section' => $row['section'],
        'key' => $row['key'],
        'content_en' => $row['content_en'],
        'content_si' => $row['content_si'] ?? '',
    ];
}

$outPath = __DIR__ . '/../content-translations.json';
file_put_contents($outPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

echo 'Exported ' . count($data) . " rows to $outPath\n";
