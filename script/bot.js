(function () {
/**
 * @desc: functions for bot/computer player
 * 
 * @author: Vishal Kumar
 * E-mail: vishal.rgiit@gmail.com
 * Github: vishalok12
 */

var Bot = {};

/* @type {Boolean} */
// indicates there are un-selected edges left which will not give chance to 
// opponent to make a block
var safeEdgesLeft = true;

/* @type {Number} */
var score = 0;

Bot.takeTurn = function() {
	// first check for the squares which has 3 sides drawn and if present, draw it
	// if the graph has more than one such squares, you don't have to bother which
	// to draw first as you can fill both and it doesn't depend on order of filling
	var blockGraph = vApp.blockGraph;
	var lastTurn = vApp.lastTurn;
	var block, likelyBlocks, nBlocks;
	var edges, edge;

	// if (lastTurn) {
	// 	// check the blocks which will be affected due to the line drawn by the user
	// 	// as there is only chance to make the block complete
	// 	likelyBlocks = blockGraph.getNeighbourBlocks(lastTurn.sourceIndex, lastTurn.destIndex);
	// 	do {
	// 		block = likelyBlocks.pop();
	// 		if (block.get('selected') === 3) {	// only one edge left to select
	// 			edge = blockGraph.unselectedEdges(block)[0];	// as there will be only one non-selected edge
	// 			blockGraph.addToBlockData(edge.sourceIndex, edge.destIndex);
	// 			likelyBlocks = likelyBlocks.concat(
	// 				// next likely blocks
	// 				blockGraph.getNeighbourBlocks(edge.sourceIndex, edge.destIndex)
	// 			);
	// 			// remove the current block, as it is already acquired
	// 			likelyBlocks.splice(likelyBlocks.indexOf(block), 1);
	// 		}
	// 	}while (likelyBlocks.length > 0);

	// }
	likelyBlocks = _.flatten(blockGraph.blocks).filter(function(block) {
		return block.get('selected') === 3;
	});

	while(likelyBlocks.length) {
		block = likelyBlocks.pop();
		// check if the block is not acquired
		edges = blockGraph.unselectedEdges(block);
		if (edges.length) {
			edge = edges[0]; // as there must be only one unselected edge
			score += blockGraph.addToBlockData(edge.sourceIndex, edge.destIndex);
			// get the blocks which contains edge and are not acquired
			nBlocks = blockGraph.getNeighbourBlocks(
				edge.sourceIndex, 
				edge.destIndex, 
				{acquired: false}
			);
			nBlocks = nBlocks.filter(function(block) {
				return block.get('selected') === 3;
			});
			if (nBlocks.length > 0) {
				likelyBlocks = likelyBlocks.concat(nBlocks);
			}
		}
	}

	if (safeEdgesLeft) {
		// search for an unselected edge which belongs a block with 0/1 selected edges
		edges = blockGraph.sidesInBlock(0, 1);
		if (!edges.length) {
			safeEdgesLeft = false;
			edges = blockGraph.sidesInBlock(2, 2);
		}
	} else {
		// search for an unselected edge which belongs a block with 2 selected edges
		edges = blockGraph.sidesInBlock(2, 2);
	}

	if (edges.length) {
		// select an edge to make a turn
		edge = intelligentMove(edges);
		blockGraph.addToBlockData(edge.sourceIndex, edge.destIndex);
		vApp.currentUser = 'user';
	} else {
		console.log('Game Over!');

	}

	// sides.map(function(side) {
	// 	blockGraph.addToBlockData(side.sourceIndex, side.destIndex);
	// });
 
}

Bot.getScore = function() {
	return score;
}

// Private Functions

function intelligentMove(edges) {
	var blockGraph = vApp.blockGraph;
	if (safeEdgesLeft || vApp.gameLevel === 'medium') {
		var randomIndex = ~~(Math.random() * edges.length);
		return edges[randomIndex];
	} else if (vApp.gameLevel === 'hard') {
		var possibleBlocks, possibleBlock, block;
		var edge, startEdge, selectedEdges;
		var moves = [];
		var unselectedBlockEdges;
		var virtualSelectedLength, notSelected;

		while (edges.length) {
			startEdge = edge = edges.shift();
			selectedEdges = [edge];
			acquiredBlockCount = 0;
			possibleBlocks = blockGraph.getNeighbourBlocks(edge.sourceIndex, edge.destIndex);
			while (possibleBlocks.length) {
				block = possibleBlocks.pop();
				unselectedBlockEdges = blockGraph.unselectedEdges(block);
				notSelected = unselectedBlockEdges.filter(function(edge) {
					return !selectedEdges.some(function(selectedEdge) {
						return _.isEqual(selectedEdge, edge);
					});
				});
				virtualSelectedLength = unselectedBlockEdges.length - notSelected.length;
				if (block.get('selected') + virtualSelectedLength >= 3) {
					acquiredBlockCount ++;
					if (notSelected.length) {
						edge = notSelected[0];
						edges = _.subtractObj(edges, edge);
						selectedEdges.push(edge);
						possibleBlock = blockGraph.getNeighbourBlocks(
							edge.sourceIndex,
							edge.destIndex, 
							{ otherThan: block }
						)[0];
						if (possibleBlock && _.indexOf(possibleBlocks, possibleBlock) === -1) {
							possibleBlocks.push(possibleBlock);
						}
					}
				}
			}

			moves.push({edge: startEdge, count: acquiredBlockCount});
		}
		console.log(moves);
		return _.min(moves, function(move) { return move.count}).edge;
	}
}

window.vBot = Bot;

})();
