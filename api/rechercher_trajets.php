<?php
require '../config/database.php';

// Récupérer les paramètres de recherche
$depart = $_GET['depart'] ?? null;
$arrivee = $_GET['arrivee'] ?? null;
$date_depart = $_GET['date_depart'] ?? null;

$query = "SELECT * FROM trajets WHERE 1=1";
$params = [];

if ($depart) {
    $query .= " AND depart LIKE ?";
    $params[] = "%$depart%";
}
if ($arrivee) {
    $query .= " AND arrivee LIKE ?";
    $params[] = "%$arrivee%";
}
if ($date_depart) {
    $query .= " AND DATE(date_depart) = ?";
    $params[] = $date_depart;
}

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$trajets = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($trajets);
?>
