const tetriminos_list = [
	[{x:0, y:0}, {x:0, y:1}, {x:1, y:0}, {x:1, y:1}],	// square
	[{x:0, y:1}, {x:1, y:0}, {x:1, y:1}, {x:2, y:0}],	// S
	[{x:0, y:0}, {x:1, y:0}, {x:1, y:1}, {x:2, y:1}],	// Z
	[{x:1, y:0}, {x:1, y:1}, {x:1, y:2}, {x:2, y:2}],	// L
	[{x:0, y:2}, {x:1, y:0}, {x:1, y:1}, {x:1, y:2}],	// ^L
	[{x:0, y:1}, {x:1, y:0}, {x:1, y:1}, {x:2, y:1}],	// T
	[{x:1, y:0}, {x:1, y:1}, {x:1, y:2}, {x:1, y:3}] ];	// line

const tetriminos_len = [2,3,3,3,3,3,4];

const color = ['yellow', 'green', 'red', 'cyan', 'orange', 'blue', 'violet'];

class	Tetromino
{
	constructor()
	{
		var i = Math.floor(Math.random() * Math.floor(7));

		this.shape = tetriminos_list[i];
		this.color = color[i];
		this.len = tetriminos_len[i];
		this.pos = {x: Math.floor(Math.random() * Math.floor(7)), y: (tetriminos_len[i] - 1) * -1};
	}
}

module.exports = Tetromino;
