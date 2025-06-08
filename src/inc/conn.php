<?php
$con = new mysqli('localhost', 'sndr_user', 'tu_password_seguro', 'if0_38158122_sndr');
if ($con->connect_error) {
    error_log("MySQL error: " . $con->connect_error);
    $con = false;
}
?>