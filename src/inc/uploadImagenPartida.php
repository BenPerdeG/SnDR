<?php
require_once "cors.php";


$targetDir = "/var/www/html/uploads/";  

if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['imagen'])) {
        echo json_encode(["success" => false, "message" => "No se recibió ningún archivo."]);
        exit;
    }

    $file = $_FILES['imagen'];
    $fileName = uniqid("partida_") . "_" . basename($file["name"]);
    $targetFile = $targetDir . $fileName;

    if (move_uploaded_file($file["tmp_name"], $targetFile)) {
        
        $url = "/uploads/" . $fileName;
        echo json_encode(["success" => true, "url" => $url]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al mover el archivo."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}
?>
