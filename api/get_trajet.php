
<?php
require_once 'config.php'; // Connexion à la base de données

header("Content-Type: application/json");
session_start();
// CORS
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


try {
    $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    $stmt = $pdo->query("SELECT trajets.*, users.email AS conducteur FROM trajets 
                         JOIN users ON trajets.user_id = users.id
                         ORDER BY trajets.date_trajet ASC");
    
    $trajets = $stmt->fetchAll();
    echo json_encode($trajets);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erreur de connexion à la base de données"]);
}
?>
