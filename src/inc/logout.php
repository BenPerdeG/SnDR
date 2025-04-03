<?php
session_start();

// Destroy the session completely
$_SESSION = array();
session_destroy();

// Clear the session cookie
setcookie(session_name(), '', time() - 3600, '/');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

echo json_encode([
    "success" => true,
    "message" => "Sesión cerrada correctamente"
]);
?>