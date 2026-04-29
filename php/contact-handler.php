<?php
/**
 * IT's IT LLC - Contact Form Handler
 *
 * Processes contact form submissions with:
 * - Honeypot spam detection
 * - CSRF token validation
 * - Rate limiting (file-based)
 * - Google reCAPTCHA v3 verification
 * - Input sanitization and validation
 * - Email delivery via PHPMailer/365 SMTP
 */

// Load PHPMailer classes (must be at top-level for 'use' statements)
require __DIR__ . '/vendor/PHPMailer/Exception.php';
require __DIR__ . '/vendor/PHPMailer/PHPMailer.php';
require __DIR__ . '/vendor/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load configuration
$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Server configuration error. Please call us at (239) 935-9891.']);
    exit;
}
$config = require $configFile;

// Harden session cookies
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', 1);

// Start session for CSRF
session_start();
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// ============================================
// Step 1: Request method check
// ============================================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ============================================
// Step 2: Honeypot check
// ============================================
if (!empty($_POST['website'])) {
    // Bot detected - return fake success so it doesn't retry
    echo json_encode(['success' => true, 'message' => 'Thank you for your message! We\'ll be in touch soon.']);
    exit;
}

// ============================================
// Step 3: CSRF token validation
// ============================================
$csrfToken = $_POST['csrf_token'] ?? '';
$sessionToken = $_SESSION['csrf_token'] ?? '';

if (empty($csrfToken) || empty($sessionToken) || !hash_equals($sessionToken, $csrfToken)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Session expired. Please refresh the page and try again.']);
    exit;
}

// Invalidate token after use (one-time use)
unset($_SESSION['csrf_token']);

// ============================================
// Step 4: Rate limiting
// ============================================
$clientIP = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
if (!checkRateLimit($clientIP, $config['rate_limit'])) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many submissions. Please try again later or call us at (239) 935-9891.']);
    exit;
}

// ============================================
// Step 5: reCAPTCHA v3 verification
// ============================================
$testMode = $config['test_mode'] ?? false;

if (!$testMode) {
    $recaptchaToken = $_POST['g-recaptcha-response'] ?? '';
    if (empty($recaptchaToken) || !verifyRecaptcha($recaptchaToken, $config['recaptcha']['secret_key'], $config['recaptcha']['threshold'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Security verification failed. Please refresh and try again.']);
        exit;
    }
}

// ============================================
// Step 6: Input sanitization
// ============================================
$name       = sanitizeInput($_POST['name'] ?? '');
$email      = sanitizeInput($_POST['email'] ?? '');
$phone      = sanitizeInput($_POST['phone'] ?? '');
$company    = sanitizeInput($_POST['company'] ?? '');
$service    = sanitizeInput($_POST['service'] ?? '');
$message    = sanitizeInput($_POST['message'] ?? '');
$formSource = sanitizeInput($_POST['form_source'] ?? 'website');

// ============================================
// Step 7: Server-side validation
// ============================================

// Required fields
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

// Length limits
if (mb_strlen($name) > 200 || mb_strlen($email) > 254 || mb_strlen($message) > 5000 ||
    mb_strlen($phone) > 30 || mb_strlen($company) > 200) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'One or more fields exceed the maximum length.']);
    exit;
}

// Email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

// Service field validation (allow-list)
$validServices = ['', 'managed-it', 'cybersecurity', 'network', 'help-desk',
                  'disaster-recovery', 'consulting', 'cio-cto', 'telecom',
                  'ai-consulting', 'managed-ai', 'free-analysis', 'other'];
if (!empty($service) && !in_array($service, $validServices, true)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Invalid service selection.']);
    exit;
}

// Phone format (if provided)
if (!empty($phone) && !preg_match('/^[\d\s\-\(\)\+\.]+$/', $phone)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid phone number.']);
    exit;
}

// ============================================
// Step 8: Build and send email via PHPMailer
// ============================================
$sourceLabel = ($formSource === 'contact') ? 'Contact Page' : 'Website';

