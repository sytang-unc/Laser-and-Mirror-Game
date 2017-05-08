var generator = new puzzleGenerator();
var questions = 0;
var questioncorr = 0;
var streak = 0;
var currentstreak = 0;
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
}).on("mark", function(event, correct = 0){
  questions++;
  if (correct) {
    questioncorr++;
    currentstreak++;
    if (currentstreak > streak) {
      streak = currentstreak;
    }
  } else {
    currentstreak = 0;
  }
  puzz = generator.getPuzzle(correct);
  //new puzzle(10, 4, 5, 5);
  //var puzz = new puzzle(10, 4, 5, 5);
  puzz.createPathBumpers();
  puzz.decoyBumpers();
  puzz.createHiddenAndClues();

  var construct = new boardconstruction();

  $('div table.board').html(construct.generate_table(10));
  construct.mapDrawHandler(puzz);
}).on("done", function(event, correct = 0) {
  if (correct) {
    questioncorr++;
  }
  var construct = new boardconstruction();

  $('div table.board').html(construct.generate_table(10));

  $('.clues').html("You have chosen to finish! You answered " + questioncorr + " out of " + questions + " questions correct in " + timer + " seconds, with a longest streak of " + streak +" correct answers. Would you like to submit your score?");

  $("div.button").html("<input type=\"button\" class=\"submitButton\" value=\"Submit Score\">");
});
