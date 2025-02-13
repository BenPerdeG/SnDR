<?php
$dbhost = "sql111.infinityfree.com";
$dbuser = "if0_38158122";
$dbpass = "lO0WGtEGoOc4T0";
$dbname = "if0_38158122_sndr";

$con = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

if (!$con) {
    die("Error de conexión: " . mysqli_connect_error());
}
?>
