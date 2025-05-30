<?php
include 'conexion.php';
header('Content-Type: application/json');
session_start();

$id_partida = filter_input(INPUT_GET, 'id_partida', FILTER_VALIDATE_INT);

if (!$id_partida) {
    echo json_encode(['success' => false, 'message' => 'ID de partida inválido']);
    exit;
}

try {
    // Obtener usuarios de la partida
    $stmt = $pdo->prepare("
        SELECT u.id, u.nombre 
        FROM Usuario u
        JOIN Usuarios_Partidas up ON u.id = up.id_usuario
        WHERE up.id_partida = ?
    ");
    $stmt->execute([$id_partida]);
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'usuarios' => $usuarios
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error en la base de datos: ' . $e->getMessage()
    ]);
}
?>