<?php
require __DIR__ . '/db.php';
require __DIR__ . '/auth_helpers.php';

header('Content-Type: application/json');
start_session();

try {
    $pdo = db_connect();
    $user = current_user($pdo);

    if (!$user) {
        json_response(['user' => null], 401);
    }

    json_response(['user' => $user]);
} catch (Throwable $e) {
    error_log('me lookup failed: ' . $e->getMessage());
    json_response(['errors' => ['form' => 'err_generic']], 500);
}
