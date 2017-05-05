var timer = 0;

var beginTimer = function() {
  var timer = new Date;

  setInterval(function() {
    $('#timer').html((Math.round((new Date - timer)/100)/10).toFixed(1) + "s");
  }, 100);
}
