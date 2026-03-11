<?php
/**
 * IT's IT LLC - Contact Form Configuration
 *
 * Copy this file to config.php and fill in your actual values.
 * config.php is git-ignored and must NEVER be committed.
 */

return [
    // SMTP settings for Microsoft 365 Exchange
    'smtp' => [
        'host'       => 'itsitllc-com.mail.protection.outlook.com',
        'port'       => 25,
        'username'   => 'GetStarted@ItsITLLC.com',
//        'password'   => 'YOUR_APP_PASSWORD_HERE',
        'encryption' => 'tls',
    ],

    // Email routing
    'mail' => [
        'from_email' => 'GetStarted@ItsITLLC.com',
        'from_name'  => "IT's IT LLC Website",
        'to_email'   => 'GetStarted@ItsITLLC.com',
        'to_name'    => "IT's IT LLC",
    ],

    // Google reCAPTCHA v3
    'recaptcha' => [
        'site_key'   => '6LfTNYcsAAAAACNq7hvPoRW6bb4m3G0wo3C97QpU',
        'secret_key' => '6LfTNYcsAAAAANCgJc5HSZrMDKhhdhKkRTlmhNe3',
        'threshold'  => 0.5,
    ],

    // Rate limiting
    'rate_limit' => [
        'max_submissions' => 5,
        'window_seconds'  => 3600,
        'storage_dir'     => __DIR__ . '/rate_limit_data/',
    ],
];
