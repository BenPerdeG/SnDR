<?php
// Iniciar buffer y sesión al principio
ob_start();
session_start();

// Configurar reporte de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers CORS (deben ir antes de cualquier output)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit;
}

// Verificar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit;
}

// Incluir conexión después de headers
include "conn.php";

// Leer y validar input JSON
$json = file_get_contents('php://input');
$data = json_decode($json);

if ($data === null) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos JSON inválidos"]);
    exit;
}

// Validar campos requeridos
if (!isset($data->email) || !isset($data->password)) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

if (empty($data->password)) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "La contraseña no puede estar vacía"]);
    exit;
}

// Procesar login
try {
    $email = mysqli_real_escape_string($con, $data->email);
    $password = $data->password;

    $query = "SELECT id, password FROM Usuario WHERE email = ?";
    $stmt = mysqli_prepare($con, $query);

    if (!$stmt) {
        throw new Exception("Error en la consulta: " . mysqli_error($con));
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
            "message" => "Usuario logueado correctamente",
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
    echo json_encode(["success" => false, "message" => "Error del servidor: " . $e->getMessage()]);
} finally {
    if (isset($stmt)) {
        mysqli_stmt_close($stmt);
    }
    if (isset($con)) {
        mysqli_close($con);
    }
    exit;
}
?>