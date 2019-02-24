const	app = require('http').createServer(handler)
const	io = require('socket.io')(app);
const	hostname = '127.0.0.1';
const	port = 3000;
const	url = require('url');
const	fs = require('fs');
var		list_of_games = [];

class	Player
{
	constructor(socket, name)
	{
		this.socket = socket;
		this.name = name;
	}
}

/*
const tetriminos_list = [
	[{x:0, y:1}, {x:0, y:2}, {x:1, y:1}, {x:1, y:2}],	// square
	[{x:0, y:2}, {x:1, y:1}, {x:1, y:2}, {x:2, y:1}],	// S
	[{x:0, y:1}, {x:1, y:1}, {x:1, y:2}, {x:2, y:2}],	// Z
	[{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:1, y:2}],	// L
	[{x:0, y:2}, {x:1, y:0}, {x:1, y:1}, {x:1, y:2}],	// ^L
	[{x:0, y:1}, {x:0, y:0}, {x:0, y:1}, {x:1, y:1}],	// T
	[{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}] ];	// line
	*/
const tetriminos_list = [
	[{x:0, y:0}, {x:0, y:1}, {x:1, y:0}, {x:1, y:1}],	// square
	[{x:0, y:1}, {x:1, y:0}, {x:1, y:1}, {x:2, y:0}],	// S
	[{x:0, y:0}, {x:1, y:0}, {x:1, y:1}, {x:2, y:1}],	// Z
	[{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:1, y:2}],	// L
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
				this.x = Math.floor(Math.random() * Math.floor(8));
				console.log(this.x + 1);
		}
}

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

app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});


function handler (req, res) {
	if (req.url != '/')
	{
		res.setHeader('Content-Type', 'text/plain');
		res.writeHead(404);
		res.write('404 File not found');
		res.end();
	}
	else
	{
		res.writeHead(200, {'Content-Type': 'text/html'});
		fs.readFile('./src/server/index.html', null, function(error, data)
			{
				if (error)
				{
					res.writeHead(404);
					res.write('File not found!');
				}
				else
				{
					res.write(data);
				}
				res.end();
			});
	}
}

io.on('connection', function(socket){

	var	actual_game = undefined;

	console.log(`a user connected ${socket.id}`);
	socket.on('info', function(room, player){

		var game = list_of_games.find((game) => {return game.name === room});

		if (game === undefined)
		{
			actual_game = new Game(room, new Player(socket, player));
			list_of_games.push(actual_game);
			socket.emit('info_response', 'host');
		}
		else if (game.running)
		{
			socket.emit('info_response', 'started');
			console.log('already started');
		}
		else if (game.player2 === undefined)
		{
			if (game.player1.name === player)
			{
				socket.emit('info_response', 'name');
				console.log('error name already taken for this room');
			}
			else
			{
				actual_game = game;
				game.player2 = new Player(socket, player);
				socket.emit('info_response', 'player2');
			}
		}
		else
		{
			socket.emit('info_response', 'full');
			console.log('full');
		}
		console.log(list_of_games);
	});

	var send_tetrimino = (function() {
		var	pos = 0;

		return function() {
			if (actual_game)
			{
				if (pos + 1 == actual_game.list_of_tetrominoes.length)
					actual_game.list_of_tetrominoes.push(new Tetromino());
				socket.emit('tetrimino', actual_game.list_of_tetrominoes[pos],
					actual_game.list_of_tetrominoes[pos + 1]);
				++pos;
			}
		};
	})();

	function send_data_to_ennemy(info, data)
	{
		console.log(info);
		if (actual_game && actual_game.running)
		{
			if (actual_game.player2)
			{
				if (actual_game.player2.socket === socket)
				{
					console.log("send to p1");
					actual_game.player1.socket.emit(info, data);
				}
				else
				{
					console.log("send to p2");
					actual_game.player2.socket.emit(info, data);
				}
			}
		}
	};

	socket.on('dead', function() {
		send_data_to_ennemy('won');
	});

	socket.on('new_tetrimino', function(spectre, malus) {
		send_data_to_ennemy('malus', malus);
		send_data_to_ennemy('spectre', spectre);
		if (actual_game && actual_game.running)
			send_tetrimino();
	});

	socket.on('start', function() {
		//secure for p1 only?
		if (actual_game && !actual_game.running)
		{
			actual_game.running = true;
			if (actual_game.player1.socket.id === socket.id && actual_game.player2)
				actual_game.player2.socket.emit('start');
		}
	});

	socket.on('disconnect', function() {
		if (actual_game)
		{
			if (actual_game.player2 === undefined)
			{
				list_of_games = list_of_games.filter((game) => {
					return game.name !== actual_game.name});
			}
			else if (socket === actual_game.player2.socket)
				actual_game.player2 = undefined;
			else
			{
				actual_game.player1 = actual_game.player2;
				actual_game.player2 = undefined;
				if (actual_game.player1)
					actual_game.player1.socket.emit('info_response', 'host');
			}
		}
		console.log(`user disconnected ${socket.id}`);
	});
});
