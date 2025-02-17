<?php

header("Content-Type: application/json");

// Configuration des cookies pour s'assurer qu'ils sont bien stockés
session_set_cookie_params([
    'lifetime' => 86400, // 1 jour
    'path' => '/',
    'domain' => '',
    'secure' => false, // Mettre true en HTTPS
    'httponly' => true,
    'samesite' => 'Lax' // Important pour CORS !
]);

session_start();

// CORS
$allowedOrigins = [
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


require '../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

$stmt = $pdo->prepare("SELECT id, email, role, password FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    unset($user['password']); // Ne pas envoyer le hash du mot de passe
    $_SESSION['user'] = $user;

    echo json_encode([
        "message" => "Connexion réussie !",
        "user" => $_SESSION['user'],
        "session_id" => session_id() // 🔍 Vérifier si la session reste la même
    ]);
} else {
    echo json_encode(["error" => "Identifiants incorrects"]);
}

exit();



?>