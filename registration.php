<?php
require_once('config.php');
// If the values are posted, insert them into the database.
if (isset($_POST['username']) && isset($_POST['password'])) {
	
	$checkUsername = preg_match('/^[a-zA-Z][a-zA-Z0-9_]{5,11}$/', $_POST['username']);
	$checkPassword = preg_match('/^[a-zA-Z][a-zA-Z0-9_]{6,12}$/', $_POST['password']);
	
	$msg = "";
	
	if ($checkUsername == false) {
		$msg .= "Username must be 6-12 characters long and begin with letter.\n";
	}

	if ($checkPassword == false) {
		$msg .= "Password must be 6-12 characters long and begin with letter.\n";
	}

	if ($checkUsername == true && $checkPassword == true) {
		
		$username = htmlspecialchars($_POST['username']);	// niepotrzebne ?
		$password = htmlspecialchars($_POST['password']);	// niepotrzebne ?
		
		$password = hash("sha256", $password);
		
		$sql = "INSERT INTO users (name, pass) VALUES ('".$username."', '".$password."')";
		$result = mysqli_query($con, $sql);

		if ($result) {
			$msg .= "User registered. Go to login page.\n";
			mysqli_close($con);
			header("refresh:1;url=login.php");
		} else if (mysqli_errno($con) == 1062) {
			$msg .= "Username already exists.\n";
		} else {
			$msg .= "An error occured. Please try again later.\n";
			//echo mysqli_errno($con)." ".mysqli_error($con);	// wyswietla jaki blad
		}
	}
}
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>Whiteboard: Registration Page</title>
		<link rel="stylesheet" type="text/css" href="style.css" />
	</head>
	<body>
		<!-- Form for logging in the users -->
		<div class="register-form form">
				
			<h1>Registration:</h1>
			<form action="#" method="POST">
			<fieldset>
				<legend>Registration</legend>
				<label><span>Username: </span>
					<input id="username" type="text" name="username" placeholder="username" />
				</label>


				<label><span>Password: </span>
					<input id="password" type="password" name="password" placeholder="password" />
				</label>

				<input class="btn register" type="submit" name="submit" value="Sign Up" />
				<a class="btn" href="login.php">Login</a>
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