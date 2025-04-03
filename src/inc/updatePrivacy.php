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

$input = json_decode(file_get_contents("php://input"));
$private = filter_var($input->private ?? false, FILTER_VALIDATE_BOOLEAN);

$stmt = mysqli_prepare($con, "UPDATE Usuario SET private = ? WHERE id = ?");
mysqli_stmt_bind_param($stmt, "ii", $private, $_SESSION['user_id']);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al actualizar"]);
}

mysqli_stmt_close($stmt);
mysqli_close($con);
?>