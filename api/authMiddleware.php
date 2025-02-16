<?php
session_start();

function checkRole($roleRequired) {
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== $roleRequired) {
        echo json_encode(["error" => "Accès refusé"]);
        exit;
    }
}
?>
