/*
 * Check that all puzzle 2d arrays have dimensions consistent with expected
 */

var checkGridSize = function(puzz){
	var checkGridHelper = function(arr, size){
		if (!(arr.length == size)) return 0;
		var i;
		for(i = 0; i < arr.length; i++){
			if (!(arr[i].length == size)) return 0;
		}
		return 1;
	}
	return checkGridHelper(puzz.grid, puzz.gridSize) 
		&& checkGridHelper(puzz.clueGrid, puzz.gridSize);
}

/*
 * Check that the location of the puzzle target makes sense
 */
var checkTargetSanity = function(puzz){
	return (puzz.side >= 0)
		&& (puzz.side < 4)
		&& (puzz.index >= 0)
		&& (puzz.index < puzz.gridSize);
}

/*
 * Check that what the puzzle thinks the parameters are make sense
 */
var checkParameterSanity = function(puzz){
	return (puzz.decNum >= 0)
		&& (puzz.pathNum >= 0)
		&& (puzz.decNum < puzz.gridSize*puzz.gridSize)
		&& (puzz.pathNum < puzz.gridSize*puzz.gridSize)
		&& (puzz.level >= 0)
		&& (puzz.level <= 4);
}

/*
 * Check that the number of bumpers is consistent with constructor parameters
 *   as well as what the puzzle thinks they should be
 */
var checkNumBumpers = function(puzz, level, decoy=-1, path=-1){
	var i,j;
	var decCount = 0;
	var hiddenCount = 0;
	var totalCount = 0;
	if (decoy==-1) decoy = level+2;
	if (path==-1) path = level;
	for(i = 0; i < puzz.gridSize; i++){
		for(j = 0; j < puzz.gridSize; j++){
			if (!puzz.grid[i][j]) continue;
			var bump = puzz.grid[i][j];
			if (bump.decoy){
				decCount++;
			}
			else if (bump.hidden){
				hiddenCount++;
			}
			totalCount++;
		}
	}
	if (decCount != decoy)
		console.log("Observed decoy count mismatch");
	if (hiddenCount != level)
		console.log("Observed hidden count mismatch");
	if (totalCount != (level + path + decoy))
		console.log("Observed total count mismatch");
	if (decCount != puzz.decNum)
		console.log("Puzzle decoy count mismatch");
	if (level != puzz.level)
		console.log("Puzzle level disagreement");
	return (decCount == decoy)
		&& (hiddenCount == level)
		&& (totalCount == (level + path + decoy) )
		&& (decCount == puzz.decNum)
		&& (level == puzz.level);
}

var varREArray = ["[]","[XYZ]","[WXYZ]","[VWXYZ]","[UVWXYZ]"];

/*
 * Check that the number of clue cells that have mirrors is consistent
 *   with the level
 */ 
var checkClueConsistency = function(puzz){
	var i,j;
	var varRE = varREArray[puzz.level];
	var re = new RegExp("^" + varRE + "$"); 

	var clueHasMirrorCount = 0;
	var clueNoMirrorCount = 0;
	for(i = 0; i < puzz.gridSize; i++){
		for(j = 0; j < puzz.gridSize; j++){
			if (!puzz.clueGrid[i][j]) continue;
			if (puzz.grid[i][j]) clueHasMirrorCount++;
			else clueNoMirrorCount++;

			if (!re.test(puzz.clueGrid[i][j])){
				console.log("Clue " + puzz.clueGrid[i][j] 
					+ " does not match regex " + varRE);
				return false;
			}
		}
	}
	var expectNoMirror = (puzz.level == 0)? 0:2;
	if (clueHasMirrorCount != puzz.level)
		console.log("Mismatch between clues with mirrors and level");
	if (clueNoMirrorCount != expectNoMirror)
		console.log("Mismatch between clues without mirrors:" + clueNoMirrorCount);
	return (clueHasMirrorCount == puzz.level)
		&& (clueNoMirrorCount == expectNoMirror);
}


/*
 * Check that clues follow the expected format
 */
var checkClueFormat = function(puzz){
	var varRE = varREArray[puzz.level];
	var re1 = new RegExp("^If REV is in " + varRE 
				+ ", then CONS is in " + varRE + "$");
	var re2 = new RegExp("^If REV is not in " + varRE
				+ ", then CONS is in " + varRE + "$");
	var re3 = new RegExp("^If CONS is in " + varRE
				+ ", then CONS is in " + varRE
				+ " and REV is in " + varRE + "$");
	var re4 = new RegExp("^If CONS is not in " + varRE
				+ ", then REV is in " + varRE + "$");
	var re5 = new RegExp("^If CONS is in " + varRE 
				+ ", then REV is in " + varRE
				+ " and CONS is in " + varRE + "$");
	var re6 = new RegExp("^If CONS is not in " + varRE
				+ ", then CONS is in " + varRE + "$");
	var re7 = new RegExp("^If REV is in " + varRE
				+ ", then CONS is in " + varRE
				+ " and REV is in " + varRE + "$");
	var re8 = new RegExp("^If REV is not in " + varRE
				+ ", then CONS is in " + varRE + " $");
	var reNum = new RegExp("^There are " + puzz.level + " hidden mirrors$");
	var reArr = [re1, re2, re3, re4, re5, re6, re7, re8];
	var countArr = [0,0,0,0,0,0,0,0];
	var numCount = 0;
	var i,j;
	for(i = 0; i < puzz.clues.length; i++){
		for(j = 0; j < reArr.length; j++){
			if (reArr[j].test(puzz.clues[i])) countArr[j]++;
		}
		if (reNum.test(puzz.clues[i])) numCount++;
	}
	for(i = 0; i < 2*puzz.level; i++){
		if (countArr[i] != 1){
			console.log("re" + (i+1) + " matched "
				+ countArr[i] + " times, expected 1");
			return false;
		}
	}
	for(i = 2*puzz.level; i < 8; i++){
		if (countArr[i] != 0){
			console.log("re" + (i+1) + " matched "
				+ countArr[i] + " times, expected 0");
			return false;
		}
	}
	if (numCount != 1){
		console.log("Found strange number of hidden mirror clues: " + numCount); 
		return false;
	}
	return true;
}
