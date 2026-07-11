<?php
require __DIR__ . '/db.php';

header('Content-Type: application/json');

try {
    $pdo = db_connect();
    $stmt = $pdo->query('SELECT page, section, `key`, content_en, content_si FROM content');

    $content = [];
    foreach ($stmt as $row) {
        $content[$row['page']][$row['section']][$row['key']] = [
            'en' => $row['content_en'],
            'si' => $row['content_si'],
        ];
    }

    echo json_encode($content);
} catch (Throwable $e) {
    error_log('content fetch failed: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load content']);
}
