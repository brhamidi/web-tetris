const	Player = require('./player.js');
const	Game = require('./game.js');
const	Tetromino = require('./tetromino.js');
import {List} from 'immutable';

export const create_room = (socket, room, player, list) => {
	const actual_game = new Game(room, new Player(socket, player));
	list.push(actual_game);
	return { ag: actual_game,
		ir: 'host',
		mode1: new_mode('solo', undefined),
		mode2: undefined,
		meta: {name: undefined}
	};
};

export const game_already_running = (actual_game) => {
	return {ag: actual_game, ir: 'started', mode1: undefined, mode2: undefined,
	meta: {name: actual_game.name}};
};

export const new_mode = (mode, name) => {
	return { type: mode, meta: { name: name } };
};

export const player2_info = (socket, room, player, game) => {
	if (game.player1.name === player)
		return {ag: undefined, ir: 'name', mode1: undefined, mode2: undefined,
		meta: {name: player}};
	else
	{
		game.player2 = new Player(socket, player);
		return {
			ag: game,
			ir: 'player2',
			mode1: new_mode('multi', game.player2.name),
			mode2: new_mode('multi', game.player1.name),
			meta: {name: undefined}
		};
	}
};

export const create_info = (socket, room, player, game, actual_game, list) => {
	if (game === undefined)
		return create_room(socket, room, player, list);
	else if (game.running)
		return game_already_running(actual_game);
	else if (game.player2 === undefined)
		return player2_info(socket, room, player, game);
	else
		return {ag: undefined, ir: 'full', mode1: undefined, mode2: undefined,
			meta: {name: room}
		};
};

export const get_game = (room, list) => {
	return list.find((game) => {return game.name === room});
};

export const get_next_tetriminos = (actual_game, socket) => {
	const player = actual_game.player1.socket === socket ?
		actual_game.player1 : actual_game.player2;

	if (player.pos + 1 == actual_game.list_of_tetrominoes.length)
		actual_game.list_of_tetrominoes.push(new Tetromino());
	++(player.pos);
	return {actual: actual_game.list_of_tetrominoes[player.pos - 1], next: actual_game.list_of_tetrominoes[player.pos]};
};

export const start_game = (game) => {
	game.running = true;
	return game;
};

export const reset_game = (game) => {
	game.running = false;
	game.player1.pos = 0;
	game.list_of_tetrominoes = [new Tetromino()];
	if (game.player2 != undefined)
		game.player2.pos = 0;
	return game;
};

export const ennemy_socket = (actual_game, socket) => {
	if (actual_game && actual_game.running)
	{
		if (actual_game.player2)
		{
			if (actual_game.player2.socket === socket)
				return actual_game.player1.socket;
			else
				return actual_game.player2.socket;
		}
	}
	return undefined;
};

export const remove_game = (list, actual_game) =>
{
	return list.filter((game) => {
		return game.name !== actual_game.name});
};

export const get_games_info = (list) =>
{
	return list.reduce((acc, curr) => {
		return acc.push(curr.player2 != undefined ?
			{
				game: curr.name,
				player1: curr.player1.name,
				player2: curr.player2.name
			} :
			{
				game: curr.name,
				player1: curr.player1.name,
				player2: undefined
			});
	}, List());
};
