<?php
	session_start();
	if ($_POST["usrName"]){
		$_SESSION["user"] = $_POST["usrName"];
	}
	else{
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
	if ($_SESSION["user"]){
		echo '<b>Welcome ' . $_SESSION[user] . '</b>'
			. '<form method="post">'
			. '<input type="submit" value="LOGOUT">';
	}
	else{
		echo '<form method="post">'
			. '<fieldset>'
			. '<legend>Login</legend>'
				. 'Username: <input type="text" name="usrName"><br>'
				. 'Password: <input type="text" name="pass"><br>'
				. '<input type="submit" value="SUBMITION">'
			. '</fieldset>';
	}
?>
</body>
</html>
