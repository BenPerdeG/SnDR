<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
require_once 'conn.php';


if (!$con || $con->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos'
    ]);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false, 
        'message' => 'Método no permitido'
    ]);
    exit;
}

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'No autorizado - Inicia sesión primero'
    ]);
    exit;
}

$userId = $_SESSION['user_id'];

try {
   
    $con->begin_transaction();

    $stmt = $con->prepare("SELECT nombre FROM Usuario WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Error al preparar consulta de usuario");
    }
    $stmt->bind_param("i", $userId);
    if (!$stmt->execute()) {
        throw new Exception("Error al obtener información del usuario");
    }
    
    $userResult = $stmt->get_result();
    if ($userResult->num_rows === 0) {
        throw new Exception("Usuario no encontrado");
    }
    
    $user = $userResult->fetch_assoc();
    $userName = $user['nombre'];
    $stmt->close();
    
    // Contar partidas existentes
    $stmt = $con->prepare("SELECT COUNT(id) as count FROM Partida WHERE id_admin = ?");
    if (!$stmt) {
        throw new Exception("Error al preparar conteo de partidas");
    }
    $stmt->bind_param("i", $userId);
    if (!$stmt->execute()) {
        throw new Exception("Error al contar partidas");
    }
    
    $countResult = $stmt->get_result();
    $countData = $countResult->fetch_assoc();
    $gameCount = $countData['count'] + 1;
    $stmt->close();
    
    // Crear nombre y descripción de la partida
    $gameName = "Partida de $userName #$gameCount";
    $description = "Añade una descripción";
    
    // Insertar nueva partida
    $stmt = $con->prepare("INSERT INTO Partida (id_admin, private, nombre, descripcion) VALUES (?, 1, ?, ?)");
    if (!$stmt) {
        throw new Exception("Error al preparar inserción de partida");
    }
    $stmt->bind_param("iss", $userId, $gameName, $description);
    
    if (!$stmt->execute()) {
        throw new Exception("Error al crear partida");
    }
    
    $newGameId = $con->insert_id;
    $stmt->close();
    
    $con->commit();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Partida creada exitosamente',
        'partida_id' => $newGameId,
        'nombre' => $gameName
    ]);

} catch (Exception $e) {
    if ($con) {
        $con->rollback();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
}

$con->close();
exit;
?>