<?php
require '../config/database.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Vous devez être connecté pour voir vos notifications."]);
    exit;
}

$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC");
$stmt->execute([$user_id]);
$notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($notifications);
?>
