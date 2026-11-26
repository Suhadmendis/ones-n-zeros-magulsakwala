<?php
require __DIR__ . '/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || !isset($data['metric'], $data['value'], $data['page'])) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid payload']);
    exit;
}

$allowed = ['CLS', 'INP', 'LCP', 'FCP', 'TTFB'];
if (!in_array($data['metric'], $allowed, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'unknown metric']);
    exit;
}

try {
    $pdo = db_connect();
    $stmt = $pdo->prepare(
        'INSERT INTO web_vitals (metric, value, rating, page, navigation_type, user_agent)
         VALUES (:metric, :value, :rating, :page, :nav, :ua)'
    );
    $stmt->execute([
        ':metric' => $data['metric'],
        ':value' => (float) $data['value'],
        ':rating' => $data['rating'] ?? null,
        ':page' => substr((string) $data['page'], 0, 255),
        ':nav' => $data['navigationType'] ?? null,
        ':ua' => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500),
    ]);
    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'db error']);
}
