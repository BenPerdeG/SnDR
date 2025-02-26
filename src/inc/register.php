<?php
error_reporting(E_ALL); 
ini_set('display_errors', 1);
include "conn.php";
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");


// Recibir datos JSON
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->name) || !isset($data->email) || !isset($data->password)) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

$name = mysqli_real_escape_string($con, $data->name);
$email = mysqli_real_escape_string($con, $data->email);
$password = password_hash($data->password, PASSWORD_BCRYPT); // Encriptar contraseña

$query = "INSERT INTO Usuario (nombre, email, password) VALUES (?, ?, ?)";

$stmt = mysqli_prepare($con, $query);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "sss", $name, $email, $password);
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "message" => "Usuario registrado correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al registrar"]);
    }
    mysqli_stmt_close($stmt);
} else {
    echo json_encode(["success" => false, "message" => "Error en la consulta"]);
}

mysqli_close($con);
?>
