<?php
include_once('checkSession.php');
require_once('config.php');

if (isset($_POST['image'])) {
	
	$image = htmlspecialchars($_POST['image']);
	if ($image == '-1' ) {
		$sql = "INSERT INTO images (thumb) VALUES (DEFAULT)";
		$result = mysqli_query($con, $sql);
		
		if ($result) {
		$id = mysqli_insert_id($con);
		echo $id;
		} else {
			echo "An error occured. Please try again later.";
			echo "Debug: ".mysqli_errno($con)." ".mysqli_error($con);	
		}
	} else {
		echo "Parameters are incorrect";
	}	
} else {
	echo "Parameters are incorrect";
}
mysqli_close($con);
?>