/*********************************ENUMS************************************/

/*
 * Remove's ambiguity when using a number to refer
 * to a side of grid
 */

var sideEnum = {
	TOP: 0,
	RIGHT: 1,
	BOTTOM: 2,
	LEFT: 3
};

/*
 * A bumper with consistent orientation keeps the same sign after reflection.
 * For example, something moving positively in X direction moves positively
 * 	in Y direction after meeting a consistent bumper.
 * Likewise, something moving positively in X direction moves negatively
 *	in Y direction after meeting a reversed bumper.
 * Using this representation of bumpers because how a bumper that looks like
 *	"/" behaves depends on what directions are positive.
 */

var orientEnum = {
	CONS: 0,
	REV: 1
};

/*
 * for representing directions
 */

var dirEnum = {
	UP: new coord(0, 1),
	RIGHT: new coord(1, 0),
	DOWN: new coord(0, -1),
	LEFT: new coord(-1, 0)
};


/***********************************GENERATION****************************************/

/*
 * the puzzle object is assumed to have properties
 *	-gridSize, dimensions of grid are (gridSize x gridSize)
 *		not counting entry/exit squares
 *	-grid, representation of the puzzle grid
 *	-level, maps to number of hidden mirrors
 *	-side, defines side of exit
 *	-index, defines index of side of exit
 * this function is a puzzle constructor
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
 * the bumper object has properties
 *	-orient, an orientEnum
 *	-hide, is bumper hidden by a variable?
 */

function bumper(orientation, isdecoy=0){
	this.orient = orientation;
	this.decoy = isdecoy;
}

/* 
 * coordinate object constructor
 *	-x
 *	-y
 */

function coord(x_init, y_init){
	this.x = x_init;
	this.y = y_init;
}

function copyCoord(co){
	return new coord(co.x, co.y);
}

/*
 * returns random integer in interval [min, max]
 */
function rand(min, max){
	return min+Math.floor((max-min+1)*Math.random());
}

//globals used for drawing
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


/*
 * Creates bumpers along the initial path
 * See Andy Green's commentary
 */
function createPathBumpers(puzzle){
	var bumpCount = puzzle.level;
	var i, j;
	var dir;
	var initSqrArray = getInitDirAndSquare(puzzle);
	var initPos = new coord(initSqrArray[0], initSqrArray[1]);
	var pos;
	var bump;
	var initDir = initSqrArray[2];
	var pathGrid;
	var bumpGrid;
	var bumperList = new Array(bumpCount);
	var posList = new Array(bumpCount);
	var madePath = 0;
	pathGrid = new Array(puzzle.gridSize);
	bumpGrid = new Array(puzzle.gridSize);
	for(i = 0; i < puzzle.gridSize; i++){
		pathGrid[i] = new Array(puzzle.gridSize);
		bumpGrid[i] = new Array(puzzle.gridSize);
	}
	do{
		for(i = 0; i < puzzle.gridSize; i++){
			for(j = 0; j < puzzle.gridSize; j++){
				pathGrid[i][j] = 0;
				bumpGrid[i][j] = 0;
			}
		}
		pos = copyCoord(initPos);
		dir = copyCoord(initDir);
		pathGrid[pos.x][pos.y] = 1;
		for(i = 0; i < bumpCount; i++){
			var dist = borderDistance(puzzle, dir, pos);	
			//console.log("border dist: " + dist + "\n");
			var steps = rand(1,dist);
			//console.log("steps: " + steps + "\n");
			if (dist < 1) console.log("dist bad\n");
			if (pathGrid[pos.x + steps*dir.x][pos.y + steps*dir.y]){
				console.log("broke1\n");
				break;
			}
			var breakCond = 0;
			for(j = 0; j < steps; j++){
				pos = new coord(pos.x + dir.x, pos.y + dir.y);
				pathGrid[pos.x][pos.y] = 1;
				if (bumpGrid[pos.x][pos.y]) breakCond = 1;
			}
			if (breakCond) {
				console.log("broke2\n");
				break;
			}
			posList[i] = copyCoord(pos);
			bump = newBumper(puzzle, copyCoord(pos), copyCoord(dir), i == bumpCount - 1);
			bumpGrid[pos.x][pos.y] = 1;
			bumperList[i] = bump;
			dir = reflect(bump, dir);
			if (i == bumpCount - 1){
				madePath = 1;
			}
		}
		dist = borderDistance(puzzle, dir, pos);
		for(j = 0; j < dist; j++){
			pos = new coord(pos.x + dir.x, pos.y + dir.y);
			pathGrid[pos.x][pos.y] = 1;
			if (bumpGrid[pos.x][pos.y]){
				madePath = 0;
			}
		}
	}
	while(!madePath);
	for(i = 0; i < bumpCount; i++){
		puzzle.grid[posList[i].x][posList[i].y] = bumperList[i];
	}
	console.log("madePath: " + madePath);
	console.log("bumpGrid\n");
	dumpOtherGrid(bumpGrid, puzzle.gridSize);
	console.log("puzzle Grid\n");
	dumpOtherGrid(puzzle.grid, puzzle.gridSize);
	puzzle.pathGrid = pathGrid;
	return 0;
}

