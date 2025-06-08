<?php
session_start();

// Destroy the session completely
$_SESSION = array();
session_destroy();

// Clear the session cookie
setcookie(session_name(), '', time() - 3600, '/');

require_once "cors.php";

echo json_encode([
    "success" => true,
    "message" => "Sesión cerrada correctamente"
]);
?>