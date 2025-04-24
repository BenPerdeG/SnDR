<?php
session_start();
include "conn.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "No autorizado"]);
    exit;
}

$partidaId = (int)$_GET['id'];
$userId = (int)$_SESSION['user_id'];

// Primero verificamos si la partida existe y obtener sus datos básicos
$stmt = mysqli_prepare($con, 
    "SELECT p.id, p.nombre, p.descripcion, p.private, p.id_admin
     FROM Partida p
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

// 1. ¿Es pública?
if (!$partida['private']) {
    $tieneAcceso = true;
}
// 2. ¿Es el admin?
else if ($partida['id_admin'] === $userId) {
    $tieneAcceso = true;
}
// 3. ¿Está invitado?
else {
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
    // CONSULTA JUGADORES
    $stmtJugadores = mysqli_prepare($con,
        "SELECT u.id, u.nombre, u.imagen_perfil as avatar
         FROM Usuarios_Partidas up
         JOIN Usuario u ON up.id_usuario = u.id
         WHERE up.id_partida = ?");
    
    if (!$stmtJugadores) throw new Exception("Error al obtener jugadores");
    
    mysqli_stmt_bind_param($stmtJugadores, "i", $partidaId);
    mysqli_stmt_execute($stmtJugadores);
    $jugadores = mysqli_fetch_all(mysqli_stmt_get_result($stmtJugadores), MYSQLI_ASSOC);
    
    echo json_encode([
        "success" => true,
        "partida" => [
            "id" => $partida['id'],
            "nombre" => $partida['nombre'],
            "descripcion" => $partida['descripcion'],
            "private" => (bool)$partida['private'],
            "admin" => [
                "id" => $partida['id_admin'],
                "nombre" => $partida['admin_nombre'],
                "avatar" => $partida['admin_avatar'] ?? 'default-avatar.png'
            ],
            "jugadores" => $jugadores
        ]
    ]);

} catch (Exception $e) {
    // RESPUESTA DE ERROR CONTROLADA
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>