<?php
include "conn.php";
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->password)) {
    $email = mysqli_real_escape_string($con, $data->email);
    $password = mysqli_real_escape_string($con, $data->password);

    $query = "SELECT * FROM Usuarios WHERE email='$email'";
    $result = mysqli_query($con, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $user = mysqli_fetch_assoc($result);
        if (password_verify($password, $user['password'])) {
            echo json_encode(["success" => true, "message" => "Login exitoso"]);
        } else {
            echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
}
?>
