<?php
include "conn.php";
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

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
