<?php
if (!include "conn.php" || !$con) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}



// Consulta simplificada - solo lo esencial
$query = "SELECT id, nombre, descripcion, imagen 
          FROM Partida 
          WHERE private = false";
$result = mysqli_query($con, $query);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Error en la consulta: " . mysqli_error($con)
    ]);
    exit;
}

$partidas = [];
while ($row = mysqli_fetch_assoc($result)) {
    $partidas[] = $row;
}

echo json_encode([
    "success" => true,
    "partidas" => $partidas,
    "debug" => [
        "query" => $query,
        "count" => count($partidas)
    ]
]);

mysqli_close($con);
?>