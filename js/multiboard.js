var generator = new puzzleGenerator();
var questions = 0;
var questioncorr = 0;
var streak = 0;
var currentstreak = 0;
var puzz;
var score = 0;

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
    score += Math.max(8, currentstreak);
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
}).on("done", function(event, chose = 0, correct = 0) {
  var curtime = timer;
  if (correct) {
    questioncorr++;
  }
  var construct = new boardconstruction();

  $('div table.board').html(construct.generate_table(10));
  var clueBegStr;
  var clueEndStr = " You answered " + questioncorr + " out of " + questions + " questions correct, with a longest streak of " + streak + " correct answers. Your score was " + score + ". Would you like to submit your score?";
  if (chose){
    clueBegStr = "You have chosen to finish with " + curtimer + " seconds to spare!";
  }
  else{
    clueBegStr = "You have timed out!";
  }
  
  $('.clues').html(clueBegStr + clueEndStr;
  $("div.button").html("<input type=\"button\" onclick=\"submit_score()\" class=\"submitButton\" value=\"Submit Score\">");
});

function submit_score(){
  var now = new Date();
  function pad(val){
    return (val < 10)? "0"+val:""+val;
  }
  var year = "" + now.getFullYear();
  var month = pad(now.getMonth());
  var day = pad(now.getDate());
  var hour = pad(now.getHours());
  var minute = pad(now.getMinutes());
  var sec = pad(now.getSeconds());
  var dateStr = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + sec;
  var dataObject = {data_time: dateStr, data_score: score};
  $.ajax({
    url: "../php/submitScore.php",
    data: dataObject,
    type: "POST",
    dataType: "text",
    success: function(resp){
      alert(resp);
    }
  });
}    
