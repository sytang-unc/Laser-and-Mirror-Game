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

  var mapDrawHandler = function() {
    for (var y=0; y<10; y++) {
      for (var x=0; x<10; x++) {
        var whatev = ".row" + y + ".column" + x;
        switch(board[y][x]) {
          case 1:
            $(whatev).css('background-image','url("onesquare.png")');
            break;
          case 2:
            $(whatev).css('background-image','url("twosquare.png")');
            break;
        }
      }
    }
    switch(endpoint[1]) {
      case "north":
        var whatev = ".top.column" + endpoint[0];
        $(whatev).css('background-image','url("northsouthpoint.png")');
        break;
      case "south":
        var whatev = ".bottom.column" + endpoint[0];
        $(whatev).css('background-image','url("northsouthpoint.png")');
        break;
      case "east":
        var whatev = ".row" + endpoint[0] + ".right";
        $(whatev).css('background-image','url("eastwestpoint.png")');
        break;
      case "west":
        var whatev = ".row" + endpoint[0] + ".left";
        $(whatev).css('background-image','url("eastwestpoint.png")');
        break;
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

  $('div table.board').append(generate_table(10));
  mapDrawHandler();
  solution();
});
