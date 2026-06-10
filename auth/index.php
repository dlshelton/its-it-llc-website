<?php
session_start();

$config_file = __DIR__ . '/config.php';
if (!file_exists($config_file)) {
    http_response_code(500);
    die('OAuth not configured. Create auth/config.php from config.sample.php.');
}
$config = require $config_file;

$client_id     = $config['github_client_id'];
$client_secret = $config['github_client_secret'];
$redirect_uri  = $config['redirect_uri'];

if (!isset($_GET['code'])) {
    $state = bin2hex(random_bytes(16));
    $_SESSION['oauth_state'] = $state;

    $params = http_build_query([
        'client_id'    => $client_id,
        'redirect_uri' => $redirect_uri,
        'scope'        => 'repo,user',
        'state'        => $state,
    ]);

    header("Location: https://github.com/login/oauth/authorize?$params");
    exit;
}

$code = $_GET['code'];

$ch = curl_init('https://github.com/login/oauth/access_token');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => http_build_query([
        'client_id'     => $client_id,
        'client_secret' => $client_secret,
        'code'          => $code,
        'redirect_uri'  => $redirect_uri,
    ]),
    CURLOPT_HTTPHEADER => ['Accept: application/json'],
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode($response, true);

if (isset($data['access_token'])) {
    $token = $data['access_token'];
    $message = json_encode(['token' => $token, 'provider' => 'github']);
    ?>
<!DOCTYPE html>
<html><body><script>
(function() {
    function receiveMessage(e) {
        window.opener.postMessage(
            'authorization:github:success:<?php echo addslashes($message); ?>',
            e.origin
        );
        window.removeEventListener('message', receiveMessage);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>
    <?php
} else {
    $error = isset($data['error_description']) ? $data['error_description'] : 'Authentication failed';
    $errorMsg = json_encode(['message' => $error]);
    ?>
<!DOCTYPE html>
<html><body><script>
(function() {
    function receiveMessage(e) {
        window.opener.postMessage(
            'authorization:github:error:<?php echo addslashes($errorMsg); ?>',
            e.origin
        );
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>
    <?php
}
