<?php
require_once "cors.php";  

require_once "conn.php";   

session_start();           

if (!isset($con) || !$con) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['nombre']) || !isset($data['imagen'])) {
    echo json_encode(["success" => false, "message" => "Faltan campos"]);
    exit;
}

$id = intval($data['id']);
$nombre = $data['nombre'];
$imagen = $data['imagen'];

$stmt = $con->prepare("UPDATE Personaje SET nombre = ?, imagen = ? WHERE id = ?");
$stmt->bind_param("ssi", $nombre, $imagen, $id);
$success = $stmt->execute();

echo json_encode([
    "success" => $success,
    "message" => $success ? "Personaje actualizado" : "Error al actualizar"
]);

$stmt->close();
$con->close();
?>
