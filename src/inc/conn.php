<?php

$conn = mysqli_connect("127.0.0.1", "root", "", "if0_38158122_sndr");

if (!$conn) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => mysqli_connect_error()
    ]);
    exit;
}

echo json_encode(["success" => true]);
?>