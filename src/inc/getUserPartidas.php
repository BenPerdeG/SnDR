<?php
session_start();
include "conn.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "No autorizado - Sesión no activa",
        "session_status" => session_status(),
        "session_data" => $_SESSION
    ]);
    exit;
}

if (!$con) {
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}

$userId = (int)$_SESSION['user_id'];

// Combined query to get both admin-owned and participant games
$query = "(SELECT p.id, p.nombre, p.descripcion, p.imagen 
          FROM Partida p 
          WHERE p.id_admin = ?)
          
          UNION
          
          (SELECT p.id, p.nombre, p.descripcion, p.imagen 
          FROM Partida p 
          JOIN Usuarios_Partidas up ON p.id = up.id_partida 
          WHERE up.id_usuario = ?)";

$stmt = mysqli_prepare($con, $query);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Error en la consulta SQL",
        "error" => mysqli_error($con)
    ]);
    exit;
}

// Bind both parameters (same user ID for both conditions)
mysqli_stmt_bind_param($stmt, "ii", $userId, $userId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$partidas = [];
while ($row = mysqli_fetch_assoc($result)) {
    $partidas[] = [
        'id' => (int)$row['id'],
        'nombre' => $row['nombre'],
        'descripcion' => $row['descripcion'],
        'imagen' => $row['imagen'] 
    ];
}

echo json_encode([
    "success" => true,
    "partidas" => $partidas,
    "debug" => [
        "user_id_session" => $_SESSION['user_id'],
        "db_user_id" => $userId
    ]
]);

mysqli_stmt_close($stmt);
mysqli_close($con);
?>