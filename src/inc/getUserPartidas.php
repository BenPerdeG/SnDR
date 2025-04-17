<?php
session_start();
include "conn.php";

// Configuración de headers idéntica a Profile
header("Access-Control-Allow-Origin: https://sndr.42web.io");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "No autorizado - Sesión no activa",
        "session_status" => session_status(),
        "session_data" => $_SESSION
    ]);
    exit;
}

// Asegurar que la conexión a la base de datos funciona
if (!$con) {
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}

$userId = (int)$_SESSION['user_id'];

// Consulta idéntica a la que funciona en otras partes
$query = "SELECT id, nombre, descripcion FROM Partida WHERE id_admin = ?";
$stmt = mysqli_prepare($con, $query);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Error en la consulta SQL",
        "error" => mysqli_error($con)
    ]);
    exit;
}

mysqli_stmt_bind_param($stmt, "i", $userId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$partidas = [];
while ($row = mysqli_fetch_assoc($result)) {
    $partidas[] = [
        'id' => (int)$row['id'],
        'nombre' => $row['nombre'],
        'descripcion' => $row['descripcion']
    ];
}

echo json_encode([
    "success" => true,
    "partidas" => $partidas,
    "debug" => [
        "user_id_session" => $_SESSION['user_id'],
        "db_user_id" => $userId
    ]
]);

mysqli_stmt_close($stmt);
mysqli_close($con);
?>