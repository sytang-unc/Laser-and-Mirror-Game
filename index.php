<!DOCTYPE html>
<html>
  <head>
    <title>Board</title>
    <script src="http://www.cs.unc.edu/Courses/comp426-f16/jquery-3.1.0.js" type="text/javascript"></script>
    <link rel="stylesheet" href="css/board.css" />
    <script src="js/puzzle.js" type="text/javascript"></script>
    <script src="js/puzzleGenerator.js" type="text/javascript"></script>
    <script src="js/boardconstruction.js" type="text/javascript"></script>
    <script src="js/multiboard.js" type="text/javascript"></script>
    <script src="js/timer.js" type="text/javascript"></script>
    <!-- <script src="singleboard.js" type="text/javascript"></script> -->

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
            <td id="gametab" style="border-bottom: 0px; cursor: default;" onClick="window.location.reload()">
              GAME
            </td>
            <td id="logintab" style="cursor: default;" onClick="location.href='login.php'">
              LOGIN
            </td>
            <td id="statstab" style="cursor: default;" onClick="location.href='stats.php'">
              STATS
            </td>
          </tr>
        </table>
      </div>
      <div id="window">
        <div>
          <div style="float:left;">
            <table class="board">
            </table>
          </div>
          <div id="cluesbox" style="height:100%;">
            <table style="height:100%; width: 310px;">
              <tr style="height:80px;">
                <td>
                  <div class="clues">
                    The board on the left will have hidden mirrors you must use to reflect a laser into the highlighted square. Use your logical skills and follow clues to figure out where the hidden mirrors are and reach the goal.
                    <br/><br/>
                    You will be timed. Good luck!
                  </div>
                </td>
              </tr>
              <tr style="height:10px">
                <td>
                  <div class="button" style="margin-top: 10px;">
                  </div>
                </td>
              </tr>
              <tr>
                <td style="vertical-align:bottom;">
                  <div id="timer" style="float:right; vertical-align:bottom; display:inline-block; font-weight: bold; font-size: 20px;">
                    0.0s
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div id="footer">
        Ram Neta
      </div>
    </div>
  </body>
</html>
