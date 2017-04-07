<?php
///a default database -> php connection file, based on setupTest.php file
	// connect => ('server', 'username', 'password ')
	$conn = mysqli_connect('sql9.freemysqlhosting.net', 'sql9165833', 'fcUVrz3Cl4');
	if (!$conn){
	    die("Database Connection Failed" . mysqli_error($conn));
	}
   //modify to test for a existing db, this selects the database of your target
	$select_db = mysqli_select_db($conn, 'test');
	if (!$select_db){
 	   die("Database Selection Failed" . mysqli_error($conn));
	}
?>