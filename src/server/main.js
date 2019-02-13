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

class	Tetromino
{
	constructor()
	{
		this.shape = Math.floor(Math.random() * Math.floor(7));
		this.x = Math.floor(Math.random() * Math.floor(10));
	}
}

class	Game
{
	constructor(name, player1)
	{
		this.name = name;
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
	var	pos = 0;

	console.log(`a user connected ${socket.id}`);
	socket.on('info', function(room, player){

		var game = list_of_games.find((game) => {return game.name === room});

		if (game === undefined)
		{
			actual_game = new Game(room, new Player(socket, player));
			list_of_games.push(actual_game);
			socket.emit('info_response', 'host');
		}
		else if (game.player2 === undefined)
		{
			game.player1.socket.emit('datatest', 'player2 to player1');
			if (game.player1.name === player)
			{
				socket.emit('info_response', 'name');
				console.log('error name already taken for this room');
			}
			else
			{
				actual_game = game;
				game.player2 = new Player(socket, player);
				socket.emit('info_response', 'scnd');
			}
		}
		else
		{
			socket.emit('info_response', 'full');
			console.log('full');
		}
		console.log(list_of_games);
		//	socket.emit('datatest', list_of_games); //error on socket object
	});

	function send_tetrimino()
	{
		if (pos + 1 == actual_game.list_of_tetrominoes.length)
			actual_game.list_of_tetrominoes.push(new Tetromino());
		socket.emit('tetrimino', actual_game.list_of_tetrominoes[pos],
			actual_game.list_of_tetrominoes[pos + 1]);
		++pos;
	};

	socket.on('start', function(){
		if (actual_game.player1.id === socket.id && actual_game.player2)
			actual_game.player2.emit('start');
		send_tetrimino();
	});

	socket.on('disconnect', function(){
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
			}
		}
		console.log(`user disconnected ${socket.id}`);
	});
});
