// var generator = new puzzleGenerator();

$(document).ready(function() {
  var puzz = new puzzle(10, 4, 5, 5);
  puzz.createPathBumpers();
  puzz.decoyBumpers();
  puzz.createHiddenAndClues();

  var construct = new boardconstruction();

  $('div table.board').html(construct.generate_table(10));
  construct.mapDrawHandler(puzz);
}).on("mark", function(){
  console.log("Hi!");

  var puzz = new puzzle(10, 4, 5, 5);
  puzz.createPathBumpers();
  puzz.decoyBumpers();
  puzz.createHiddenAndClues();

  var construct = new boardconstruction();

  $('div table.board').html(construct.generate_table(10));
  construct.mapDrawHandler(puzz);
});
