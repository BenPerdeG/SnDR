<?php
session_start();
include "conn.php";

// Enable CORS
require_once "cors.php";

// Debug session
error_log("Session check - ID: " . session_id());
error_log("Session contents: " . print_r($_SESSION, true));

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "No autorizado - Sesión no válida",
        "session_status" => session_status(),
        "session_id" => session_id()
    ]);
    exit;
}

$userId = $_SESSION['user_id'];
$query = "SELECT nombre, email, horas_jugadas, imagen_perfil, private
          FROM Usuario 
          WHERE id = ?";
$stmt = mysqli_prepare($con, $query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error en la base de datos: " . mysqli_error($con)
    ]);
    exit;
}

mysqli_stmt_bind_param($stmt, "i", $userId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al obtener resultados: " . mysqli_error($con)
    ]);
    exit;
}

$userData = mysqli_fetch_assoc($result);

if ($userData) {
    echo json_encode([
        "success" => true,
        "user" => [
            "nombre" => $userData['nombre'],
            "email" => $userData['email'],
            "horas_jugadas" => $userData['horas_jugadas'] ?? 0,
            "imagen_perfil" => $userData['imagen_perfil'],
            "private" => (bool)$userData['private']
        ],
        "session_info" => [
            "id" => session_id(),
            "user_id" => $_SESSION['user_id']
        ]
    ]);
} else {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Usuario no encontrado en la base de datos"
    ]);
}

mysqli_stmt_close($stmt);
mysqli_close($con);
?>