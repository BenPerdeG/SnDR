<?php
ob_start();
session_start();
error_reporting(0);
error_reporting(E_ALL);
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

if (!isset($data->name) || !isset($data->email) || !isset($data->password)) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

if (empty($data->password)) {
    echo json_encode(["success" => false, "message" => "La contraseña no puede estar vacía"]);
    exit;
}

$name = mysqli_real_escape_string($con, $data->name);
$email = mysqli_real_escape_string($con, $data->email);
$password = password_hash($data->password, PASSWORD_BCRYPT);

$query = "INSERT INTO Usuario (nombre, email, password) VALUES (?, ?, ?)";
$stmt = mysqli_prepare($con, $query);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Error en la consulta: " . mysqli_error($con)]);
    exit;
}

mysqli_stmt_bind_param($stmt, "sss", $name, $email, $password);

if (mysqli_stmt_execute($stmt)) {
    $_SESSION['user_id'] = mysqli_insert_id($con);
    echo json_encode(["success" => true, "message" => "Usuario registrado correctamente", "user_id" => $_SESSION['user_id']]);
} else {
    echo json_encode(["success" => false, "message" => "Error al registrar: " . mysqli_stmt_error($stmt)]);
}

mysqli_stmt_close($stmt);
mysqli_close($con);
?>
