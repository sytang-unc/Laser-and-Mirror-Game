var generator = new puzzleGenerator();
var puzz;
$(document).ready(function() {
  // var puzz = new puzzle(10, 4, 5, 5);
  // puzz.createPathBumpers();
  // puzz.decoyBumpers();
  // puzz.createHiddenAndClues();

  var construct = new boardconstruction();

  $('div table.board').html(construct.generate_table(10));

  $("div.button").html("<input type=\"button\" class=\"nextButton\" value=\"Begin Puzzle\">");
  $(".nextButton").click(function(){
    $(document).trigger("mark");
    $("div.button").html("");
    beginTimer();
  });
  // construct.mapDrawHandler(puzz);
}).on("mark", function(event, correct = 0, total = 0){
  puzz = generator.getPuzzle(correct);
  //new puzzle(10, 4, 5, 5);
  //var puzz = new puzzle(10, 4, 5, 5);
  puzz.createPathBumpers();
  puzz.decoyBumpers();
  puzz.createHiddenAndClues();

  var construct = new boardconstruction();

  $('div table.board').html(construct.generate_table(10));
  construct.mapDrawHandler(puzz);
});
