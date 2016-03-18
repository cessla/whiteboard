<?php 
session_start();
if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 900)) {
	// 15 min session
	session_unset(); // unset $_SESSION variable for the run-time
	session_destroy(); // destroy session data in storage
}
$_SESSION['LAST_ACTIVITY'] = time();
?>