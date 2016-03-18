<?php

session_start(); 
require_once('config.php');


	if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 120)) {
		// last request was more than 30 minutes ago
		session_unset();     // unset $_SESSION variable for the run-time 
		session_destroy();   // destroy session data in storage
	}
	$_SESSION['LAST_ACTIVITY'] = time(); 


	
	if (isset($_SESSION['userid']) && isset($_SESSION['username'])) {
	setcookie("whiteboardUserId", $_SESSION['userid'], 0, '/');
	$username = $_SESSION['username'];
	$userid = $_SESSION['userid'];
		
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>PWI - Whiteboard</title>

		<script type="text/JavaScript" src="engine.js"></script>
		
		<link rel="stylesheet" href="style.css" media="screen">
	</head>
	<body>
		<header>
			<div class="container">
				<img src="img/logo.png" id="logo" title="Whiteboard logo" alt="Whiteboard Logo" />
				<h1>Whiteboard</h1>
				<h2 id="welcome" class="pull-right"><span>Welcome: 
				<?php
					echo $username." ";
				?>
				</span>
				<a href="logout.php" class="pull-right btn2">Logout</a>
				</h2>
			</div>
		</header>
		<?php
				//echo "Development preview: ".$_SESSION['userid']." ".$_SESSION['username'];
				?>
		<section>
						
			<div id="tools" class="container">
				<label>Drawing tool:
					<select id="toolSelector">
						<option value="pencil">Pencil</option>
						<option value="line">Line</option>
						<option value="ellipse">Ellipse</option>
						<option value="rect">Rectangle</option>
						<option value="text">Text</option>
						
					</select>
				</label>

				<label>Stroke Color:
					<select id="strokeStyleSelector">
						<option value="#ffffff">White</option>
						<option value="#c0c0c0">Silver</option>
						<option value="#808080">Gray</option>
						<option value="#000000">Black</option>
						<option value="#ff0000">Red</option>
						<option value="#800000">Maroon</option>
						<option value="#ffff00">Yellow</option>
						<option value="#808000">Olive</option>
						<option value="#00ff00">Lime</option>
						<option value="#008000">Green</option>
						<option value="#00ffff">Aqua</option>
						<option value="#008080">Teal</option>
						<option value="#0000ff">Blue</option>
						<option value="#000080">Navy</option>
						<option value="#ff00ff">Fuchsia</option>
						<option value="#800080">Purple</option>
						<option value="rgba(0,0,0,0)">None</option>
						
					</select>
				</label>
			
				<label>Fill Color:
					<select id="fillStyleSelector">
						<option value="#ffffff">White</option>
						<option value="#c0c0c0">Silver</option>
						<option value="#808080">Gray</option>
						<option value="#000000">Black</option>
						<option value="#ff0000">Red</option>
						<option value="#800000">Maroon</option>
						<option value="#ffff00">Yellow</option>
						<option value="#808000">Olive</option>
						<option value="#00ff00">Lime</option>
						<option value="#008000">Green</option>
						<option value="#00ffff">Aqua</option>
						<option value="#008080">Teal</option>
						<option value="#0000ff">Blue</option>
						<option value="#000080">Navy</option>
						<option value="#ff00ff">Fuchsia</option>
						<option value="#800080">Purple</option>
						<option value="rgba(0,0,0,0)">None</option>
						
					</select>
				</label>
				
				<label>Stroke Size:
					<select id="lineWidthSelector">
						<option value="3">3</option>
						<option value="5">5</option>
						<option value="8">8</option>
						<option value="10">10</option>
						<option value="12">12</option>
						<option value="15">15</option>
						<option value="18">18</option>
						<option value="21">21</option>
						<option value="24">24</option>
						<option value="28">28</option>
						<option value="32">32</option>
				
					</select>
				</label>
			</div>
			
			<div id="canvasContainer" class="container">
				<canvas id="baseCanvas">
					Sorry, your browser does not support HTML5 canvas technology.
				</canvas>
			</div>
			
			<div id="controls" class="container">
				<!--<button class="btn3" onclick="makeRequest('POST', 'getData.php', 'user='+ readCookie('whiteboardUserId') +'&image='+readCookie('whiteboardImageId') +'&timestamp=0', drawImage)">Get image</button>-->
				<button class="btn3" onclick="makeRequest('POST', 'createImage.php', 'image=-1', setupCanvas)">Create new image</button>
				<!--<button class="btn3" onclick="downloadImage()">Download Image</button>-->
				<button class="btn3" onclick="createThumb()">Save thumb</button>
				
				<button class="btn3" onclick="makeRequest('POST', 'getThumbnails.php', 'page=1', attachThumbs);">Get list</button>
				<a id="imageLink" class="btn3" onclick="downloadImage()">Download Image</a>
			</div>
		
			<div id="thumbList" class="container">

			</div>
		</section>
	</body>
</html>
<?php

} else {
	echo "Please log in";
?>
	<a class="btn" href="login.php">Login</a>
	<?php
}
?>