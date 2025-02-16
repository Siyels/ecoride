<?php

require '../config/database.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_SESSION['user_id'];
    $reservation_id = $_POST['reservation_id'] ?? null;

    if (!$reservation_id) {
        echo json_encode(["error" => "Aucun ID de réservation reçu."]);
        exit;
    }

    // Vérifier si la réservation appartient à l'utilisateur
    $stmt = $pdo->prepare("SELECT trajet_id FROM reservations WHERE id = ? AND passager_id = ?");
    $stmt->execute([$reservation_id, $user_id]);
    $reservation = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$reservation) {
        echo json_encode(["error" => "Réservation non trouvée ou vous n'avez pas le droit de l'annuler."]);
        exit;
    }

    // Annuler la réservation
    $stmt = $pdo->prepare("UPDATE reservations SET status = 'annulée' WHERE id = ?");
    if ($stmt->execute([$reservation_id])) {
        $stmt = $pdo->prepare("UPDATE trajets SET places_disponibles = places_disponibles + 1 WHERE id = ?");
        $stmt->execute([$reservation['trajet_id']]);
        echo json_encode(["message" => "Réservation annulée avec succès."]);
    } else {
        echo json_encode(["error" => "Erreur lors de l'annulation de la réservation."]);
    }
}

?>