<?php
include "cors.php";

$targetDir = __DIR__ . "/../uploads/";  // Directorio fuera de inc/
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['imagen']) || $_FILES['imagen']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(["success" => false, "message" => "No se recibió archivo válido."]);
        exit;
    }

    $file = $_FILES['imagen'];
    $fileName = basename($file["name"]);
    $targetFile = $targetDir . $fileName;

    if (move_uploaded_file($file["tmp_name"], $targetFile)) {
        // URL accesible desde el navegador (ajustá si usás subdominios o carpetas)
        $url = "/uploads/" . $fileName;
        echo json_encode(["success" => true, "url" => $url]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al mover el archivo."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}
