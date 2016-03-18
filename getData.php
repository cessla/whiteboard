<?php
include_once('checkSession.php');
require_once('config.php');

if (isset($_POST['user']) && isset($_POST['image']) && isset($_POST['timestamp'])) {
	$user = htmlspecialchars($_POST['user']);
	$image = htmlspecialchars($_POST['image']);
	$timestamp = htmlspecialchars($_POST['timestamp']);

	//$sql = "SELECT * FROM commands WHERE image=".$image." AND user<>".$user;
	if ($timestamp == 0) {
		$sql = "SELECT * FROM commands WHERE image=".$image." AND timestamp>'".$timestamp."'";
	} else {
		$sql = "SELECT * FROM commands WHERE image=".$image." AND user<>".$user." AND timestamp>'".$timestamp."'";
	}
	// get data

	$command = "";
	$lastTimestamp = "";
	$result = mysqli_query($con, $sql);
	if ($result) {

		//$jsonData = array();
		while ($row = mysqli_fetch_array($result)) {
			$command .= $row['command'];
			$lastTimestamp = $row['timestamp'];
			}
		if ($command) {
			echo encodeURIComponent($command."lastTimestamp='".$lastTimestamp."'");
		} else {
			echo "console.log('No changes')";
		}
	} else {
		//echo $sql;
		//echo $image;
		//echo $command;
		echo $timestamp;
		//echo "Some mistake";
	}

} else if (isset($_POST['image']) && !isset($_POST['user'])) {
	
	$image = $_POST['image'];
	if ($image == '-1' ) {
		$sql = "INSERT INTO images (thumb) VALUES (DEFAULT)";
		$result = mysqli_query($con, $sql);
		
		if ($result) {
		$id = mysqli_insert_id($con);
		echo $id;
		} else {
			echo "An error occured. Please try again later.";
			echo "Development preview: ".mysqli_errno($con)." ".mysqli_error($con);	
		}

	} else {
		echo "Parameters are incorrect";
	}	
	
} else if (isset($_POST['thumb']) ) {
	
	$thumbid = $_POST['thumb'];
	
		$sql = "SELECT thumb FROM images WHERE ID=".$thumbid;
		$result = mysqli_query($con, $sql);
		
		if ($result) {
			$row = mysqli_fetch_assoc($result);
			echo $row['thumb'];
		} else {
			echo "An error occured. Please try again later.";
			echo "Development preview: ".mysqli_errno($con)." ".mysqli_error($con);	
		}

	
	
} else {
	echo "Parameters are incorrect";
}

mysqli_close($con);

function encodeURIComponent($str) {
    $revert = array('%21'=>'!', '%2A'=>'*', '%27'=>"'", '%28'=>'(', '%29'=>')');
    return strtr(rawurlencode($str), $revert);
}
?>