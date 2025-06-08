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

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    die(json_encode([
        'success' => false, 
        'message' => 'Método no permitido'
    ]));
}

try {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        die(json_encode([
            'success' => false,
            'message' => 'No autorizado'
        ]));
    }
    
    $userId = $_SESSION['user_id'];
    
    $stmt = $con->prepare("
        SELECT p.id, p.nombre, p.descripcion, p.imagen, p.private
        FROM Partida p
        WHERE p.id_admin = ?
        ORDER BY p.id DESC
        LIMIT 1
    ");
    
    if (!$stmt) throw new Exception("Error al preparar consulta: ".$con->error);
    
    $stmt->bind_param("i", $userId);
    if (!$stmt->execute()) throw new Exception("Error al ejecutar: ".$stmt->error);
    
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode([
            'success' => true,
            'message' => 'No hay partidas creadas',
            'partida' => null
        ]);
        exit;
    }
    
    $partida = $result->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'message' => 'Partida encontrada',
        'partida' => $partida
    ]);
    
} catch (Exception $e) {
    die(json_encode([
        'success' => false,
        'message' => 'Error del servidor: '.$e->getMessage()
    ]));
}

ob_end_flush();
exit;
?>