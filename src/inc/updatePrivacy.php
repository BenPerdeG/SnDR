<?php
session_start();
include "conn.php";

require_once "cors.php";

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "No autorizado"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"));
$partidaId = (int)$input->id;
$private = filter_var($input->private ?? false, FILTER_VALIDATE_BOOLEAN);

$stmt = mysqli_prepare($con, "UPDATE Partida SET private = ? WHERE id = ?");
mysqli_stmt_bind_param($stmt, "ii", $private, $partidaId);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al actualizar: " . mysqli_error($con)]);
}

mysqli_stmt_close($stmt);
mysqli_close($con);
?>