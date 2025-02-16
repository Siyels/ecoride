<?php
require '../config/database.php';
require 'authMiddleware.php';

checkRole('admin'); // 🔒 Seuls les admins peuvent voir ça

$stmt = $pdo->query("SELECT r.id, u.pseudo, t.depart, t.arrivee, r.status, r.date_reservation 
                     FROM reservations r
                     JOIN users u ON r.passager_id = u.id
                     JOIN trajets t ON r.trajet_id = t.id");
$reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($reservations, JSON_UNESCAPED_UNICODE);
?>
