var timer = 0.0;
var runningtimer = false;

var beginTimer = function() {
  startTimer();
  setInterval(function() {
    if (runningtimer) {
      timer = Math.round((timer + 0.1)*10)/10;
      $('#timer').html(timer.toFixed(1) + "s");
    }
  }, 100);
}

var startTimer = function() {
  runningtimer = true;
}

var stopTimer = function() {
  runningtimer = false;
}
