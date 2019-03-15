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

import {create_room, game_already_running, new_mode, create_info, get_game, get_next_tetriminos, reset_game, ennemy_socket, remove_game, start_game } from './server_functions';

app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

const handler = (req, res) => {
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
	return res;
}

io.on('connection', function(socket){

	var	actual_game = undefined;

	console.log(`a user connected ${socket.id}`);
	
	socket.on('info', function(room, player){
		const game = get_game(room, list_of_games);
		const info = create_info(socket, room, player, game, actual_game, list_of_games);

		actual_game = info.ag;
		socket.emit('info_response', info.ir);
		if (info.mode1)
			actual_game.player1.socket.emit('mode', info.mode1);
		if (info.mode2)
			actual_game.player2.socket.emit('mode', info.mode2);
		console.log(list_of_games);
	});

	socket.on('dead', function() {
		const ennemy = ennemy_socket(actual_game, socket);

		if (ennemy)
			ennemy.emit('won');
		reset_game(actual_game);
	});

	socket.on('new_tetrimino', function(spectre, malus) {
		if (malus > 0)
		{
			const ennemy = ennemy_socket(actual_game, socket);
			if (ennemy)
				ennemy.emit('malus', malus);
		}
		const ennemy = ennemy_socket(actual_game, socket);
		if (ennemy)
			ennemy.emit('spectre', spectre);
		if (actual_game && actual_game.running)
		{
			const tetriminos = get_next_tetriminos(actual_game, socket);

			socket.emit('tetrimino', tetriminos.actual, tetriminos.next);
		}
	});

	socket.on('start', function() {
		//secure for p1 only?
		if (actual_game && !actual_game.running)
		{
			start_game(actual_game);
			if (actual_game.player1.socket.id === socket.id && actual_game.player2)
				actual_game.player2.socket.emit('start');
		}
	});

	socket.on('disconnect', function() {
		if (actual_game)
		{
			if (actual_game.player2 === undefined)
				list_of_games = remove_game(list_of_games, actual_game);
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
				actual_game.player1.socket.emit('mode', new_mode('solo', undefined));
		}
		console.log(`user disconnected ${socket.id}`);
	});
});
