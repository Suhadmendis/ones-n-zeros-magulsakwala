<?php
require __DIR__ . '/db.php';
require __DIR__ . '/auth_helpers.php';

header('Content-Type: application/json');
start_session();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['errors' => ['form' => 'err_generic']], 405);
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];

$name = trim($body['name'] ?? '');
$email = trim($body['email'] ?? '');
$password = (string) ($body['password'] ?? '');

$errors = [];
if ($name === '') {
    $errors['name'] = 'name_required';
} elseif (strlen($name) < 2) {
    $errors['name'] = 'name_too_short';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'email_invalid';
}
if (strlen($password) < 8) {
    $errors['password'] = 'password_min_length';
} elseif (!preg_match('/[A-Za-z]/', $password) || !preg_match('/[0-9]/', $password)) {
    $errors['password'] = 'password_weak';
}

if (count($errors) > 0) {
    $is_422 = isset($errors['password']) && $errors['password'] === 'password_weak'
           || isset($errors['name']) && $errors['name'] === 'name_too_short';
    json_response(['errors' => $errors], $is_422 ? 422 : 400);
}

try {
    $pdo = db_connect();

    $existing = $pdo->prepare('SELECT id FROM users WHERE email = :email');
    $existing->execute([':email' => $email]);
    if ($existing->fetch()) {
        json_response(['errors' => ['email' => 'email_taken']], 409);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :password_hash)'
    );
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ]);

    $_SESSION['user_id'] = (int) $pdo->lastInsertId();
    json_response(['user' => current_user($pdo)], 201);
} catch (Throwable $e) {
    error_log('signup failed: ' . $e->getMessage());
    json_response(['errors' => ['form' => 'err_generic']], 500);
}
