<?php
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => '',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();
// CORS
$allowedOrigins = [
    "http://localhost:3000",  // Dev
    "https://red-lion-139713.hostingersite.com",  // Domaine principal
    "https://red-lion-139713.hostingersite.com/ECF/EcoRide", // Sous-répertoire du projet
];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// ✅ Nettoyer les sorties avant d'envoyer JSON
ob_clean();

$response = [
    "session_id" => session_id(),
    "session_status" => session_status(),
    "cookies" => $_COOKIE,
    "session_data" => isset($_SESSION['user']) ? $_SESSION['user'] : null
];

if (isset($_SESSION['user'])) {
    $response["status"] = "success";
} else {
    $response["status"] = "error";
    $response["message"] = "Utilisateur non connecté";
}

echo json_encode($response);
exit();
