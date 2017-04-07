<?php
include("phpgraphlib.php");
    
$graph=new PHPGraphLib(550,350); 
$link = mysql_connect($host, $use, $pw)
   or die('Could not connect: ' . mysql_error());
     
mysql_select_db('SCORES') or die('Could not select database');
  
$dataArray=array();
  
//get data from database
$sql="SELECT score, COUNT(*) AS 'count' FROM SCORES ";
$result = mysql_query($sql) or die('Query failed: ' . mysql_error());
if ($result) {
  while ($row = mysql_fetch_assoc($result)) {
      $score=$row["score"];
      $count=$row["count"];
      //add to data areray
      $dataArray[$score]=$count;
  }
}
  
//configure graph
$graph->addData($dataArray);
$graph->setTitle("Score");
$graph->setGradient("lime", "green");
$graph->setBarOutlineColor("black");
$graph->createGraph();
?>