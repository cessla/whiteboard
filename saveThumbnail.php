<?php
include_once('checkSession.php');
require_once('config.php');

if (isset($_POST['imageid']) && isset($_POST['thumb'])) {
	$thumb = htmlspecialchars($_POST['thumb']);
	$imageid = htmlspecialchars($_POST['imageid']);

	$sql = "UPDATE images SET thumb='".$thumb."' WHERE ID=".$imageid;
	$result = mysqli_query($con, $sql);
	
	if ($result) {
		echo "OK Thumb saved";
	} else {
		echo "Thumb not saved. Error: ".mysqli_errno($con)." ".mysqli_error($con);
	}
} else {
	echo "Parameters are incorrect";
}
mysqli_close($con);
?>

