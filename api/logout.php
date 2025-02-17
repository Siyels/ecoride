<?php
$allowedOrigins = [
    "https://red-lion-139713.hostingersite.com",  // Domaine principal
    "https://red-lion-139713.hostingersite.com/ECF/EcoRide", // Sous-répertoire du projet
    "http://localhost:3000"  // Pour les tests en local
];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}

header("Access-Control-Allow-Credentials: true"); // Autorise l'envoi de cookies
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Méthodes HTTP autorisées
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Headers autorisés
session_start();
session_destroy();

setcookie(session_name(), '', time() - 3600, '/'); // Supprime le cookie de session

header("Content-Type: application/json");
echo json_encode(["message" => "Déconnexion réussie !"]);
exit;
?>
