<?php
require __DIR__ . '/auth_helpers.php';

header('Content-Type: application/json');
start_session();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['errors' => ['form' => 'err_generic']], 405);
}

$_SESSION = [];
$destroyed = session_destroy();

if (!$destroyed) {
    error_log('logout: session_destroy() failed for session ' . session_id());
    json_response(['errors' => ['form' => 'logout_failed']], 500);
}

json_response(['ok' => true]);
