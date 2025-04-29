<?php
session_start();
include "conn.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "No autorizado"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
$nombre = mysqli_real_escape_string($con, $data->nombre ?? "");
$descripcion = mysqli_real_escape_string($con, $data->descripcion ?? "");
$imagen = mysqli_real_escape_string($con, $data->imagen ?? "");

if (!$nombre) {
    echo json_encode(["success" => false, "message" => "Nombre requerido"]);
    exit;
}

$stmt = mysqli_prepare($con, "INSERT INTO Partida (nombre, descripcion, imagen, id_admin, private) VALUES (?, ?, ?, ?, 0)");
mysqli_stmt_bind_param($stmt, "sssi", $nombre, $descripcion, $imagen, $_SESSION['user_id']);

if (mysqli_stmt_execute($stmt)) {
    $newId = mysqli_insert_id($con);
    echo json_encode(["success" => true, "partida_id" => $newId]);
} else {
    echo json_encode(["success" => false, "message" => "Error al crear partida"]);
}

mysqli_stmt_close($stmt);
mysqli_close($con);
?>
