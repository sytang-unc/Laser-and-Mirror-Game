<?php

session_start();
$host = getenv("MYSQL_SERVICE_HOST");
$use = getenv("MYSQL_USER");
$pw = getenv("MYSQL_PASSWORD");
$db = getenv("MYSQL_DATABASE");

if (isset($_SESSION["user"])){

	$conn = new mysqli($host, $use, $pw, $db);
	if ($conn->connect_error){
		echo "Failed to connect to database";
		exit();
	}

	$stmt = $conn->prepare("INSERT INTO SCORES VALUES(?,?,?)");
	if (!$stmt){
		echo "Failed to prepare statement";
		exit();
	}
	if (! ($stmt->bind_param("ssi", $_SESSION["user"], $_POST["data_time"], $_POST["data_score"]) ) ){
		echo "Failed to bind parameters";
		exit();
	}
	if (! ($stmt->execute()) ){
		echo "Failed to execute";
		exit();
	}


	$conn->close();
	echo "Score submitted under " . $_SESSION["user"];
}
else{
	echo "Score not submitted. Please log in.";
}

?>
