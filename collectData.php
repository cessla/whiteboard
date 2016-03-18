<?php
include_once('checkSession.php');
require_once('config.php');

if (isset($_POST['user']) && isset($_POST['image']) && isset($_POST['command'])) {
	$user = htmlspecialchars($_POST['user']);
	$image = htmlspecialchars($_POST['image']);
	$command = mysqli_real_escape_string($con, $_POST['command']);

	$sql = "INSERT INTO commands (user, image, command) VALUES ( '".$user."', '".$image."', '".$command."' )";
	$result = mysqli_query($con, $sql);
	
	if ($result) {
		$id = mysqli_insert_id($con);

		//echo $id;
		echo "OK Command saved";
		//echo $command;
		//echo $user;
	} else {
		//echo $sql;
		//echo $image;
		//echo encodeURIComponent($command);
		echo "Command not saved. Error: ".mysqli_errno($con)." ".mysqli_error($con);
		//echo "Not inserted into database";
	}
} else {
	echo "Parameters are incorrect";
}
mysqli_close($con);
?>

