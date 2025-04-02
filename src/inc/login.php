<?php
ob_start();
session_start();
error_reporting(0);
ini_set('display_errors', 1);
include "conn.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if ($data === null) {
    echo json_encode(["success" => false, "message" => "Datos JSON inválidos"]);
    exit;
}

if (!isset($data->email) || !isset($data->password)) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

if (empty($data->password)) {
    echo json_encode(["success" => false, "message" => "La contraseña no puede estar vacía"]);
    exit;
}

$email = mysqli_real_escape_string($con, $data->email);
$password = $data->password;

$query = "SELECT id, password FROM Usuario WHERE email = ?";
$stmt = mysqli_prepare($con, $query);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Error en la consulta: " . mysqli_error($con)]);
    exit;
}

mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $user_id, $hashed_password);
mysqli_stmt_fetch($stmt);

if ($hashed_password && password_verify($password, $hashed_password)) {
    $_SESSION['user_id'] = $user_id;
    echo json_encode(["success" => true, "message" => "Usuario Loggeado correctamente", "user_id" => $_SESSION['user_id']]);
} else {
    echo json_encode(["success" => false, "message" => "Credenciales incorrectas"]);
}

mysqli_stmt_close($stmt);
mysqli_close($con);
?>
