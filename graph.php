<?php
include("phpgraphlib.php");

session_start();
$host = getenv("MYSQL_SERVICE_HOST");
$use = getenv("MYSQL_USER");
$pw = getenv("MYSQL_PASSWORD");
$db = getenv("MYSQL_DATABASE");
$user = $_SESSION['user']; 

$graph=new PHPGraphLib(550,350); 
$link = mysql_connect($host, $use, $db, $pw)
   or die('Could not connect: ' . mysql_error());
     
mysql_select_db('SCORES') or die('Could not select database');
  
$dataArray=array();
  
//get data from database
$sql="SELECT time, score,username FROM SCORES WHERE username= "user1" ORDER BY time";
$result = mysql_query($sql) or die('Query failed: ' . mysql_error());
if ($result) {
  while ($row = mysql_fetch_assoc($result)) {
      $score=$row["time"];
      $count=$row["score"];
      //add to data areray
      $dataArray[$score]=$count;
  }
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
