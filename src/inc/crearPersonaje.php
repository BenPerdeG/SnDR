<?php
session_start();
include "conn.php";

require_once "cors.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido"
    ]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);


if (!isset($data['id_tablero']) || !isset($data['nombre'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Datos incompletos"
    ]);
    exit;
}

$id_tablero = (int)$data['id_tablero'];
$nombre = mysqli_real_escape_string($con, trim($data['nombre']));
$imagen = isset($data['imagen']) ? mysqli_real_escape_string($con, trim($data['imagen'])) : '';

$query = "INSERT INTO Personaje (id_tablero, nombre, imagen) VALUES (?, ?, ?)";
$stmt = mysqli_prepare($con, $query);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Error en la preparación de la consulta"
    ]);
    exit;
}

mysqli_stmt_bind_param($stmt, "iss", $id_tablero, $nombre, $imagen);
$result = mysqli_stmt_execute($stmt);

if ($result) {
    echo json_encode([
        "success" => true,
        "message" => "Personaje creado exitosamente"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al crear el personaje"
    ]);
}

mysqli_stmt_close($stmt);
mysqli_close($con);
exit;
?>