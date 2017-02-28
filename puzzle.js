/*
the puzzle object is assumed to have properties
	-gridSize, dimensions of grid are (gridSize x gridSize)
		not counting entry/exit squares
	-grid, representation of the puzzle grid
	-level, maps to number of mirrors
	-side, defines side of exit
	-index, defines index of side of exit
*/

function puzzle(gridSize_init, level_init){
	this.gridSize = gridSize_init;
	this.grid = new Array(gridSize_init);
	var i;
	for(i = 0; i < gridSize_init; i++){
		this.grid[i] = new Array(gridSize_init);
		var j;
		for(j = 0; j < gridSize_init; j++){
			this.grid[i][j] = 0;
		}
	}
	this.level = level_init;
	this.side = rand(0,3);
	this.index = rand(0, gridSize_init - 1);
}

/*
the bumper object has properties
	-orient, describes whether \ or /
	-hide, is bumper hidden by a variable?
*/

function bumper(orientation, hidden=false){
	this.orient = orientation;
	this.hide = hidden;
}

/* 
coord object
	-x
	-y
*/

function coord(x_init, y_init){
	this.x = x_init;
	this.y = y_init;
}

function rand(min, max){
	return min+Math.floor((max-min+1)*Math.random());
}

//globals
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var currPuzzle = new puzzle(10, 15);

function createBumpers(puzzle){
	var bumpCount = puzzle.level;
	do{
		var x = rand(0, puzzle.gridSize-1);
		var y = rand(0, puzzle.gridSize-1);
		if (puzzle.grid[x][y] == 0){
			var ori = rand(0,1) == 1? "\\" : "/";
			puzzle.grid[x][y] = new bumper(ori);
			bumpCount--;
		}
	}
	while(bumpCount > 0);
}

function dumpGrid(puzzle){
	var i,j;
	var str = "";
	//not reverse order required here for consistency
	for(j = 0; j < puzzle.gridSize; j++){
		for(i = 0; i < puzzle.gridSize; i++){
			if (puzzle.grid[i][j] == 0){
				str += "0";
			}
			else{
				str += puzzle.grid[i][j].orient;
			}
		}
		str += "\n";
	}
	console.log(str);
}

function cellLength(puzzle){
	var l = Math.min(
		Math.floor(canvas.width/(puzzle.gridSize+2)),
		Math.floor(canvas.height/(puzzle.gridSize+2))
	);
	return l;
}

function drawExit(puzzle){
	var cl = cellLength(puzzle);
	ctx.fillStyle = "rgb(50,255,50)";
	switch (puzzle.side){
		case 0:
			ctx.fillRect((1+puzzle.index)*cl, 0, cl, cl);
			break;
		case 1:
			ctx.fillRect((1+puzzle.gridSize)*cl, (1+puzzle.index)*cl, cl, cl);
			break;
		case 2:
			ctx.fillRect((1+puzzle.index)*cl, (1+puzzle.gridSize)*cl, cl, cl);
			break;
		case 3:
			ctx.fillRect(0, (1+puzzle.index)*cl, cl, cl);
			break;
		default:
			console.log("Unexpected exit side");
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
	ctx.strokeStyle = "rgb(255,50,50)";
	for(i = 1; i <= puzzle.gridSize; i++){
		for(j = 1; j <= puzzle.gridSize; j++){
			if (puzzle.grid[i-1][j-1] == 0) continue;
			var slant = puzzle.grid[i-1][j-1].orient;
			if (slant == "/"){
				ctx.moveTo( (i+1)*cl, (j)*cl);
				ctx.lineTo( (i)*cl, (j+1)*cl);
				ctx.stroke();
			}
			else if (slant == "\\"){
				ctx.moveTo( (i+1)*cl, (j+1)*cl );
				ctx.lineTo( (i)*cl, (j)*cl);
				ctx.stroke();
			}
			else{
				console.log("Unexpected bump state during drawBumpers");
				console.log(slant);
			}
		}
	}
}


function fire(event){
	var rad = 1;
	//console.log("Firing");
	var id = setInterval(drawCirc, 5);
	function drawCirc(){
		//console.log("Circling");
		if (rad < 500){
			drawGrid(currPuzzle);
			drawBumpers(currPuzzle);
			ctx.strokeStyle = "rgb(50,50,255)";
			ctx.beginPath();
			ctx.arc(event.clientX, event.clientY, rad, 0, 2*Math.PI);
			ctx.stroke();
			rad++;
		}
		else{
			clearInterval(id);
		}
	}
}
