<?php
if (!include "conn.php" || !$con) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}
session_start();

require_once "cors.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_personaje']) || !isset($data['id_usuario'])) {
    echo json_encode(["success" => false, "message" => "Faltan campos"]);
    exit;
}

$id_personaje = intval($data['id_personaje']);
$id_usuario = intval($data['id_usuario']);

$stmt = $con->prepare("DELETE FROM Personajes_Usuarios WHERE id_personaje = ? AND id_usuario = ?");
$stmt->bind_param("ii", $id_personaje, $id_usuario);
$success = $stmt->execute();

echo json_encode([
    "success" => $success,
    "message" => $success ? "Usuario eliminado" : "Error al eliminar usuario"
]);

$stmt->close();
$con->close();
?>
