<?php

	define("LOGIN_SUCC", 0);
	define("CONNECT_FAIL", 1);
	define("NO_ACCOUNT", 2);

	session_start();
	if ($_POST["LOG_ACTION"] == "LOGIN"){
		$conn = new mysqli(
			getenv("MYSQL_SERVICE_HOST"),
			getenv("MYSQL_USER"),
			getenv("MYSQL_PASSWORD"),
			getenv("MYSQL_DATABASE")
		);
		if ($conn->connect_errno){
			$_SESSION["LOGG"] = CONNECT_FAIL;
		}
		else{
			$stmt = $conn->prepare("
				SELECT username
				FROM ACCOUNTS
				WHERE username=? AND password=?"
			);
			$stmt->bind_param("ss", $_POST["usrName"], $_POST["password"]);
			$stmt->execute();
			if ($stmt->get_result()->num_rows == 0){
				$_SESSION["LOGG"] = NO_ACCOUNT;
			}
			else{
				$_SESSION["LOGG"] = LOGIN_SUCC;
			}
			$stmt->close();
			$conn->close();
		}
	}
	elseif($_POST["LOG_ACTION"] == "LOGOUT"){
		session_destroy();
		session_start();
		#seems weird, check up on this later
	}
?>
<!DOCTYPE html>
<html>
<head>
	<title>PHP Test</title>
</head>
<body>
<?php
	if (!$_SESSION["LOGG"]){
		echo '<b>Welcome ' . $_SESSION[user] . '</b>'
			. '<form method="post">'
			. '<input type="hidden" name="LOG_ACTION" value="LOGOUT">'
			. '<input type="submit" value="LOGOUT">';
	}
	else{
		switch ($_SESSION["LOGG"]){
			case CONNECT_FAIL:
				echo '<b>Login failed due to failed MySQL connection</b><br>';
				break;
			case NO_ACCOUNT:
				echo '<b>Given username and password not recognized</b><br>';
				break;
			case LOGIN_SUCC:
				echo '<b>Success option should not be triggered</b><br>';
				break;
			default:
				echo '<b>Default option should not be triggered</b><br>';
		}
		echo '<form method="post">'
			. '<fieldset>'
			. '<legend>Login</legend>'
				. 'Username: <input type="text" name="usrName"><br>'
				. 'Password: <input type="text" name="pass"><br>'
				. '<input type="submit" value="SUBMITION">'
				. '<input type="hidden" name="LOG_ACTION" value="LOGIN">'
			. '</fieldset>';
	}
?>
</body>
</html>
