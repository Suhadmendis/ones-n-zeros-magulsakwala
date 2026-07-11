<?php
require __DIR__ . '/auth_helpers.php';

header('Content-Type: application/json');
start_session();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['errors' => ['form' => 'err_generic']], 405);
}

$_SESSION = [];
session_destroy();

json_response(['ok' => true]);
