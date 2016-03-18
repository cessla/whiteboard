<?php 
include_once('checkSession.php');
require_once('config.php');

if (isset($_SESSION['userid']) && isset($_SESSION['username'])) {

	if (isset($_POST["page"])) {
		$page = $_POST["page"];
	} else {
		$page = 1;
	}

	$perpage = 20;
	$start = ($page - 1) * $perpage;
	$sql = "SELECT * FROM images LIMIT ".$start.", ".$perpage;
	$result = mysqli_query($con, $sql);

	if ($result) {
		$jsonData = array();
		while ($array = mysqli_fetch_assoc($result)) {
			$jsonData[] = $array;
		}
		echo json_encode($jsonData);
	} else {
		echo " Get Thumbnails Debug: ".mysqli_errno()." ".mysqli_error();
	}
	mysqli_close($con);
}
?>