<?php
/**
 * IT's IT LLC - CSRF Token Generator
 *
 * Returns a per-session CSRF token as JSON.
 * Called via AJAX on page load.
 */

session_start();
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate');

$token = bin2hex(random_bytes(32));
$_SESSION['csrf_token'] = $token;

echo json_encode(['token' => $token]);
