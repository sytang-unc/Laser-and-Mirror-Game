<?php

session_start();

?>

<!DOCTYPE html>
<html>
  <head>
    <title>Board</title>
    <script src="http://www.cs.unc.edu/Courses/comp426-f16/jquery-3.1.0.js" type="text/javascript"></script>
    <link rel="stylesheet" href="css/board.css" />

    <script type="text/javascript" src="fusioncharts/js/fusioncharts.js"></script>
    <script type="text/javascript" src="fusioncharts/js/themes/fusioncharts.theme.ocean.js"></script>
  </head>
  <body>
    <div id="container">
      <div id="header">
      <?php
        if (isset($_SESSION['user'])){
          echo 'Mirror Logic Puzzle (' . $_SESSION['user'] . ')';
        }
        else{
          echo 'Mirror Logic Puzzle';
        }
      ?>
      </div>
      <div id="menu">
        <table>
          <tr>
            <td id="gametab" style="cursor: default;" onClick="location.href='board.php'">
              GAME
            </td>
            <td id="logintab" style="cursor: default;" onClick="location.href='login.php'">
              LOGIN
            </td>
            <td id="statstab" style="border-bottom: 0px; cursor: default;" onClick="window.location.reload()">
              STATS
            </td>
          </tr>
        </table>
      </div>
      <div id="window" style="display:block">
      <?php
        if (isset($_SESSION['user'])){
          echo '<img src="/php/graph.php"/>';
        }
        else{
          echo "<p>Login to view</p>";
        }
      ?>
      </div>
      <div id="footer">
        Ram Neta
      </div>
    </div>
  </body>
</html>
