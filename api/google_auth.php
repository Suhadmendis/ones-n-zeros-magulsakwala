<?php
require __DIR__ . '/db.php';
require __DIR__ . '/auth_helpers.php';

header('Content-Type: application/json');
start_session();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['errors' => ['form' => 'err_generic']], 405);
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];
$credential = $body['credential'] ?? '';

if ($credential === '') {
    json_response(['errors' => ['form' => 'err_generic']], 400);
}

try {
    $config = require __DIR__ . '/config.php';

    $tokenInfo = @file_get_contents(
        'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($credential)
    );
    $payload = $tokenInfo ? json_decode($tokenInfo, true) : null;

    if (
        !$payload
        || empty($payload['aud'])
        || $payload['aud'] !== $config['google_client_id']
        || empty($payload['email_verified'])
        || $payload['email_verified'] !== 'true'
    ) {
        json_response(['errors' => ['form' => 'google_verify_failed']], 401);
    }

    $googleId = $payload['sub'];
    $email = $payload['email'];
    $name = $payload['name'] ?? $email;
    $avatarUrl = $payload['picture'] ?? null;

    $pdo = db_connect();

    $stmt = $pdo->prepare('SELECT id FROM users WHERE google_id = :google_id');
    $stmt->execute([':google_id' => $googleId]);
    $user = $stmt->fetch();

    if ($user) {
        $userId = (int) $user['id'];
    } else {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email');
        $stmt->execute([':email' => $email]);
        $existing = $stmt->fetch();

        if ($existing) {
            $userId = (int) $existing['id'];
            $update = $pdo->prepare(
                'UPDATE users SET google_id = :google_id, avatar_url = :avatar_url WHERE id = :id'
            );
            $update->execute([
                ':google_id' => $googleId,
                ':avatar_url' => $avatarUrl,
                ':id' => $userId,
            ]);
        } else {
            $insert = $pdo->prepare(
                'INSERT INTO users (name, email, google_id, avatar_url) VALUES (:name, :email, :google_id, :avatar_url)'
            );
            $insert->execute([
                ':name' => $name,
                ':email' => $email,
                ':google_id' => $googleId,
                ':avatar_url' => $avatarUrl,
            ]);
            $userId = (int) $pdo->lastInsertId();
        }
    }

    $_SESSION['user_id'] = $userId;
    json_response(['user' => current_user($pdo)]);
} catch (Throwable $e) {
    error_log('google auth failed: ' . $e->getMessage());
    json_response(['errors' => ['form' => 'err_generic']], 500);
}
