<?php
include("phpgraphlib.php");

session_start();
$host = getenv("MYSQL_SERVICE_HOST");
$use = getenv("MYSQL_USER");
$pw = getenv("MYSQL_PASSWORD");
$db = getenv("MYSQL_DATABASE");


$graph=new PHPGraphLib(550,350);
$dataArray=array();

if (isset($_SESSION["user"])){

	$conn = new mysqli($host, $use, $pw, $db);
		   //or die('Could not connect: ' . mysql_error());

	//mysql_select_db('mirror_storage') or die('Could not select database');


	//get data from database
	$sql="SELECT time, score,username FROM SCORES WHERE username=" . $_SESSION["user"] . " ORDER BY time";
	$result = $conn->query($sql);// or die('Query failed: ' . mysql_error());
	if ($result) {

		while ($row = $result->fetch_array()) {
			//console.log("FETCHING :\)");
			$time=$row["time"];
			$score=$row["score"];
			//add to data areray
			$dataArray[$time]=$score;
		}
	}

	$conn->close();
}
//configure graph
$graph->setDataValues(true);
$graph->setXValuesHorizontal(true);
$graph->addData($dataArray);
$graph->setTitle("Score");
$graph->setBars(false);
$graph->setDataPoints(true);
$graph->setDataPointColor('red');
$graph->setLine(true);
$graph->setLineColor('red');
$graph->createGraph();

?>
