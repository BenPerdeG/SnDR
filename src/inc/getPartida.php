<?php
session_start();
include "conn.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode([
        "success" => false,
        "message" => "ID de partida no válido"
    ]);
    exit;
}

$partidaId = (int)$_GET['id'];

// 1. Obtener información básica de la partida
$queryPartida = "SELECT 
                id, 
                nombre, 
                descripcion,
                id_admin
              FROM Partida
              WHERE id = ?";
              
$stmtPartida = mysqli_prepare($con, $queryPartida);
mysqli_stmt_bind_param($stmtPartida, "i", $partidaId);
mysqli_stmt_execute($stmtPartida);
$resultPartida = mysqli_stmt_get_result($stmtPartida);

if (mysqli_num_rows($resultPartida) === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Partida no encontrada"
    ]);
    exit;
}

$partidaData = mysqli_fetch_assoc($resultPartida);

// 2. Obtener datos del ADMINISTRADOR
$queryAdmin = "SELECT 
                id, 
                nombre, 
                imagen_perfil AS avatar,
                horas_jugadas
              FROM Usuario
              WHERE id = ?";
              
$stmtAdmin = mysqli_prepare($con, $queryAdmin);
mysqli_stmt_bind_param($stmtAdmin, "i", $partidaData['id_admin']);
mysqli_stmt_execute($stmtAdmin);
$resultAdmin = mysqli_stmt_get_result($stmtAdmin);
$adminData = mysqli_fetch_assoc($resultAdmin);

// 3. Obtener JUGADORES (excluyendo al admin)
$queryJugadores = "SELECT 
                    u.id, 
                    u.nombre, 
                    u.imagen_perfil AS avatar
                  FROM Usuarios_Partidas up
                  JOIN Usuario u ON up.id_usuario = u.id
                  WHERE up.id_partida = ? AND up.id_usuario != ?";
                  
$stmtJugadores = mysqli_prepare($con, $queryJugadores);
mysqli_stmt_bind_param($stmtJugadores, "ii", $partidaId, $partidaData['id_admin']);
mysqli_stmt_execute($stmtJugadores);
$resultJugadores = mysqli_stmt_get_result($stmtJugadores);

$jugadores = [];
while ($jugador = mysqli_fetch_assoc($resultJugadores)) {
    $jugadores[] = $jugador;
}

// 4. Preparar respuesta
$response = [
    "success" => true,
    "partida" => [
        "id" => $partidaData['id'],
        "nombre" => $partidaData['nombre'],
        "descripcion" => $partidaData['descripcion'],
        "admin_id" => $adminData['id'],
        "admin_nombre" => $adminData['nombre'],
        "admin_avatar" => $adminData['avatar'] ?: "/default-avatar.png",
        "admin_horas_jugadas" => (int)$adminData['horas_jugadas'],
        "jugadores" => $jugadores,
        "max_jugadores" => 6
    ]
];

echo json_encode($response);

// Cerrar conexiones
mysqli_stmt_close($stmtPartida);
mysqli_stmt_close($stmtAdmin);
mysqli_stmt_close($stmtJugadores);
mysqli_close($con);
?>