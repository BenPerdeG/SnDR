<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include "conn.php";

// CORS headers
header("Access-Control-Allow-Origin: *"); // Allow all domains (or specify your frontend domain, e.g., https://sndr.42web.io)
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST and OPTIONS requests
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specific headers

// Handle preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Exit early for preflight requests
}

// Debug: Log the request method
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit;
}

// Recibir datos JSON
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
$password = password_hash($data->password, PASSWORD_BCRYPT); 

$query = "Select email,password from Usuario where email= ? and password= ? "; 

$stmt = mysqli_prepare($con, $query);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Error en la consulta: " . mysqli_error($con)]);
    exit;
}

// Bind parameters in the correct order: name, email, password
mysqli_stmt_bind_param($stmt, "ss",$email, $password);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true, "message" => "Usuario Loggeado correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al Loggear: " . mysqli_stmt_error($stmt)]);
}

mysqli_stmt_close($stmt);
mysqli_close($con);
?>