var puzzleGenerator = function(){
	var init_gridSize = 10;
	var init_decoy = 0;
	var init_level = 0;

	this.gridSize = 10;
	this.decoyCount = 0;
	this.level = 0;
	this.times = new Array();
	this.index = 0;

	this.gridSizeInterval = 5;
	this.gridSizeFloor = 8;
	this.decoyInterval = 5;
	this.decoyFloor = 0;
	this.levelInterval = 5;
	this.levelFloor = 0;

	this.getPuzzle = function(correct = -1, time = -1){
		if (correct == -1 && time == -1){
			return new puzzle(this.gridSize, this.level);
		}
		this.gridSize = init_gridSize != -1?
			Math.floor(Math.random()*this.gridSizeInterval
				+ this.gridSizeFloor):
			init_gridSize;
		this.decoyCount = init_decoy != -1?
			Math.floor(Math.random()*this.decoyInterval
				+ this.decoyFloor):
			init_decoy;
		this.level = init_level != -1?
			Math.floor(Math.random()*this.levelInterval
				+ this.levelFloor):
			init_level;
		return new puzzle(this.gridSize, this.level, this.decoyCount);
	}
}
