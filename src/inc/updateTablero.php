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

if (empty($data->id_partida) || empty($data->nueva_imagen)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

$partidaId = (int)$data->id_partida;
$nuevaImagen = mysqli_real_escape_string($con, trim($data->nueva_imagen));

// Verificar que el usuario sea admin de la partida
$stmtCheck = mysqli_prepare($con, "SELECT id_admin, id_tablero FROM Partida WHERE id = ?");
mysqli_stmt_bind_param($stmtCheck, "i", $partidaId);
mysqli_stmt_execute($stmtCheck);
mysqli_stmt_bind_result($stmtCheck, $adminId, $tableroId);
mysqli_stmt_fetch($stmtCheck);
mysqli_stmt_close($stmtCheck);

if ($adminId != $_SESSION['user_id']) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "No tienes permisos para editar esta partida"]);
    exit;
}

// Actualizar la imagen del tablero
$stmtUpdate = mysqli_prepare($con, "UPDATE Tablero SET imagen = ? WHERE id = ?");
mysqli_stmt_bind_param($stmtUpdate, "si", $nuevaImagen, $tableroId);

if (mysqli_stmt_execute($stmtUpdate)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar: " . mysqli_error($con)]);
}

mysqli_stmt_close($stmtUpdate);
mysqli_close($con);
?>
