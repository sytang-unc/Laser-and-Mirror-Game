$(document).ready(function(){
  var generate_table = function(size) {
    var rowstring = "";

    // Top Row
    rowstring = rowstring + "<tr>";
    rowstring = rowstring + "<td class = \"top left out\"></td>";
    for(j=0; j<size; j++) {
     rowstring = rowstring + "<td " + "class = \"top column" + j + " out\">";
     rowstring = rowstring + "</td>";
    }
    rowstring = rowstring + "<td class = \"top right out\"></td>";
    rowstring = rowstring + "</tr>";

    // Second Row
    rowstring = rowstring + "<tr>";
    rowstring = rowstring + "<td class = \"row0 left out\"></td>";
    rowstring = rowstring + "<td class = \"grid\" colspan=\"" + (size) +
      "\" rowspan=\"" + (size) + "\">";

    // Inner Table
    rowstring = rowstring + "<table class = \"grid\">";
    for(i=0; i<size; i++) {
      rowstring = rowstring + "<tr>";
      for(j=0; j<size; j++) {
        rowstring = rowstring + "<td " + "class = \"row" + i + " column" + j + " space\">";
        rowstring = rowstring + "</td>";
      }
    }
    rowstring = rowstring + "</table>";

    // End Second Row
    rowstring = rowstring + "</td>";
    rowstring = rowstring + "<td class =\"row0 right out\"></td>";
    rowstring = rowstring + "</tr>"

    // Remaining Rows
    for(i=1; i<size; i++) {
      rowstring = rowstring + "<tr>";
      rowstring = rowstring + "<td class = \"row" + i + " left out\"></td>";
      rowstring = rowstring + "<td class = \"row" + i + " right out\"></td>";
      rowstring = rowstring + "</tr>";
    }

    // Bottom Row
    rowstring = rowstring + "<tr>";
    rowstring = rowstring + "<td class = \"bottom left out\"></td>";
    for(j=0; j<size; j++) {
     rowstring = rowstring + "<td " + "class = \"bottom column" + j + " out\">";
     rowstring = rowstring + "</td>";
    }
    rowstring = rowstring + "<td class = \"bottom right out\"></td>";
    rowstring = rowstring + "</tr>";
    rowstring = rowstring + "</table>";
    return rowstring;
  }

  var clickspaces = {};

  var mapDrawHandler = function() {
    var board = puzz.getBoard(startpoint[0], startpoint[1]);
    for (var y=0; y<10; y++) {
      for (var x=0; x<10; x++) {
        var whatev = ".row" + y + ".column" + x;
        if (typeof board[x][y] == 'number'){
          if(startpoint[0] != -1 || startpoint[1] != -1) {
            console.log(board[x][y]);
          }
          switch(Math.floor(board[x][y]/16)) {
            case 0:
              switch(board[x][y]) {
                case 0:
                  $(whatev).css('background-image','');
                  break;
                case 3:
                  $(whatev).css('background-image','url("rightleftbounce.png")');
                  break;
                case 12:
                  $(whatev).css('background-image','url("updownbounce.png")');
                  break;
                case 15:
                  $(whatev).css('background-image','url("doublebounce.png")');
                  break;
              }
              break;
            case 1:
              switch(board[x][y]-16) {
                case 0:
                  $(whatev).css('background-image','url("onesquare.png")');
                  break;
                case 6:
                  $(whatev).css('background-image','url("onesquareleftbounce.png")');
                  break;
                case 9:
                  $(whatev).css('background-image','url("onesquarerightbounce.png")');
                  break;
                case 15:
                  $(whatev).css('background-image','url("onesquaredoublebounce.png")');
                  break;
              }
              break;
            case 2:
              switch(board[x][y]-32) {
                case 0:
                  $(whatev).css('background-image','url("twosquare.png")');
                  break;
                case 5:
                  $(whatev).css('background-image','url("twosquarerightbounce.png")');
                  break;
                case 10:
                  $(whatev).css('background-image','url("twosquareleftbounce.png")');
                  break;
                case 15:
                  $(whatev).css('background-image','url("twosquaredoublebounce.png")');
                  break;
              }
              break;
          }
        }
        else {
          $(whatev).html(board[x][y]);
          $(whatev).css('background-image','url("circle.png")');
        }
      }
    }
    switch(puzz.getEndpoint()[0]) {
      case sideEnum.BOTTOM:
        var whatev = ".top.column" + puzz.getEndpoint()[1];
        $(whatev).css('background-image','url("northsouthpoint.png")');
        break;
      case sideEnum.TOP:
        var whatev = ".bottom.column" + puzz.getEndpoint()[1];
        $(whatev).css('background-image','url("northsouthpoint.png")');
        break;
      case sideEnum.RIGHT:
        var whatev = ".row" + puzz.getEndpoint()[1] + ".right";
        $(whatev).css('background-image','url("eastwestpoint.png")');
        break;
      case sideEnum.LEFT:
        var whatev = ".row" + puzz.getEndpoint()[1] + ".left";
        $(whatev).css('background-image','url("eastwestpoint.png")');
        break;
    }
    for(var side=0; side<4; side++) {
      for(var index=0; index<10; index++) {
        switch(side) {
          case sideEnum.BOTTOM:
            var whatev = ".top.column" + index + ".out";
            var clicky = "top column" + index + " out";
            break;
          case sideEnum.TOP:
            var whatev = ".bottom.column" + index + ".out";
            var clicky = "bottom column" + index + " out";
            break;
          case sideEnum.RIGHT:
            var whatev = ".row" + index + ".right.out";
            var clicky = "row" + index + " right out";
            break;
          case sideEnum.LEFT:
            var whatev = ".row" + index + ".left.out";
            var clicky = "row" + index + " left out";
            break;
        }
        clickspaces[clicky] = [side, index];
        $(whatev).unbind().click(function() {
          startpoint = clickspaces[this.className];
          console.log(startpoint);
          mapDrawHandler();
        });
      }
    }
  }

  var solution = function() {
    for (var y=0; y<10; y++) {
      for (var x=0; x<10; x++) {
        var whatev = ".row" + y + ".column" + x;
        switch(correctboard[y][x]) {
          case 1:
            $(whatev).css('background-image','url("updownbounce.png")');
            break;
          case 2:
            $(whatev).css('background-image','url("rightleftbounce.png")');
            break;
          case 3:
            if (board[y][x] == 1) {
              $(whatev).css('background-image','url("onesquarerightbounce.png")');
            }
            else if (board[y][x] == 2) {
              $(whatev).css('background-image','url("twosquarerightbounce.png")');
            }
            break;
          case 4:
            if (board[y][x] == 1) {
              $(whatev).css('background-image','url("onesquareleftbounce.png")');
            }
            else if (board[y][x] == 2) {
              $(whatev).css('background-image','url("twosquareleftbounce.png")');
            }
            break;
        }
      }
    }
  }

  // var board = [
  //   [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  //   [0, 1, 0, 0, 2, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  //   [0, 0, 1, 0, 2, 0, 0, 1, 0, 1],
  //   [0, 0, 0, 2, 0, 0, 0, 1, 0, 2],
  //   [0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  // ];
  //
  // var correctboard = [
  //   [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  //   [0, 3, 2, 2, 4, 0, 0, 1, 0, 0],
  //   [0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
  //   [0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
  //   [0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
  //   [0, 1, 0, 0, 3, 2, 2, 4, 0, 0],
  //   [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
  // ]

  // 0 is an empty square, 1 is a / square, and 2 is a \ square.

  // var endpoint = [1, "south"];

  var puzz = new puzzle(10, 4, 5, 5);
  var startpoint = [-1, -1];
  puzz.createPathBumpers();
  puzz.decoyBumpers();
  puzz.createHiddenAndClues();

  $('div table.board').append(generate_table(10));
  mapDrawHandler();
  // solution();
});
