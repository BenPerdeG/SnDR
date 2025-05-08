<?php
ob_start();
header('Content-Type: application/json');
require_once 'conn.php';

// Improved error handling for database connection
if (!$con || $con->connect_error) {
    die(json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos: ' . ($con ? $con->connect_error : 'No connection')
    ]));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode([
        'success' => false, 
        'message' => 'Método no permitido'
    ]));
}

session_start();
if (!isset($_SESSION['user_id'])) {
    die(json_encode([
        'success' => false,
        'message' => 'No autorizado - Inicia sesión primero'
    ]));
}

$userId = $_SESSION['user_id'];

try {
    // Begin transaction for atomic operations
    $con->begin_transaction();

    // Get user information with error handling
    $stmt = $con->prepare("SELECT nombre FROM Usuario WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Error al preparar consulta de usuario: " . $con->error);
    }
    $stmt->bind_param("i", $userId);
    if (!$stmt->execute()) {
        throw new Exception("Error al ejecutar consulta de usuario: " . $stmt->error);
    }
    
    $userResult = $stmt->get_result();
    if ($userResult->num_rows === 0) {
        throw new Exception("Usuario no encontrado");
    }
    
    $user = $userResult->fetch_assoc();
    $userName = $user['nombre'];
    
    // Count existing games with error handling
    $stmt = $con->prepare("SELECT COUNT(id) as count FROM Partida WHERE id_admin = ?");
    if (!$stmt) {
        throw new Exception("Error al preparar conteo de partidas: " . $con->error);
    }
    $stmt->bind_param("i", $userId);
    if (!$stmt->execute()) {
        throw new Exception("Error al contar partidas: " . $stmt->error);
    }
    
    $countResult = $stmt->get_result();
    $countData = $countResult->fetch_assoc();
    $gameCount = $countData['count'] + 1;
    
    // Create game name and description
    $gameName = "Partida de $userName #$gameCount" ;
    $description = "Añade una descripción";
    
    // Insert new game with error handling
    $stmt = $con->prepare("INSERT INTO Partida (id_admin, private, nombre, descripcion) VALUES (?, 1, ?, ?)");
    if (!$stmt) {
        throw new Exception("Error al preparar inserción de partida: " . $con->error);
    }
    $stmt->bind_param("iss", $userId, $gameName, $description);
    
    if (!$stmt->execute()) {
        throw new Exception("Error al crear partida: " . $stmt->error);
    }
    
    $newGameId = $con->insert_id;
    
    // Add admin as player with error handling
    $stmt = $con->prepare("INSERT INTO Usuarios_Partidas (id_usuario, id_partida) VALUES (?, ?)");
    if (!$stmt) {
        throw new Exception("Error al preparar inserción de jugador: " . $con->error);
    }
    $stmt->bind_param("ii", $userId, $newGameId);
    
    if (!$stmt->execute()) {
        throw new Exception("Error al añadir jugador: " . $stmt->error);
    }
    
    // Commit transaction if everything succeeded
    $con->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Partida creada exitosamente',
        'partida_id' => $newGameId,
        'nombre' => $gameName
    ]);

} catch (Exception $e) {
    // Rollback transaction on error
    if ($con) {
        $con->rollback();
    }
    die(json_encode([
        'success' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]));
}

ob_end_flush();
exit;
?>