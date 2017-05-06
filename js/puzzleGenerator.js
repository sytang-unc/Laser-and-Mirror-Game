var puzzleGenerator = function(){
	var init_gridSize = 10;
	var defaultDifficultyCurve = [
		new curveElement(0,	0,	0,	0,	30),
		new curveElement(1,	0,	0,	0,	90),
		new curveElement(1,	0.5,	0,	0,	90),
		new curveElement(2,	0,	0,	0,	150),
		new curveElement(2,	0.5,	0,	0,	150),
		new curveElement(3,	0,	0,	0,	210),
		new curveElement(3,	0.5,	0,	0,	210),
		new curveElement(4,	0,	0,	0,	270),
		new curveElement(4,	0.5,	0,	0,	270),
	];

	this.gridSize = 10;
	this.curveIndex = 0;
	this.curve = defaultDifficultyCurve;

	this.getPuzzle = function(correct = -1){
		if (correct == -1){
			this.curveIndex = 0;
		}
		else if (correct){
			this.curveIndex = Math.min(this.curve.length-1, this.curveIndex + 1);
		}
		else{
			this.curveIndex = Math.max(0, this.curveIndex - 1);
		}
		var ce = this.curve[this.curveIndex];
		var puzz = new puzzle(this.gridSize, ce.level, ce.decoy);
		return puzz;
	}	
}

var curveElement = function(init_level, init_sent, init_redund, init_decoy, init_timer){
	this.level = init_level;
	this.sent_difff = init_sent;
	this.redund = init_redund;
	this.decoy = init_decoy
	this.timer = init_timer;
}
