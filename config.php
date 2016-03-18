<?php
$con = mysqli_connect('host', 'username', 'password') or die('Could not connect the database : Username or password incorrect');
$sel = mysqli_select_db($con, 'pwidb') or die ('No database found');
?>