<?php
ob_start();
require_once "cors.php";
require_once 'conn.php';

if (!$con) {
    die(json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos'
    ]));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode([
        'success' => false, 
        'message' => 'Método no permitido'
    ]));
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    die(json_encode([
        'success' => false,
        'message' => 'Datos JSON no válidos'
    ]));
}

if (empty($data['jugador_id']) || !is_numeric($data['jugador_id'])) {
    die(json_encode([
        'success' => false,
        'message' => 'ID de jugador no válido'
    ]));
}

if (empty($data['partida_id']) || !is_numeric($data['partida_id'])) {
    die(json_encode([
        'success' => false,
        'message' => 'ID de partida no válido'
    ]));
}

try {
    // Verificar que el jugador está en la partida
    $stmt = $con->prepare("SELECT 1 FROM Usuarios_Partidas WHERE id_usuario = ? AND id_partida = ?");
    if (!$stmt) throw new Exception("Error al preparar consulta: ".$con->error);
    
    $stmt->bind_param("ii", $data['jugador_id'], $data['partida_id']);
    if (!$stmt->execute()) throw new Exception("Error al ejecutar: ".$stmt->error);
    
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        die(json_encode([
            'success' => false,
            'message' => 'El jugador no está en esta partida'
        ]));
    }
    
    // Eliminar al jugador de la partida
    $stmt = $con->prepare("DELETE FROM Usuarios_Partidas WHERE id_usuario = ? AND id_partida = ?");
    $stmt->bind_param("ii", $data['jugador_id'], $data['partida_id']);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Jugador expulsado correctamente'
        ]);
    } else {
        throw new Exception("Error al expulsar: ".$stmt->error);
    }
    
} catch (Exception $e) {
    die(json_encode([
        'success' => false,
        'message' => 'Error del servidor: '.$e->getMessage()
    ]));
}

ob_end_flush();
exit;
?>