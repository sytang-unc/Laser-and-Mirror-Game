var boardconstruction = function() {
  this.startpoint = [-1, -1];
  this.marked = false;

  this.generate_table = function(size) {
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

  this.clickspaces = {};

  this.mapDrawHandler = function(puzz) {
    this.clueWrite(puzz);
    var board = puzz.getBoard(this.startpoint[0], this.startpoint[1]);
    for (var y=0; y<10; y++) {
      for (var x=0; x<10; x++) {
        var whatev = ".row" + y + ".column" + x;
        if (typeof board[x][y] == 'number'){
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
                case 5:
                  $(whatev).css('background-image','url("onesquarerightbounce.png")');
                  break;
                case 10:
                  $(whatev).css('background-image','url("onesquareleftbounce.png")');
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
                case 6:
                  $(whatev).css('background-image','url("twosquareleftbounce.png")');
                  break;
                case 9:
                  $(whatev).css('background-image','url("twosquarerightbounce.png")');
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
        var whatev = ".top.column" + puzz.getEndpoint()[1] + ".out";
        $(whatev).css('background-image','url("northsouthpoint.png")');
        break;
      case sideEnum.TOP:
        var whatev = ".bottom.column" + puzz.getEndpoint()[1] + ".out";
        $(whatev).css('background-image','url("northsouthpoint.png")');
        break;
      case sideEnum.RIGHT:
        var whatev = ".row" + puzz.getEndpoint()[1] + ".right.out";
        $(whatev).css('background-image','url("eastwestpoint.png")');
        break;
      case sideEnum.LEFT:
        var whatev = ".row" + puzz.getEndpoint()[1] + ".left.out";
        $(whatev).css('background-image','url("eastwestpoint.png")');
        break;
    }
    var endpointcompare = whatev;
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
        if (endpointcompare != whatev) {
          this.clickspaces[clicky] = [side, index];
          var self = this;
          // $(whatev).click(function() {
          //   self.startpoint = self.clickspaces[this.className];
          //   self.mapDrawHandler(puzz);
          // });
          if(this.marked==false) {
            $(whatev).click(function() {
              self.startpoint = self.clickspaces[this.className];
              self.marked = true;
              self.mapDrawHandler(puzz);
              $("div.button").html("<input type=\"button\" class=\"nextButton\" value=\"Next Puzzle\">");
              $(".nextButton").click(function(){
                $(document).trigger("mark");
                $("div.button").html("");
              });
            });
          }
          else {
            $(whatev).unbind();
          }
        }
      }
    }
  }

  this.clueWrite = function(puzz) {
    var cluestring = ""
    for (line in puzz.clues) {
      var clue = "";
      var split = puzz.clues[line].split("CONS");
      var splitlength = split.length;
      for (var i=0; i<splitlength-1; i++) {
        clue = clue + split.shift() + "<img src=\"twosquaremini.png\"/>";
      }
      clue = clue + split.shift();
      split = clue.split("REV");
      clue = "";
      splitlength = split.length;
      for (var i=0; i<splitlength-1; i++) {
        clue = clue + split.shift() + "<img src=\"onesquaremini.png\"/>";
      }
      clue = clue + split.shift();
      cluestring = cluestring + clue + "<br/>";
    }
    $(".clues").html(cluestring);
  }
}
