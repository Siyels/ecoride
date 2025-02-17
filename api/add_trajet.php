<?php
require_once 'config.php'; // Connexion à la base de données
session_start();

header("Content-Type: application/json"); // S'assurer que la réponse est en JSON
$allowedOrigins = [
    "https://red-lion-139713.hostingersite.com",  // Domaine principal
    "https://red-lion-139713.hostingersite.com/ECF/EcoRide", // Sous-répertoire du projet
    "http://localhost:3000"  // Pour les tests en local
];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['user']['id'])) {
    echo json_encode(["status" => "error", "message" => "Utilisateur non connecté"]);
    exit();
}

$user_id = $_SESSION['user']['id'];

// Lire les données envoyées
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier si les données sont bien reçues
if (!$data) {
    echo json_encode(["status" => "error", "message" => "Aucune donnée reçue"]);
    exit();
}

// Débogage : Afficher les données reçues pour vérification
// Supprimer cette ligne après avoir testé
// var_dump($data); exit();

$adresseDepart = $data['adresseDepart'] ?? '';
$adresseArrivee = $data['adresseArrivee'] ?? '';
$dateTrajet = $data['dateTrajet'] ?? '';
$vehicule = $data['vehicule'] ?? '';
$places = $data['places'] ?? 1;
$prix = $data['prix'] ?? 0.0;
$eco = $data['eco'] ?? 1;

// Vérifier si tous les champs obligatoires sont remplis
if (empty($adresseDepart) || empty($adresseArrivee) || empty($dateTrajet) || empty($vehicule) || $places <= 0) {
    echo json_encode(["status" => "error", "message" => "Tous les champs sont requis"]);
    exit();
}

try {
    $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    $stmt = $pdo->prepare("INSERT INTO trajets (conducteur_id, depart, arrivee, date_depart, places_disponibles, prix, vehicule, eco) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $adresseDepart, $adresseArrivee, $dateTrajet, $places, $prix, $vehicule, $eco]);

    echo json_encode(["status" => "success", "message" => "Trajet ajouté avec succès"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erreur lors de l'ajout du trajet", "error" => $e->getMessage()]);
}

?>
