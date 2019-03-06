const	app = require('http').createServer(handler)
const	io = require('socket.io')(app);
const	hostname = '0.0.0.0';
const	port = 3000;
const	url = require('url');
const	fs = require('fs');
const	Player = require('./player.js');
const	Tetromino = require('./tetromino.js');
const	Game = require('./game.js');
var		list_of_games = [];

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
		fs.readFile(__dirname + '/../../index.html', null, function(error, data)
			{
				if (error)
				{
					res.writeHead(404);
					res.write('File not found!');
				}
				else
				{
					res.write(data,  {'Content-Type': 'text/javascript'});
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
			socket.emit('mode', {
				type: 'solo',
				meta: { name: undefined }
			});
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
				socket.emit('mode', {
					type: 'multi',
					meta: { name: game.player1.name }
				});
				game.player1.socket.emit('mode', {
					type: 'multi',
					meta: { name: game.player2.name }
				});
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
		actual_game.running = false;
	});

	socket.on('new_tetrimino', function(spectre, malus) {
		if (malus > 0) {
			send_data_to_ennemy('malus', malus);
		}
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
			if (actual_game.player1)
				actual_game.player1.socket.emit('mode', {
					type: 'solo',
					meta: { name: undefined }
				});
		}
		console.log(`user disconnected ${socket.id}`);
	});
});
