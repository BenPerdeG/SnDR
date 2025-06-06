<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
require_once 'conn.php';

if (!$con || $con->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado - Inicia sesión primero']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$partidaId = $data['partida_id'] ?? null;

if (!$partidaId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID de partida no proporcionado']);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // Verificar que el usuario es admin de la partida
    $stmt = $con->prepare("SELECT id_admin FROM Partida WHERE id = ?");
    if (!$stmt) throw new Exception("Error al preparar consulta");
    
    $stmt->bind_param("i", $partidaId);
    if (!$stmt->execute()) throw new Exception("Error al verificar permisos");
    
    $result = $stmt->get_result();
    if ($result->num_rows === 0) throw new Exception("Partida no encontrada");
    
    $partida = $result->fetch_assoc();
    if ($partida['id_admin'] != $userId) throw new Exception("No tienes permisos para borrar esta partida");
    $stmt->close();
    
    // Eliminar la partida (las relaciones se borrarán automáticamente por ON DELETE CASCADE)
    $stmt = $con->prepare("DELETE FROM Partida WHERE id = ?");
    $stmt->bind_param("i", $partidaId);
    
    if (!$stmt->execute()) throw new Exception("Error al eliminar la partida");
    
    if ($stmt->affected_rows === 0) throw new Exception("No se encontró la partida para eliminar");
    
    echo json_encode(['success' => true, 'message' => 'Partida eliminada exitosamente']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$con->close();
exit;
?>