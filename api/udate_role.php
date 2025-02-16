<?php
require '../config/database.php';
require 'authMiddleware.php';

checkRole('admin'); // 🔒 Seuls les admins peuvent modifier

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_POST['user_id'];
    $new_role = $_POST['role'];

    if (!in_array($new_role, ['user', 'admin', 'employer'])) {
        echo json_encode(["error" => "Rôle invalide."]);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
    if ($stmt->execute([$new_role, $user_id])) {
        echo json_encode(["message" => "Rôle mis à jour avec succès."]);
    } else {
        echo json_encode(["error" => "Erreur lors de la mise à jour."]);
    }
}
?>
