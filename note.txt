// Code pour fichier admin 

require 'authMiddleware.php';
checkRole('admin'); // Seuls les admins peuvent voir cette page

echo json_encode(["message" => "Bienvenue, admin !"]);

///////////////////////

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
$allowedOrigins = [
    "http://localhost:3000",  // Dev
    "https://mon-site.com"    // Production
];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
require '../config/database.php';




if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}




// Vérifier si la requête est bien en POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["error" => "Méthode non autorisée"]);
    http_response_code(405);
    exit;
}

// Récupérer les données JSON envoyées
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["error" => "Tous les champs sont requis"]);
    http_response_code(400);
    exit;
}

// Rechercher l'utilisateur dans la base de données
$stmt = $pdo->prepare("SELECT id, email, password, role FROM users WHERE email = ?");
$stmt->execute([$data['email']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($data['password'], $user['password'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $user['role'];
    

    echo json_encode([
        "message" => "Connexion réussie !",
        "user" => [
            "id" => $user['id'],
            "email" => $user['email'],
            "role" => $user['role']
        ]
    ]

);



    http_response_code(200);
} else {
    echo json_encode(["error" => "Identifiants incorrects"]);
    http_response_code(401);
}


exit;
?>


///////////////////

<?php
require '../config/database.php';
session_start();

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Vous devez être connecté pour ajouter un trajet."]);
    exit;
}

$user_id = $_SESSION['user_id']; // L'utilisateur qui crée le trajet
$depart = $_POST['depart'] ?? null;
$arrivee = $_POST['arrivee'] ?? null;
$date_depart = $_POST['date_depart'] ?? null;
$places_disponibles = $_POST['places_disponibles'] ?? null;
$prix = $_POST['prix'] ?? null;
$vehicule = $_POST['vehicule'] ?? null;

// Vérifier que tous les champs sont remplis
if (!$depart || !$arrivee || !$date_depart || !$places_disponibles || !$prix || !$vehicule) {
    echo json_encode(["error" => "Tous les champs sont obligatoires."]);
    exit;
}

// Insérer le trajet dans la base de données
$stmt = $pdo->prepare("INSERT INTO trajets (conducteur_id, depart, arrivee, date_depart, places_disponibles, prix, vehicule) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)");
if ($stmt->execute([$user_id, $depart, $arrivee, $date_depart, $places_disponibles, $prix, $vehicule])) {
    echo json_encode(["message" => "Trajet ajouté avec succès !"]);
} else {
    echo json_encode(["error" => "Erreur lors de l'ajout du trajet."]);
}
?>

//////////////////////////////////