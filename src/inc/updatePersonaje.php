<?php
include 'conn.php';
header('Content-Type: application/json');
session_start();

$input = json_decode(file_get_contents("php://input"), true);

// Validar entrada
$id = intval($input['id'] ?? 0);
$nombre = trim($input['nombre'] ?? '');
$imagen = trim($input['imagen'] ?? '');
$usuarios = $input['usuarios'] ?? [];

if ($id <= 0 || empty($nombre)) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
    exit;
}

try {
    // Actualizar personaje
    $stmt = $con->prepare("UPDATE Personaje SET nombre = ?, imagen = ? WHERE id = ?");
    if (!$stmt) throw new Exception("Error en prepare: " . $con->error);
    $stmt->bind_param("ssi", $nombre, $imagen, $id);
    $stmt->execute();
    $stmt->close();

    // Borrar asignaciones previas
    $stmt = $con->prepare("DELETE FROM Personajes_Usuarios WHERE id_personaje = ?");
    if (!$stmt) throw new Exception("Error en prepare: " . $con->error);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();

    // Insertar nuevas asignaciones
    if (!empty($usuarios)) {
        $stmt = $con->prepare("INSERT INTO Personajes_Usuarios (id_personaje, id_usuario) VALUES (?, ?)");
        if (!$stmt) throw new Exception("Error en prepare: " . $con->error);
        foreach ($usuarios as $usuarioId) {
            $usuarioId = intval($usuarioId);
            if ($usuarioId > 0) {
                $stmt->bind_param("ii", $id, $usuarioId);
                $stmt->execute();
            }
        }
        $stmt->close();
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