function decoyBumpers(puzzle){
	var bumpCount = puzzle.level;
	do{
		var i,j;
		i = rand(0,puzzle.gridSize-1);
		j = rand(0, puzzle.gridSize-1);
		if (!puzzle.pathGrid[i][j]){
			bumpCount--;
			puzzle.grid[i][j] = new bumper(rand(0,1), 1);
		}
	}
	while(bumpCount > 0);
}

function dumpOtherGrid(grid, size){
	var i,j;
	var str = "";
	for(j = size-1 ; j >=0; j--){
		for (i = 0; i < size; i++){
			str += grid[i][j]? 1:0;
		}
		str += "\n";
	}
	console.log(str);
}

/*
 * Pretty much lifted exactly as is from Andy Green's code
 */

function borderDistance(puzzle, dir, pos){
	if (dir.x == -1) return pos.x;
	if (dir.x == 1) return puzzle.gridSize-1-pos.x;
	if (dir.y == -1) return pos.y;
	if (dir.y == 1) return puzzle.gridSize-1-pos.y;
	console.log("Unexpected direction\n");
	return -1;
}

function newBumper(puzzle, pos, dir, isLast){
	var i,j;
	var bumperOut = new bumper(rand(0,1), 0);
	if (!isLast){
		var testDir = reflect(bumperOut, dir);
		i = pos.x + testDir.x;
		j = pos.y + testDir.y;
		if (i < 0 || i >= puzzle.gridSize || j < 0 || j >= puzzle.gridSize){
			bumperOut = new bumper(1-bumperOut.orient, 0);
		}
	}
	return bumperOut;
}

function getInitDirAndSquare(puzzle){
	var i,j;
	var dir;
	switch(puzzle.side){
		case sideEnum.TOP:
			dir = copyCoord(dirEnum.DOWN);
			i = puzzle.index;
			j = puzzle.gridSize - 1;
			break;
		case sideEnum.BOTTOM:
			dir = copyCoord(dirEnum.UP);
			i = puzzle.index;
			j = 0;
			break;
		case sideEnum.LEFT:
			dir = copyCoord(dirEnum.RIGHT);
			i = 0;
			j = puzzle.index;
			break;
		case sideEnum.RIGHT:
			dir = copyCoord(dirEnum.LEFT);
			i = puzzle.gridSize - 1;
			j = puzzle.index;
			break;
	}
	out = [i, j, dir];
	return out;
}

/*
 * Function written for debugging
 * Dumps contents of puzzle to console
 */
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

function reflect(bumper, direction){
	return reflectOrient(bumper.orient, direction);
}

function reflectOrient(orient, direction){
	ref_dir = new coord(direction.y, direction.x);
	if (orient == orientEnum.REV){
		ref_dir.x = -ref_dir.x;
		ref_dir.y = -ref_dir.y;
	}
	return ref_dir;
}

function createHidden(puzzle){
	//
}

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
//	ctx.strokeStyle = "rgb(255,50,50)";
	for(i = 1; i <= puzzle.gridSize; i++){
		for(j = 1; j <= puzzle.gridSize; j++){
			if (!puzzle.grid[i-1][j-1]) continue;
			if (puzzle.grid[i-1][j-1].decoy){
				ctx.strokeStyle = "rgb(0,255,0)";
				console.log("decoy\n");
			}
			else{
				ctx.strokeStyle = "rgb(255,0,0)";
				console.log("not decoy\n");
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
					console.log("Unexpected bump state during drawBumpers");
					console.log(slant);
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
			dir = copyCoord(dirEnum.DOWN);
			i = puzzle.index;
			j = puzzle.gridSize - 1;
			break;
		case sideEnum.BOTTOM:
			dir = copyCoord(dirEnum.UP);
			i = puzzle.index;
			j = 0;
			break;
		case sideEnum.LEFT:
			dir = copyCoord(dirEnum.RIGHT);
			i = 0;
			j = puzzle.index;
			break;
		case sideEnum.RIGHT:
			dir = copyCoord(dirEnum.LEFT);
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
			dir = reflect(puzzle.grid[i][j], dir);
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
function fire(event){
	var rad = 1;
	//console.log("Firing");
	var id = setInterval(drawCirc, 5);
	function drawCirc(){
		//console.log("Circling");
		if (rad < 500){
			var rect = canvas.getBoundingClientRect();
			drawGrid(currPuzzle);
			drawBumpers(currPuzzle);
			ctx.strokeStyle = "rgb(50,50,255)";
			ctx.beginPath();
			ctx.arc(event.offsetX, event.offsetY, rad, 0, 2*Math.PI);
			//ctx.arc(event.clientX - rect.left, event.clientY - rect.top, rad, 0, 2*Math.PI);
			document.getElementById("mousepos").innerHTML = "x: " + event.offsetX + " y: " + event.offsetY;
			ctx.stroke();
			rad++;
		}
		else{
			clearInterval(id);
		}
	}
}
*/


/********************************RUN************************************************/

var puzz = new puzzle(8, 10);
createPathBumpers(puzz);
decoyBumpers(puzz);
drawGrid(puzz);
drawExit(puzz);
drawBumpers(puzz);
//drawPath(puzz);
canvas.addEventListener("mousemove", function (e){drawGrid(puzz); drawExit(puzz); drawBumpers(puzz); drawPath(puzz); drawRect(puzz, canvas, e)});
