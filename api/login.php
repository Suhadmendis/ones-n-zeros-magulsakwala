<?php
require __DIR__ . '/db.php';
require __DIR__ . '/auth_helpers.php';

header('Content-Type: application/json');
start_session();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['errors' => ['form' => 'err_generic']], 405);
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];

$email = trim($body['email'] ?? '');
$password = (string) ($body['password'] ?? '');

if ($email === '' || $password === '') {
    json_response(['errors' => ['form' => 'invalid_credentials']], 400);
}

try {
    $pdo = db_connect();

    $stmt = $pdo->prepare('SELECT id, password_hash FROM users WHERE email = :email');
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !$user['password_hash'] || !password_verify($password, $user['password_hash'])) {
        json_response(['errors' => ['form' => 'invalid_credentials']], 401);
    }

    $_SESSION['user_id'] = (int) $user['id'];
    json_response(['user' => current_user($pdo)]);
} catch (Throwable $e) {
    error_log('login failed: ' . $e->getMessage());
    json_response(['errors' => ['form' => 'err_generic']], 500);
}
