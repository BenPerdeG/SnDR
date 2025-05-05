<?php
session_start();
include "conn.php";

// Configuración CORS más completa
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Manejo de solicitudes OPTIONS para CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "isAdmin" => false, "message" => "No autorizado"]);
    exit;
}

$partidaId = (int)$_GET['partida_id'];
$userId = (int)$_SESSION['user_id'];

// Verificación segura contra SQL injection
$stmt = mysqli_prepare($con, 
    "SELECT 1 FROM Partida WHERE id = ? AND id_admin = ? LIMIT 1");
mysqli_stmt_bind_param($stmt, "ii", $partidaId, $userId);
mysqli_stmt_execute($stmt);
mysqli_stmt_store_result($stmt);

$isAdmin = mysqli_stmt_num_rows($stmt) > 0;
mysqli_stmt_close($stmt);

echo json_encode([
    "success" => true,
    "isAdmin" => $isAdmin
]);

mysqli_close($con);
?>