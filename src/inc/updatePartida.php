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


if (empty($data->id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID de partida no proporcionado"]);
    exit;
}

$partidaId = (int)$data->id;
$nombre = mysqli_real_escape_string($con, trim($data->nombre ?? ''));
$descripcion = mysqli_real_escape_string($con, trim($data->descripcion ?? ''));
$imagen = mysqli_real_escape_string($con, trim($data->imagen ?? ''));

// Verificar que el usuario es el admin de la partida
$stmtCheck = mysqli_prepare($con, "SELECT id_admin FROM Partida WHERE id = ?");
mysqli_stmt_bind_param($stmtCheck, "i", $partidaId);
mysqli_stmt_execute($stmtCheck);
mysqli_stmt_bind_result($stmtCheck, $adminId);
mysqli_stmt_fetch($stmtCheck);
mysqli_stmt_close($stmtCheck);

if ($adminId != $_SESSION['user_id']) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "No tienes permisos para editar esta partida"]);
    exit;
}

// Actualizar la partida
$stmt = mysqli_prepare($con, "UPDATE Partida SET nombre = ?, descripcion = ?, imagen = ? WHERE id = ?");
mysqli_stmt_bind_param($stmt, "sssi", $nombre, $descripcion, $imagen, $partidaId);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar: " . mysqli_error($con)]);
}

mysqli_stmt_close($stmt);
mysqli_close($con);
?>