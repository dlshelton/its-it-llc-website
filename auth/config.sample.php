<?php
// Copy this file to config.php and fill in your GitHub OAuth App credentials.
// DO NOT commit config.php to git — it contains secrets.
//
// Create a GitHub OAuth App at: https://github.com/settings/developers
//   - Application name: IT's IT Blog CMS
//   - Homepage URL: https://www.itsitllc.com
//   - Authorization callback URL: https://www.itsitllc.com/auth/
return [
    'github_client_id'     => 'YOUR_GITHUB_CLIENT_ID',
    'github_client_secret' => 'YOUR_GITHUB_CLIENT_SECRET',
    'redirect_uri'         => 'https://www.itsitllc.com/auth/',
];
