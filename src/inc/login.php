<?php
// Configuración inicial
error_reporting(E_ALL);
ini_set('display_errors', 1);
ob_start();
session_start();

if (!headers_sent()) {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json; charset=utf-8");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}

// Manejo de preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit;
}

// Validar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit;
}

// Conexión a BD (con detección de errores)
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

// Leer input JSON
$json = file_get_contents('php://input');
$data = json_decode($json);

// Validaciones básicas
if ($data === null) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos JSON inválidos"]);
    exit;
}

if (!isset($data->email) || !isset($data->password)) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email y contraseña requeridos"]);
    exit;
}

// Procesamiento del login
try {
    $email = mysqli_real_escape_string($con, trim($data->email));
    $password = $data->password;

    $stmt = mysqli_prepare($con, "SELECT id, password FROM Usuario WHERE email = ?");
    if (!$stmt) {
        throw new Exception("Error en preparación de consulta: " . mysqli_error($con));
    }

    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $user_id, $hashed_password);
    mysqli_stmt_fetch($stmt);

    if ($hashed_password && password_verify($password, $hashed_password)) {
        $_SESSION['user_id'] = $user_id;
        ob_end_clean();
        echo json_encode([
            "success" => true,
            "message" => "Login exitoso",
            "user_id" => $user_id
        ]);
    } else {
        ob_end_clean();
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Credenciales incorrectas"]);
    }
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error del servidor",
        "debug" => $e->getMessage() // Solo para desarrollo
    ]);
} finally {
    if (isset($stmt)) mysqli_stmt_close($stmt);
    if (isset($con)) mysqli_close($con);
    exit;
}
?>