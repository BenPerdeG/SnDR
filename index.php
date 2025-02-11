<?php
$conn=new mysqli("sql111.infinityfree.com ","if0_38158122","lO0WGtEGoOc4T0"," if0_38158122_sndr ");
$sql = "INSERT INTO Usuario(nombre,email,contraseña) VALUES (a,b@b,c);";
if($conn->query($sql))
{
    echo "value inserted";
}
else{
    echo "insertion failed";
}
$conn->close();
?>