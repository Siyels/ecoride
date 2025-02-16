<?php
require '../config/database.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Vous devez être connecté pour voir vos réservations."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$stmt = $pdo->prepare("SELECT r.id, t.depart, t.arrivee, r.status, r.date_reservation 
                        FROM reservations r
                        JOIN trajets t ON r.trajet_id = t.id
                        WHERE r.passager_id = ?");
$stmt->execute([$user_id]);
$reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($reservations, JSON_UNESCAPED_UNICODE);
?>
