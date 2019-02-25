const tetriminos_list = [
	[{x:1, y:1}, {x:1, y:2}, {x:2, y:1}, {x:2, y:2}],	// square
	[{x:1, y:2}, {x:2, y:1}, {x:2, y:2}, {x:3, y:1}],	// S
	[{x:1, y:1}, {x:2, y:1}, {x:2, y:2}, {x:3, y:2}],	// Z
	[{x:1, y:0}, {x:1, y:1}, {x:1, y:2}, {x:2, y:2}],	// L
	[{x:1, y:2}, {x:2, y:0}, {x:2, y:1}, {x:2, y:2}],	// ^L
	[{x:0, y:1}, {x:1, y:0}, {x:1, y:1}, {x:2, y:1}],	// T
	[{x:1, y:0}, {x:1, y:1}, {x:1, y:2}, {x:1, y:3}] ];	// line
/*
const tetriminos_list = [
	[{x:0, y:0}, {x:0, y:1}, {x:1, y:0}, {x:1, y:1}],	// square
	[{x:0, y:1}, {x:1, y:0}, {x:1, y:1}, {x:2, y:0}],	// S
	[{x:0, y:0}, {x:1, y:0}, {x:1, y:1}, {x:2, y:1}],	// Z
	[{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:1, y:2}],	// L
	[{x:0, y:2}, {x:1, y:0}, {x:1, y:1}, {x:1, y:2}],	// ^L
	[{x:0, y:1}, {x:1, y:0}, {x:1, y:1}, {x:2, y:1}],	// T
	[{x:1, y:0}, {x:1, y:1}, {x:1, y:2}, {x:1, y:3}] ];	// line

const tetriminos_len = [2,3,3,3,3,3,4];
*/

const color = ['yellow', 'green', 'red', 'cyan', 'orange', 'blue', 'violet'];

class	Tetromino
{
	constructor()
	{
		var i = Math.floor(Math.random() * Math.floor(7));

		this.shape = tetriminos_list[i];
		this.color = color[i];
		this.x = Math.floor(Math.random() * Math.floor(10));
	}
}

module.exports = Tetromino;