if ($testMode) {
    // TEST MODE: Log the email to a file instead of sending
    $logFile = $config['test_log'] ?? __DIR__ . '/test_submissions.log';
    $logEntry  = "\n" . str_repeat('=', 60) . "\n";
    $logEntry .= "[TEST MODE] Form Submission at " . date('Y-m-d H:i:s') . "\n";
    $logEntry .= str_repeat('=', 60) . "\n";
    $logEntry .= "Subject: [$sourceLabel Inquiry] New message from $name\n";
    $logEntry .= "From: {$config['mail']['from_email']} ({$config['mail']['from_name']})\n";
    $logEntry .= "To: {$config['mail']['to_email']} ({$config['mail']['to_name']})\n";
    $logEntry .= "Reply-To: $email ($name)\n\n";
    $logEntry .= buildEmailPlainText($name, $email, $phone, $company, $service, $message, $formSource);
    $logEntry .= str_repeat('=', 60) . "\n";

    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
    error_log("[TEST MODE] Form submission logged to $logFile");

} else {
    // PRODUCTION: Send via PHPMailer/SMTP
    try {
        $mail = new PHPMailer(true);

        // SMTP configuration
        $mail->isSMTP();
        $mail->Host       = $config['smtp']['host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $config['smtp']['username'];
        $mail->Password   = $config['smtp']['password'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $config['smtp']['port'];
        $mail->CharSet    = 'UTF-8';

        // Email addresses
        $mail->setFrom($config['mail']['from_email'], $config['mail']['from_name']);
        $mail->addAddress($config['mail']['to_email'], $config['mail']['to_name']);
        $mail->addReplyTo($email, $name);

        // Subject line with source identifier
        $mail->Subject = "[$sourceLabel Inquiry] New message from $name";

        // Email body
        $mail->isHTML(true);
        $mail->Body    = buildEmailHTML($name, $email, $phone, $company, $service, $message, $formSource);
        $mail->AltBody = buildEmailPlainText($name, $email, $phone, $company, $service, $message, $formSource);

        $mail->send();

    } catch (Exception $e) {
        error_log("IT's IT Contact Form - PHPMailer Error: " . $mail->ErrorInfo);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Unable to send message. Please call us at (239) 935-9891.']);
        exit;
    }
}

// ============================================
// Step 9: Success response
// ============================================
echo json_encode([
    'success' => true,
    'message' => "Thank you, $name! We've received your message and will be in touch soon."
]);
exit;


// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Sanitize user input
 */
function sanitizeInput(string $input): string
{
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

/**
 * Check rate limit for an IP address
 */
function checkRateLimit(string $ip, array $config): bool
{
    $dir = $config['storage_dir'];
    if (!is_dir($dir)) {
        mkdir($dir, 0700, true);
    }

    $file = $dir . md5($ip) . '.json';
    $now  = time();

    // Use exclusive file lock to prevent race condition
    $fp = fopen($file, 'c+');
    if (!$fp) {
        return true; // fail open if file can't be created
    }

    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        return true;
    }

    $contents = stream_get_contents($fp);
    $timestamps = !empty($contents) ? (json_decode($contents, true) ?: []) : [];

    // Purge entries older than the window
    $timestamps = array_values(array_filter($timestamps, function ($t) use ($now, $config) {
        return ($now - $t) < $config['window_seconds'];
    }));

    if (count($timestamps) >= $config['max_submissions']) {
        flock($fp, LOCK_UN);
        fclose($fp);
        return false;
    }

    $timestamps[] = $now;

    // Truncate and write
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($timestamps));
    fflush($fp);

    flock($fp, LOCK_UN);
    fclose($fp);
    return true;
}

/**
 * Verify reCAPTCHA v3 token with Google
 */
function verifyRecaptcha(string $token, string $secretKey, float $threshold): bool
{
    $url  = 'https://www.google.com/recaptcha/api/siteverify';
    $data = http_build_query([
        'secret'   => $secretKey,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
    ]);

    $options = [
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $data,
            'timeout' => 10,
        ],
    ];

    $context = stream_context_create($options);
    $result  = @file_get_contents($url, false, $context);

    if ($result === false) {
        // If verification service is unreachable, log and fail open or closed
        // Failing closed (rejecting) is more secure
        error_log("IT's IT Contact Form - reCAPTCHA verification request failed");
        return false;
    }

    $response = json_decode($result, true);
    return ($response['success'] ?? false) && ($response['score'] ?? 0) >= $threshold;
}

/**
 * Build HTML email body
 */
function buildEmailHTML(string $name, string $email, string $phone, string $company, string $service, string $message, string $source): string
{
    $serviceLabel = '';
    if (!empty($service)) {
        $serviceMap = [
            'managed-it'        => 'Managed IT Services',
            'cybersecurity'     => 'Cybersecurity',
            'network'           => 'Network Engineering',
            'help-desk'         => 'Help Desk & Support',
            'disaster-recovery' => 'Disaster Recovery & Backups',
            'consulting'        => 'IT Consulting',
            'cio-cto'           => 'On-Demand CIO/CTO',
            'telecom'           => 'Telecommunications',
            'ai-consulting'     => 'AI Consulting & Strategy',
            'managed-ai'        => 'Managed AI Services',
            'free-analysis'     => 'Free Technology Analysis',
            'other'             => 'Other',
        ];
        $serviceLabel = $serviceMap[$service] ?? $service;
    }

    $sourceLabel = ($source === 'contact') ? 'Contact Page' : 'Homepage';
    $date = date('F j, Y \a\t g:i A T');

    $html = '
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
        <div style="background: #003865; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New ' . $sourceLabel . ' Inquiry</h1>
        </div>
        <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px; vertical-align: top;"><strong>Name:</strong></td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;">' . $name . '</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;"><a href="mailto:' . $email . '">' . $email . '</a></td>
                </tr>';

    if (!empty($phone)) {
        $html .= '
                <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;"><strong>Phone:</strong></td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;"><a href="tel:' . $phone . '">' . $phone . '</a></td>
                </tr>';
    }

    if (!empty($company)) {
        $html .= '
                <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;"><strong>Company:</strong></td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;">' . $company . '</td>
                </tr>';
    }

    if (!empty($serviceLabel)) {
        $html .= '
                <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;"><strong>Service:</strong></td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;">' . $serviceLabel . '</td>
                </tr>';
    }

    $html .= '
                <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;"><strong>Message:</strong></td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;">' . nl2br($message) . '</td>
                </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Submitted from: ' . $sourceLabel . ' | ' . $date . '</p>
        </div>
    </div>';

    return $html;
}

/**
 * Build plain-text email body
 */
function buildEmailPlainText(string $name, string $email, string $phone, string $company, string $service, string $message, string $source): string
{
    $sourceLabel = ($source === 'contact') ? 'Contact Page' : 'Homepage';
    $date = date('F j, Y \a\t g:i A T');

    $text  = "NEW " . strtoupper($sourceLabel) . " INQUIRY\n";
    $text .= str_repeat('=', 40) . "\n\n";
    $text .= "Name:    $name\n";
    $text .= "Email:   $email\n";

    if (!empty($phone))   $text .= "Phone:   $phone\n";
    if (!empty($company)) $text .= "Company: $company\n";
    if (!empty($service)) $text .= "Service: $service\n";

    $text .= "\nMessage:\n" . str_repeat('-', 40) . "\n$message\n\n";
    $text .= str_repeat('-', 40) . "\n";
    $text .= "Submitted from: $sourceLabel | $date\n";

    return $text;
}
