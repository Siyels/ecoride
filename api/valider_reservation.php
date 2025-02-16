<?php
require '../config/database.php';
require 'authMiddleware.php';

checkRole('admin'); // 🔒 Seuls les admins peuvent modifier une réservation

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['reservation_id']) || !isset($_POST['status'])) {
        echo json_encode(["error" => "Données manquantes."]);
        exit;
    }

    $reservation_id = $_POST['reservation_id'];
    $nouveau_statut = $_POST['status']; // "confirmée" ou "refusée"

    if (!in_array($nouveau_statut, ['confirmée', 'refusée'])) {
        echo json_encode(["error" => "Statut invalide."]);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE reservations SET status = ? WHERE id = ?");
    if ($stmt->execute([$nouveau_statut, $reservation_id])) {
        echo json_encode(["message" => "Réservation mise à jour avec succès."]);
    } else {
        echo json_encode(["error" => "Erreur lors de la mise à jour de la réservation."]);
    }
}

if ($stmt->execute([$nouveau_statut, $reservation_id])) {
    if ($nouveau_statut === 'confirmée') {
        // Récupérer le trajet et le passager liés à la réservation
        $stmt = $pdo->prepare("SELECT trajet_id, passager_id FROM reservations WHERE id = ?");
        $stmt->execute([$reservation_id]);
        $reservation = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($reservation) {
            // Réduire les places disponibles
            $stmt = $pdo->prepare("UPDATE trajets SET places_disponibles = places_disponibles - 1 WHERE id = ?");
            $stmt->execute([$reservation['trajet_id']]);

            // Ajouter une notification pour le passager
            $stmt = $pdo->prepare("INSERT INTO notifications (user_id, message) VALUES (?, ?)");
            $stmt->execute([$reservation['passager_id'], "Votre réservation a été confirmée ✅"]);
        }
    } elseif ($nouveau_statut === 'refusée') {
        // Ajouter une notification pour le passager
        $stmt = $pdo->prepare("INSERT INTO notifications (user_id, message) VALUES (?, ?)");
        $stmt->execute([$reservation['passager_id'], "Votre réservation a été refusée ❌"]);
    }

    echo json_encode(["message" => "Réservation mise à jour avec succès."]);
} else {
    echo json_encode(["error" => "Erreur lors de la mise à jour de la réservation."]);
}


?>
