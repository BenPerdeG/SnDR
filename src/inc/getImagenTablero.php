<?php
session_start();
include "conn.php";

require_once "cors.php";

if (!isset($_GET['id_partida'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID de partida no proporcionado"]);
    exit;
}

$partidaId = (int)$_GET['id_partida'];

$stmt = mysqli_prepare($con, "SELECT t.imagen FROM Partida p JOIN Tablero t ON p.id_tablero = t.id WHERE p.id = ?");
mysqli_stmt_bind_param($stmt, "i", $partidaId);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $imagen);
mysqli_stmt_fetch($stmt);
mysqli_stmt_close($stmt);
mysqli_close($con);

echo json_encode(["success" => true, "imagen" => $imagen]);
