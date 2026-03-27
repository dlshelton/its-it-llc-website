<?php
/**
 * IT's IT LLC - CSRF Token Generator
 *
 * Returns a per-session CSRF token as JSON.
 * Called via AJAX on page load.
 */

// Harden session cookies
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', 1);

session_start();
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

$token = bin2hex(random_bytes(32));
$_SESSION['csrf_token'] = $token;

echo json_encode(['token' => $token]);
