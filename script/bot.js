(function () {
/**
 * @desc: functions for bot/computer player
 * 
 * @author: Vishal Kumar
 * E-mail: vishal.rgiit@gmail.com
 * Github: vishalok12
 */

var Bot = {};

Bot.takeTurn = function() {
	// first check for the squares which has 3 sides drawn and if present, draw it
	// if the graph has more than one such squares, you don't have to bother which
	// to draw first as you can fill both and it doesn't depend on order of filling
	var blockGraph = vApp.blockGraph;
	var lastTurn = vApp.lastTurn;
	var block, likelyBlocks;
	var edge;

	if (lastTurn) {
		// check the blocks which will be affected due to the line drawn by the user
		// as there is only chance to make the block complete
		likelyBlocks = blockGraph.getNeighbourBlocks(lastTurn.sourceIndex, lastTurn.destIndex);
		do {
			block = likelyBlocks.pop();
			if (block.get('selected') === 3) {	// only one edge left to select
				edge = blockGraph.unselectedEdges(block)[0];	// as there will be only one non-selected edge
				blockGraph.addToBlockData(edge.sourceIndex, edge.destIndex);
				likelyBlocks = likelyBlocks.concat(
					// next likely blocks
					blockGraph.getNeighbourBlocks(edge.sourceIndex, edge.destIndex)
				);
				// remove the current block, as it is already acquired
				likelyBlocks.splice(likelyBlocks.indexOf(block), 1);
			}
		}while (likelyBlocks.length > 0);

		// search for an unselected edge which belongs a block with 0/1 selected edges
	}
	// var sides = blockGraph.sidesInBlock(3, 3);

	// sides.map(function(side) {
	// 	blockGraph.addToBlockData(side.sourceIndex, side.destIndex);
	// });

}

window.vBot = Bot;

})();
