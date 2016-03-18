<?php  //Start the Session
session_start();
require_once('config.php');

if (isset($_POST['username']) && isset($_POST['password'])) {
	
	$checkUsername = preg_match('/^[a-zA-Z][a-zA-Z0-9_]{5,11}$/', $_POST['username']);
	$checkPassword = preg_match('/^[a-zA-Z][a-zA-Z0-9_]{6,12}$/', $_POST['password']);
	
	$msg = "";
	
	if ($checkUsername == false) {
		$msg .= "Username must be 6-12 characters long and begin with letter. ";
	} else {
		//echo "jestem w 3";
	}
	
	if ($checkPassword == false) {
		$msg .= "Password must be 6-12 characters long and begin with letter. ";
	} else {
		//echo "jestem w 4";
	}
	//echo "jestem w 1";
	
	if ($checkUsername == true && $checkPassword == true) {
		//echo "jestem w 2";
		$username = htmlspecialchars($_POST['username']);	
		$password = htmlspecialchars($_POST['password']);	
		
		$password = hash("sha256", $password);
		
		$sql = "SELECT * FROM users WHERE name='".$username."' and pass='".$password."'";
		$result = mysqli_query($con, $sql);
		//echo "Development preview: ".mysqli_errno($con)." ".mysqli_error($con);
		//echo $sql;
		//echo $result;
		if ($result) {
									
			$count = mysqli_num_rows($result);
			//echo "Count= ".$count;
			//echo "jestem w 5";
			if ($count == 1) {
				$row = mysqli_fetch_assoc($result);
				$userId = $row['ID'];
				//echo "UserId= ".$userId;
				//echo "jestem w 6";
				$_SESSION['userid'] = $userId;
				$_SESSION['username'] = $username;
				
				//setcookie( $userid, "anonymous", never, "/", "example.com" ); 
				mysqli_close($con);
				
				if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 120)) {
					// last request was more than 30 minutes ago
					session_unset();     // unset $_SESSION variable for the run-time 
					session_destroy();   // destroy session data in storage
				}
				$_SESSION['LAST_ACTIVITY'] = time(); 
	
				header("location:index.php");
				//$msg = $_SESSION['userid']." ".$_SESSION['username'];
				//exit();
			} else {
				$msg .= "Invalid login credentials. ";
			}
		} else {
			$msg .= "Invalid login credentials. ";
		}
	} else {
		$msg .= "Invalid login credentials. ";
	}
}
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>Whiteboard: Login Page</title>
		<link rel="stylesheet" type="text/css" href="style.css" />
	</head>
	<body>
		<!-- Form for logging in the users -->
		<div class="login-form form">
				
			<h1>Login:</h1>
			<form class="form" action="#" method="POST">
			<fieldset>
				<legend>Login</legend>
				<label><span>Username: </span>
					<input id="username" type="text" name="username" placeholder="username" />
				</label>


				<label><span>Password: </span>
					<input id="password" type="password" name="password" placeholder="password" />
				</label>

				<input class="btn" type="submit" name="submit" value="Login" />
				<a class="btn" href="registration.php">Sign up</a>
			</fieldset>
			</form>
			
			<?php
			if (isset($msg) && !empty($msg)) {
				echo $msg;
			}
			?>
			
		</div>
	</body>
</html>