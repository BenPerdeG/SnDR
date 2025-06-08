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

$stmt = $con->prepare("INSERT IGNORE INTO Personajes_Usuarios (id_personaje, id_usuario) VALUES (?, ?)");
$stmt->bind_param("ii", $id_personaje, $id_usuario);
$success = $stmt->execute();

echo json_encode([
    "success" => $success,
    "message" => $success ? "Usuario añadido" : "Error al añadir usuario"
]);

$stmt->close();
$con->close();
?>
