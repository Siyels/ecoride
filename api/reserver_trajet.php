<?php
require '../config/database.php';
session_start();

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Vous devez être connecté pour réserver un trajet."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$trajet_id = $_POST['trajet_id'] ?? null;

if (!$trajet_id) {
    echo json_encode(["error" => "L'ID du trajet est obligatoire."]);
    exit;
}

// Vérifier si des places sont disponibles
$stmt = $pdo->prepare("SELECT places_disponibles FROM trajets WHERE id = ?");
$stmt->execute([$trajet_id]);
$trajet = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$trajet || $trajet['places_disponibles'] <= 0) {
    echo json_encode(["error" => "Aucune place disponible pour ce trajet."]);
    exit;
}

// Réserver le trajet
$stmt = $pdo->prepare("INSERT INTO reservations (passager_id, trajet_id, status, date_reservation) VALUES (?, ?, 'en attente', NOW())");
if ($stmt->execute([$user_id, $trajet_id])) {
    // Réduire le nombre de places disponibles
    $stmt = $pdo->prepare("UPDATE trajets SET places_disponibles = places_disponibles - 1 WHERE id = ?");
    $stmt->execute([$trajet_id]);

    echo json_encode(["message" => "Réservation effectuée avec succès !"]);
} else {
    echo json_encode(["error" => "Erreur lors de la réservation."]);
}
?>
