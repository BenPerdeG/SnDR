<?php
// Añade esto al inicio absoluto del archivo
header('Content-Type: application/json');

try {
    include "conn.php";
    
    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        throw new Exception("ID de partida inválido");
    }

    $partidaId = (int)$_GET['id'];
    
    // CONSULTA PRINCIPAL
    $stmt = mysqli_prepare($con, 
        "SELECT p.id, p.nombre, p.descripcion, p.private, p.id_admin,
                u.nombre as admin_nombre, u.imagen_perfil as admin_avatar
         FROM Partida p
         JOIN Usuario u ON p.id_admin = u.id
         WHERE p.id = ?");
    
    if (!$stmt) throw new Exception("Error en la consulta: " . mysqli_error($con));
    
    mysqli_stmt_bind_param($stmt, "i", $partidaId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if (mysqli_num_rows($result) === 0) {
        throw new Exception("Partida no encontrada");
    }
    
    $partida = mysqli_fetch_assoc($result);
    
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
    
    // RESPUESTA EXITOSA
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