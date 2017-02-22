<?php
	session_start();
	if ($_POST["usrName"]){
		$_SESSION["user"] = $_POST["usrName"];
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
		echo "<b>Welcome " . $_SESSION[user] . "</b><br>\n";
	}
	else{
		echo '<form action="index.php" method="post">\n';
		echo '<input type="text" name="usrName">\n';
		echo '<input type="submit" value="SUBMITION">\n';
	}
?>
</body>
</html>
