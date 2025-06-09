<?php
session_start();
include "conn.php";

require_once "cors.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "No autorizado"]);
    exit;
}

$partidaId = (int)$_GET['id'];
$userId = (int)$_SESSION['user_id'];

// Primero verificamos si la partida existe y obtener sus datos básicos
$stmt = mysqli_prepare($con, 
    "SELECT p.id, p.nombre, p.descripcion, p.private, p.imagen, p.id_admin, u.nombre AS admin_nombre, u.imagen_perfil AS admin_avatar
     FROM Partida p
     JOIN Usuario u ON p.id_admin = u.id
     WHERE p.id = ?");
mysqli_stmt_bind_param($stmt, "i", $partidaId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) === 0) {
    echo json_encode(["success" => false, "message" => "Partida no encontrada"]);
    exit;
}

$partida = mysqli_fetch_assoc($result);

// Verificación de permisos
$tieneAcceso = false;

if (!$partida['private']) {
    $tieneAcceso = true;
} elseif ($partida['id_admin'] == $userId) {
    $tieneAcceso = true;
} else {
    $stmtInv = mysqli_prepare($con, 
        "SELECT 1 FROM Usuarios_Partidas 
         WHERE id_partida = ? AND id_usuario = ?");
    mysqli_stmt_bind_param($stmtInv, "ii", $partidaId, $userId);
    mysqli_stmt_execute($stmtInv);
    $tieneAcceso = (mysqli_stmt_get_result($stmtInv)->num_rows > 0);
}

if (!$tieneAcceso) {
    echo json_encode(["success" => false, "message" => "No tienes acceso a esta partida"]);
    exit;
}

// Obtener los jugadores
$stmtJugadores = mysqli_prepare($con,
    "SELECT u.id, u.nombre, u.imagen_perfil as avatar
     FROM Usuarios_Partidas up
     JOIN Usuario u ON up.id_usuario = u.id
     WHERE up.id_partida = ?");

mysqli_stmt_bind_param($stmtJugadores, "i", $partidaId);
mysqli_stmt_execute($stmtJugadores);
$jugadores = mysqli_fetch_all(mysqli_stmt_get_result($stmtJugadores), MYSQLI_ASSOC);

// Respuesta JSON final
echo json_encode([
    "success" => true,
    "partida" => [
        "id" => $partida['id'],
        "nombre" => $partida['nombre'],
        "descripcion" => $partida['descripcion'],
        "private" => (bool)$partida['private'],
        "imagen"=> $partida['imagen'],
        "admin" => [
            "id" => $partida['id_admin'],
            "nombre" => $partida['admin_nombre'],
            "avatar" => $partida['admin_avatar'] ?? 'default-avatar.png'
        ],
        "jugadores" => $jugadores
    ]
]);

mysqli_close($con);
?>
