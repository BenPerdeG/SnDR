<?php
session_start();
include "conn.php";
if (!$con) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}

require_once "cors.php";

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "No autorizado"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"));

// Verify confirmation word
if (!isset($input->confirmation) || $input->confirmation !== "Borrar") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Confirmación requerida"]);
    exit;
}

// Delete user
$stmt = mysqli_prepare($con, "DELETE FROM Usuario WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $_SESSION['user_id']);

if (mysqli_stmt_execute($stmt)) {
    // Clear session
    session_destroy();
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al eliminar"]);
}

mysqli_stmt_close($stmt);
mysqli_close($con);
?>