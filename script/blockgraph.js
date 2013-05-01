(function () {
/**
 * desc: functions for square blocks created by neighbouring dots
 * @author: Vishal Kumar
 * E-mail: vishal.rgiit@gmail.com
 * Github: vishalok12
 */

function BlockGraph(dotMap) {
	var i, j;
	var blocks = [];
	var upperLayerLength, lowerLayerLength;
	for (i = 0; i < dotMap.length - 1; i++) {
		var upLayerLength = dotMap[i].length;
		var downLayerLength = dotMap[i+1].length;
		blocks[i] = [];

		for (j = 0; j < Math.min(upLayerLength, downLayerLength) - 1; j++) {
			blocks[i][j] = new Block(i, j);
		}
	}
	this.blocks = blocks;
}

function Block(i, j) {
	var attr = {};
	attr.top = null;
	attr.bottom = null;
	attr.left = null;
	attr.right = null;
	attr.selected = 0;
	this._attr = attr;
	this._row = i;
	this._column = j;
}

Block.prototype.get = function(attr) {
	if (this._attr.hasOwnProperty(attr)) {
		return this._attr[attr];
	}
};

Block.prototype.set = function(attr, value) {
	if (this._attr.hasOwnProperty(attr)) {
		this._attr[attr] = value;
		this._attr.selected += 1;
	}
};

Block.prototype.acquired = function() {
	if (this.get('selected') === 4) {
		return true;
	}

	return false;
}

BlockGraph.prototype.isEdgeSelected = function(row1, coln1, row2, coln2) {
	if (typeof row1 === 'object') {
		var sourceIndex = row1;
		var destIndex = coln1;
		row1 = sourceIndex.row;
		coln1 = sourceIndex.column;
		row2 = destIndex.row;
		coln2 = destIndex.column;
	}
	var minRow = Math.min(row1, row2);
	var minColn = Math.min(coln1, coln2);
	var blocks = this.blocks;

	if (minRow < blocks.length) {
		var blocksRow = blocks[minRow];
		if (minColn < blocksRow.length) {
			if (row1 - row2) {
				return blocks[minRow][minColn].get('left');
			} else {
				return blocks[minRow][minColn].get('top');
			}
		} else {
			return blocks[minRow][minColn - 1].get('right');
		}
	} else {
		return blocks[minRow - 1][minColn].get('bottom');
	}
};

BlockGraph.prototype.addToBlockData = function(sourceIndex, destIndex) {
	var row, column;
	var blocks = this.blocks;
	var block1Selection = false;
	var block2Selection = false;

	if (sourceIndex.row === destIndex.row) {
		row = sourceIndex.row;
		column = Math.min(sourceIndex.column, destIndex.column);
		if (row < blocks.length) {
			blocks[row][column].set('top', 1);
			block1Selection = blocks[row][column].acquired();
		}
		if (row > 0) {
			blocks[row - 1][column].set('bottom', 1);
			block2Selection = blocks[row - 1][column].acquired();
		}
	} else if (sourceIndex.column === destIndex.column) {
		row = Math.min(sourceIndex.row, destIndex.row);
		column = sourceIndex.column;
		if (column < blocks[row].length) {
			blocks[row][column].set('left', 1);
			block1Selection = blocks[row][column].acquired();
		}
		if (column > 0) {
			blocks[row][column - 1].set('right', 1);
			block2Selection = blocks[row][column - 1].acquired();
		}
	}

	// log the last turn
	vApp.lastTurn = {
		sourceIndex: sourceIndex,
		destIndex: destIndex
	}

	return block1Selection || block2Selection;
};

BlockGraph.prototype.getNeighbourBlocks = function(dotIndex1, dotIndex2) {
	var nBlocks = [];
	var blocks = this.blocks;
	var minRow = Math.min(dotIndex1.row, dotIndex2.row);
	var minColn = Math.min(dotIndex1.column, dotIndex2.column);

	if (minRow < blocks.length && minColn < blocks[minRow].length) {
		nBlocks.push(blocks[minRow][minColn]);
	}
	if (dotIndex1.row === dotIndex2.row &&					// rows of the two dots are same
			minRow > 0)	{
		nBlocks.push(blocks[minRow - 1][minColn]);
	} else if (dotIndex1.column === dotIndex2.column &&	// columns of the two dots are same
			minColn > 0) {
		nBlocks.push(blocks[minRow][minColn - 1]);
	}

	return nBlocks;
};

BlockGraph.prototype.unselectedEdges = function(block) {
	var edges = [];
	// get all the edges with the value null
	if (block.get('top') === null) {
		edges.push({
			sourceIndex: {row: block._row, column: block._column},
			destIndex: {row: block._row, column: block._column + 1}
		});
	}
	if (block.get('bottom') === null) {
		edges.push({
			sourceIndex: {row: block._row + 1, column: block._column},
			destIndex: {row: block._row + 1, column: block._column + 1}
		});
	}
	if (block.get('left') === null) {
		edges.push({
			sourceIndex: {row: block._row, column: block._column},
			destIndex: {row: block._row + 1, column: block._column}
		});
	}
	if (block.get('right') === null) {
		edges.push({
			sourceIndex: {row: block._row, column: block._column + 1},
			destIndex: {row: block._row + 1, column: block._column + 1}
		});
	}
	return edges;
}

BlockGraph.prototype.sidesInBlock = function(minDrawnSides, maxDrawnSides) {
	var blocks = this.blocks;
	var row, column;
	var blocksRow, block;
	var drawnSidesCount;
	var acceptedSides = [];

	for (row = 0; row < blocks.length; row++) {
		blocksRow = blocks[row];
		
		for (column = 0; column < blocksRow.length; column++) {
			block = blocksRow[column];
			drawnSidesCount = block.get('selected');
			
			if (drawnSidesCount <= maxDrawnSides && drawnSidesCount >= minDrawnSides) {
				acceptedBlocks.push(block);
			}
		}
	}
	return acceptedSides;
};

window.vBlockGraph = BlockGraph;

})();
