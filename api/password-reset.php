<?php
require __DIR__ . '/db.php';
require __DIR__ . '/auth_helpers.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['errors' => ['form' => 'err_generic']], 405);
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];

// Ensure the password_resets table exists (self-contained, not in migrate.php).
function ensure_password_resets_table(PDO $pdo): void {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS password_resets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(64) NOT NULL UNIQUE,
            expires_at DATETIME NOT NULL,
            used TINYINT NOT NULL DEFAULT 0,
            INDEX idx_token (token),
            INDEX idx_user_id (user_id)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    ");
}

try {
    $pdo = db_connect();
    ensure_password_resets_table($pdo);

    // -----------------------------------------------------------------------
    // Step 2: token + password supplied → reset the password.
    // -----------------------------------------------------------------------
    if (array_key_exists('token', $body)) {
        $token    = trim((string) ($body['token'] ?? ''));
        $password = (string) ($body['password'] ?? '');

        if ($token === '') {
            json_response(['errors' => ['token' => 'token_invalid']], 422);
        }

        // Validate password complexity.
        if (strlen($password) < 8) {
            json_response(['errors' => ['password' => 'password_weak']], 422);
        }
        if (!preg_match('/[A-Za-z]/', $password) || !preg_match('/[0-9]/', $password)) {
            json_response(['errors' => ['password' => 'password_weak']], 422);
        }

        // Look up the token.
        $stmt = $pdo->prepare(
            'SELECT id, user_id, expires_at, used FROM password_resets WHERE token = :token LIMIT 1'
        );
        $stmt->execute([':token' => $token]);
        $row = $stmt->fetch();

        if (!$row || (int) $row['used'] !== 0 || strtotime($row['expires_at']) < time()) {
            json_response(['errors' => ['token' => 'token_invalid']], 422);
        }

        // Update the user's password and mark the token as used in a transaction.
        $pdo->beginTransaction();

        $update = $pdo->prepare('UPDATE users SET password_hash = :hash WHERE id = :id');
        $update->execute([
            ':hash' => password_hash($password, PASSWORD_DEFAULT),
            ':id'   => (int) $row['user_id'],
        ]);

        $mark = $pdo->prepare('UPDATE password_resets SET used = 1 WHERE id = :id');
        $mark->execute([':id' => (int) $row['id']]);

        $pdo->commit();

        json_response(['ok' => true]);
    }

    // -----------------------------------------------------------------------
    // Step 1: email supplied → generate token and "send" reset link.
    // -----------------------------------------------------------------------
    $email = trim((string) ($body['email'] ?? ''));

    // Always return ok — do not leak whether the email exists.
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response(['ok' => true]);
    }

    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if ($user) {
        $userId  = (int) $user['id'];
        $token   = bin2hex(random_bytes(32)); // 64-char hex string
        $expires = date('Y-m-d H:i:s', time() + 3600); // 1 hour from now

        $insert = $pdo->prepare(
            'INSERT INTO password_resets (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)'
        );
        $insert->execute([
            ':user_id'    => $userId,
            ':token'      => $token,
            ':expires_at' => $expires,
        ]);

        // Email sending is not configured yet — log the token for manual use.
        error_log('password-reset token for user_id=' . $userId . ' email=' . $email . ' token=' . $token);
    }

    json_response(['ok' => true]);

} catch (Throwable $e) {
    error_log('password-reset failed: ' . $e->getMessage());
    json_response(['errors' => ['form' => 'err_generic']], 500);
}
