<?php
///a default database -> php connection file, based on setupTest.php file
	// connect => ('server', 'username', 'password ')
//$route = ""  //
	session_start();
	$host_route = getenv("MYSQL_SERVICE_HOST");
	$use = getenv("MYSQL_USER");
	$pw = getenv("MYSQL_PASSWORD");
	$db = getenv("MYSQL_DATABASE");
	$user = $_SESSION['user']; 
	$conn = mysqli_connect('host_route', 'use', 'pw');
	if (!$conn){
	    die("Database Connection Failed" . mysqli_error($conn));
	}
   //modify to test for a existing db, this selects the database of your target
	$select_db = mysqli_select_db($conn, 'ACCOUNTS');
	if (!$select_db){
 	   die("Database Selection Failed" . mysqli_error($conn));
	}
?>