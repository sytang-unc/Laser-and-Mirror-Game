/********************************RUN************************************************/

var puzz = new puzzle(8, 4, 5, 5);
puzz.createPathBumpers();
puzz.decoyBumpers();
puzz.createHiddenAndClues();

drawGrid(puzz);
drawExit(puzz);
drawBumpers(puzz);
//drawPath(puzz);
displayClues(puzz);
drawGridClues(puzz);
canvas.addEventListener("mousemove", function (e){drawGrid(puzz); drawExit(puzz); drawBumpers(puzz); drawPath(puzz); drawGridClues(puzz); drawRect(puzz, canvas, e)});
