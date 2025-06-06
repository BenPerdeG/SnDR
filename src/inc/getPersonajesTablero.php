<?php
session_start();
include "conn.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (!isset($_GET['id_tablero'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID de tablero no proporcionado"
    ]);
    exit;
}

$id_tablero = (int)$_GET['id_tablero'];

$query = "SELECT id, nombre, imagen FROM Personaje WHERE id_tablero = ?";
$stmt = mysqli_prepare($con, $query);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Error en la preparación de la consulta"
    ]);
    exit;
}

mysqli_stmt_bind_param($stmt, "i", $id_tablero);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$personajes = [];
while ($row = mysqli_fetch_assoc($result)) {
    $personajes[] = $row;
}

mysqli_stmt_close($stmt);
mysqli_close($con);

echo json_encode([
    "success" => true,
    "personajes" => $personajes
]);
exit;
?>
