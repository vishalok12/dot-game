(function () {
/**
 * desc: functions for square blocks created by neighbouring dots
 * @author: Vishal Kumar
 * E-mail: vishal.rgiit@gmail.com
 * Github: vishalok12
 */
var BlockGraph = {};

BlockGraph.getBlocks = function(dotMap) {
	var i, j;
	var blocks = [];
	var upperLayerLength, lowerLayerLength;
	for (i = 0; i < dotMap.length - 1; i++) {
		var upLayerLength = dotMap[i].length;
		var downLayerLength = dotMap[i+1].length;
		blocks[i] = [];

		for (j = 0; j < Math.min(upLayerLength, downLayerLength) - 1; j++) {
			blocks[i][j] = {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				selected: false
			}
		}
	}
	return blocks;
};

BlockGraph.isEdgeSelected = function(row1, coln1, row2, coln2) {
	var minRow = Math.min(row1, row2);
	var minColn = Math.min(coln1, coln2);
	var blocks = vApp.blocks;

	if (minRow < blocks.length) {
		var blocksRow = blocks[minRow];
		if (minColn < blocksRow.length) {
			if (row1 - row2) {
				return blocks[minRow][minColn].left;
			} else {
				return blocks[minRow][minColn].top;
			}
		} else {
			return blocks[minRow][minColn - 1].right;
		}
	} else {
		return blocks[minRow - 1][minColn].bottom;
	}
};

BlockGraph.addToBlockData = function(sourceIndex, destIndex) {
	var row, column;
	var blocks = vApp.blocks;
	var block1Selection = false;
	var block2Selection = false;

	if (sourceIndex.row === destIndex.row) {
		row = sourceIndex.row;
		column = Math.min(sourceIndex.column, destIndex.column);
		if (row < blocks.length) {
			blocks[row][column].top = 1;
			block1Selection = acquiredBlock(blocks, row, column);
			if (block1Selection) { blocks[row][column].selected = true; }
		}
		if (row > 0) {
			blocks[row - 1][column].bottom = 1;
			block2Selection = acquiredBlock(blocks, row - 1, column);
			if (block2Selection) { blocks[row - 1][column].selected = true; }
		}
	} else if (sourceIndex.column === destIndex.column) {
		row = Math.min(sourceIndex.row, destIndex.row);
		column = sourceIndex.column;
		if (column < blocks[row].length) {
			blocks[row][column].left = 1;
			block1Selection = acquiredBlock(blocks, row, column);
			if (block2Selection) { blocks[row][column].selected = true; }
		}
		if (column > 0) {
			blocks[row][column - 1].right = 1;
			block2Selection = acquiredBlock(blocks, row, column - 1);
			if (block2Selection) { blocks[row][column - 1].selected = true; }
		}
	}

	return block1Selection || block2Selection;
}

function acquiredBlock(blocks, row, column) {
	var block = blocks[row][column];
	if (block.top && block.bottom && block.left && block.right) {
		return true;
	}

	return false;
}

window.vBlockGraph = BlockGraph;

})();