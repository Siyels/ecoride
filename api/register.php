<?php

require '../config/database.php';
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


// Lire le JSON envoyé depuis le front
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier si toutes les données nécessaires sont présentes
if (!isset($data["pseudo"], $data["email"], $data["password"], $data["role"])) {
    echo json_encode(["error" => "Tous les champs sont obligatoires."]);
    exit;
}

$pseudo = htmlspecialchars($data["pseudo"]);
$email = filter_var($data["email"], FILTER_VALIDATE_EMAIL);
$password = password_hash($data["password"], PASSWORD_BCRYPT);
$role = htmlspecialchars($data["role"]); // Fixé à "user" côté front

if (!$email) {
    echo json_encode(["error" => "Email invalide."]);
    exit;
}

// Vérifier si l'email est déjà utilisé
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(["error" => "Cet email est déjà utilisé."]);
    exit;
}

// Insérer l'utilisateur
$stmt = $pdo->prepare("INSERT INTO users (pseudo, email, password, role) VALUES (?, ?, ?, ?)");
if ($stmt->execute([$pseudo, $email, $password, $role])) {
    echo json_encode(["message" => "Inscription réussie !"]);
} else {
    echo json_encode(["error" => "Erreur lors de l'inscription."]);
}
?>
