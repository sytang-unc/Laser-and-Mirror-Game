//globals used for drawing
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var clueSpace = document.getElementById("hints");


/********************************************DRAWING************************************************/
function drawExit(puzzle){
	var cl = cellLength(puzzle);
	ctx.fillStyle = "rgb(50,255,50)";
	switch (puzzle.side){
		case sideEnum.BOTTOM:
			ctx.fillRect((1+puzzle.index)*cl, 0, cl, cl);
			break;
		case sideEnum.RIGHT:
			ctx.fillRect((1+puzzle.gridSize)*cl, (1+puzzle.index)*cl, cl, cl);
			break;
		case sideEnum.TOP:
			ctx.fillRect((1+puzzle.index)*cl, (1+puzzle.gridSize)*cl, cl, cl);
			break;
		case sideEnum.LEFT:
			ctx.fillRect(0, (1+puzzle.index)*cl, cl, cl);
			break;
		default:
			//console.log("Unexpected exit side");
	}
}

function drawGrid(puzzle){
	var cl = cellLength(puzzle);
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.strokeStyle = "rgb(50,50,50)";
	var i,j;
	for(i = 1; i <= puzzle.gridSize; i++){
		for(j = 1; j <= puzzle.gridSize; j++){
			ctx.strokeRect(i*cl, j*cl,
				cl, cl);
		}
	}
}

function drawBumpers(puzzle){
	var i, j;
	var cl = cellLength(puzzle);
//	ctx.strokeStyle = "rgb(255,50,50)";
	for(i = 1; i <= puzzle.gridSize; i++){
		for(j = 1; j <= puzzle.gridSize; j++){
			if (!puzzle.grid[i-1][j-1]) continue;
			if (puzzle.grid[i-1][j-1].decoy){
				ctx.strokeStyle = "rgb(0,255,0)";
				//console.log("decoy\n");
			}
			else if (puzzle.grid[i-1][j-1].hidden){
				ctx.strokeStyle = "rgb(0,0,255)";
				//console.log("not decoy\n");
			}
			else{
				ctx.strokeStyle = "rgb(255,0,0)";
			}
			ctx.beginPath();
			switch(puzzle.grid[i-1][j-1].orient){
				case orientEnum.REV:
					ctx.moveTo( (i+1)*cl, (j)*cl);
					ctx.lineTo( (i)*cl, (j+1)*cl);
					ctx.stroke();
					break;
				case orientEnum.CONS:
					ctx.moveTo( (i+1)*cl, (j+1)*cl );
					ctx.lineTo( (i)*cl, (j)*cl);
					ctx.stroke();
					break;
				default:
					//console.log("Unexpected bump state during drawBumpers: "
						 //+ puzzle.grid[i-1][j-1].orient);
			}
			ctx.closePath();
		}
	}
}

function drawPath(puzzle){
	var i, j;
	var dir;
	var cl = cellLength(puzzle);
	switch(puzzle.side){
		case sideEnum.TOP:
			dir = dirEnum.DOWN.copyCoord();
			i = puzzle.index;
			j = puzzle.gridSize - 1;
			break;
		case sideEnum.BOTTOM:
			dir = dirEnum.UP.copyCoord();
			i = puzzle.index;
			j = 0;
			break;
		case sideEnum.LEFT:
			dir = dirEnum.RIGHT.copyCoord();
			i = 0;
			j = puzzle.index;
			break;
		case sideEnum.RIGHT:
			dir = dirEnum.LEFT.copyCoord();
			i = puzzle.gridSize - 1;
			j = puzzle.index;
			break;
	}
	ctx.fillStyle = "rgb(255,50,50)";
	do{
		//draw
		ctx.fillRect( (1+i)*cl, (1+j)*cl, cl/2, cl/2 );
		//reflect
		if (puzzle.grid[i][j]){
			dir = puzzle.grid[i][j].reflect(dir);
		}
		//update
		i = i + dir.x;
		j = j + dir.y;
	}
	while (i >= 0 && i < puzzle.gridSize && j >= 0 && j < puzzle.gridSize);
}

function drawRect(puzzle, canvas, e){
	ctx.fillStyle = "rgb(0, 50, 0)";
	ctx.fillRect(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, 10, 10);
	//console.log("length: " + cellLength(puzzle) + "\n");
};

/*
 * finds the length of the side of a grid cell
 */
function cellLength(puzzle){
	var l = Math.min(
		Math.floor(canvas.width/(puzzle.gridSize+2)),
		Math.floor(canvas.height/(puzzle.gridSize+2))
	);
	return l;
}

function displayClues(puzzle){
	var str = "";
	var i;
	for(i = 0; i < 2*puzzle.level + 1; i++){
		str += puzzle.clues[i];
		str += "<br>";
	}
	clueSpace.innerHTML = str;
}

function drawGridClues(puzzle){
	var i,j;
	var cl = cellLength(puzzle);
	ctx.fillStyle = "rgb(0, 0, 255)";
	for(i = 0; i < puzzle.gridSize; i++){
		for(j = 0; j < puzzle.gridSize; j++){
			if (puzzle.clueGrid[i][j]){
				ctx.fillText(puzzle.clueGrid[i][j], (i+1)*cl + cl/2, (j+1)*cl + cl/2);
			}
		}
	}
}

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
