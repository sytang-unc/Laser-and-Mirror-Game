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

  var board = [
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 2, 0, 0, 1, 0, 1],
    [0, 0, 0, 2, 0, 0, 0, 1, 0, 2],
    [0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  // 0 is an empty square, 1 is a / square, and 2 is a \ square.

  var endpoint = [1, "south"];

  $('div table.board').append(generate_table(10));
});
