const	Tetromino = require('./tetromino.js');

class	Game
{
	constructor(name, player1)
	{
		this.name = name;
		this.running = false;
		this.player1 = player1;
		this.player2 = undefined;
		this.list_of_tetrominoes = [new Tetromino()];
	}
}

module.exports = Game;
