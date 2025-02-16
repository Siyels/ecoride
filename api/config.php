<?php
// Configuration de la base de données
$DB_HOST = "localhost";  // Adresse du serveur MySQL
$DB_NAME = "ecoride";    // Nom de la base de données
$DB_USER = "root";       // Nom d'utilisateur MySQL (mettre "root" si en local)
$DB_PASS = "root";           // Mot de passe MySQL (laisser vide si en local avec XAMPP)

// Connexion PDO
try {
    $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8", $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    die(json_encode(["status" => "error", "message" => "Erreur lors de la connexion à la base de données"]));
}
?>
