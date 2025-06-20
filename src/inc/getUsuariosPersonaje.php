<?php
require_once "conn.php"; // Si falla, PHP emitirá un error por sí mismo

if (!isset($con) || !$con) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}

require_once "cors.php";


if (!isset($_GET['id_personaje'])) {
    echo json_encode(["success" => false, "message" => "Falta el parámetro id_personaje"]);
    exit;
}

$id_tablero = intval($_GET['id_personaje']);


$sql = "
SELECT 
p.id AS id_personaje, 
p.nombre AS nombre_personaje, 
u.id AS id_usuario, 
u.nombre AS nombre_usuario
FROM Personaje p 
LEFT JOIN Personajes_Usuarios pu ON p.id = pu.id_personaje 
LEFT JOIN Usuario u ON pu.id_usuario = u.id 
WHERE p.id = ?
";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $id_tablero);
$stmt->execute();
$result = $stmt->get_result();

$datos = [];

while ($row = $result->fetch_assoc()) {
    $datos[] = $row;
}

// Devolver resultado en formato JSON
echo json_encode(["success" => true, "data" => $datos]);
?>
