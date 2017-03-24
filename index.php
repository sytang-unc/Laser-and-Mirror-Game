<?php
/*
	Session variables
	user - username of logged in user if exists (otherwise not set)
	LOG_STATE - 1 if user is logged in (otherwise not set)
	LOG_REASON - reason for login failure (not set when no attempt to login is made)
*/

	#LOG_REASON values
	define("CONNECT_FAIL", 2);
	define("NO_ACCOUNT", 3);

	session_start();
	if ($_POST["LOG_ACTION"] == "LOGIN"){
		$_SESSION["LOG_STATE"] = 0;#pessimism
		#connect to mysql database
		$host = getenv("MYSQL_SERVICE_HOST");
		$use = getenv("MYSQL_USER");
		$pw = getenv("MYSQL_PASSWORD");
		$db = getenv("MYSQL_DATABASE");
		if (!$host || !$use || !$pw || !$db){
			$_SESSION["LOG_REASON"] = CONNECT_FAIL;
		}
		else{
			$conn = new mysqli(
				$host,
				$use,
				$pw,
				$db
			);
			if ($conn->connect_errno){
				$_SESSION["LOG_REASON"] = CONNECT_FAIL;
			}
			#if connection successful, scan accounts table
			#	for matching user & password
			else{
				$stmt = $conn->prepare("
					SELECT username
					FROM ACCOUNTS
					WHERE username=? AND password=?"
				);
				$stmt->bind_param("ss", $_POST["usrName"], $_POST["pass"]);
				$stmt->execute();
				#no match found
				if ($stmt->get_result()->num_rows == 0){
					$_SESSION["LOG_REASON"] = NO_ACCOUNT;
				}
				#match found, update session accordingly
				else{
					$_SESSION["user"] = $_POST["usrName"];
					$_SESSION["LOG_STATE"] = 1;
					if (isset($_SESSION["LOG_REASON"])){
						unset($_SESSION["LOG_REASON"]);
					}
				}
				$stmt->close();
				$conn->close();
			}
		}
	}
	#on logout, destroy session
	elseif($_POST["LOG_ACTION"] == "LOGOUT"){
		session_destroy();
		session_start();
		#seems weird, check up on this later
	}
?>
<!DOCTYPE html>
<html>
<head>
	<!-- <link rel="stylesheet" href="style.css"> -->
	<title id="mytitle">PHP Test</title>
</head>
<body>
<div id="login">
<?php
	if ($_SESSION["LOG_STATE"]){
		echo '<b>Welcome ' . $_SESSION[user] . '</b>'
			. '<form method="post">'
			. '<input type="hidden" name="LOG_ACTION" value="LOGOUT">'
			. '<input type="submit" value="LOGOUT">'
			. '</form>';
	}
	else{
		switch ($_SESSION["LOG_REASON"]){
			case CONNECT_FAIL:
				echo '<b>Login failed due to failed MySQL connection</b><br>';
				break;
			case NO_ACCOUNT:
				echo '<b>Given username and password not recognized</b><br>';
				break;
			default:
				echo '<b>Login/Sign-up:</b>';
		}
		echo '<form method="post">'
			. '<fieldset>'
			. '<legend>Login</legend>'
				. 'Username: <input type="text" name="usrName"><br>'
				. 'Password: <input type="text" name="pass"><br>'
				. '<input type="submit" value="SUBMITION">'
				. '<input type="hidden" name="LOG_ACTION" value="LOGIN">'
			. '</fieldset>'
			. '</form>';
	}
?>
</div>

<canvas id="canvas" width="1000" height="1000">
	Browser does not support canvas!
</canvas>

<div id="hints">
</div>

<script src=puzzle.js></script>

</body>
</html>
