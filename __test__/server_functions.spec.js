import * as serverFunction from '../src/server/server_functions'
import	Game from '../src/server/game';
import	Player from '../src/server/player';
import	Tetromino from '../src/server/tetromino';

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

describe('Server Functions', () => {
	test('create room', () => {
		expect(serverFunction.create_room('socket', 'room', 'player', [])).toEqual(
			{
				ag: new Game('room', new Player('socket', 'player')),
				ir: 'host',
				mode1: serverFunction.new_mode('solo', undefined),
				mode2: undefined,
				meta: {name: undefined}
			});
	});

	test('game already running', () => {
		expect(serverFunction.game_already_running({name: 'game'})).toEqual(
			{ ag: {name: 'game'}, ir: 'started', mode1: undefined, mode2: undefined,
			meta: {name: 'game'}}) });

	test('new_mode', () => {
		expect(serverFunction.new_mode('mode', 'name'))
			.toEqual({type: 'mode', meta: {name: 'name'}});
	});

	test('player2_info', () => {
		const game = {player1: {name: 'p1'}, player2: undefined};

		expect(serverFunction.player2_info('socket', 'room', 'p1', game))
			.toEqual({ag: undefined, ir: 'name', mode1: undefined, mode2: undefined,
			meta: {name: 'p1'}});

		expect(serverFunction.player2_info('socket', 'room', 'p2', game))
			.toEqual(
				{
					ag: game,
					ir: 'player2',
					mode1: serverFunction.new_mode('multi', game.player2.name),
					mode2: serverFunction.new_mode('multi', game.player1.name),
					meta: {name: undefined}
				});
	});

	test('create_info', () => {
		const game = {player1: {name: 'p1'}, player2: undefined};
		const game_full = {player1: {name: 'p1'}, player2: {name: 'p2'}};

		expect(serverFunction.create_info('socket', 'room', 'player', undefined, 'actual_game', []))
			.toEqual(serverFunction.create_room('socket', 'room', 'player', []));

		expect(serverFunction.create_info('socket', 'room', 'player', {running: true}, 'actual_game', []))
			.toEqual(serverFunction.game_already_running('actual_game'));

		expect(serverFunction.create_info('socket', 'room', 'player', game, 'actual_game', []))
			.toEqual(serverFunction.player2_info('socket', 'room', 'player', game));

		expect(serverFunction.create_info('socket', 'room', 'player', game_full, 'actual_game', []))
			.toEqual({ag: undefined, ir: 'full', mode1: undefined, mode2: undefined,
			meta: {name: 'room'}});
	});

	test('get game', () => {
		const game_list = [];

		serverFunction.create_room('socket', 'room1', 'player', game_list);
		serverFunction.create_room('socket', 'room2', 'player', game_list);
		serverFunction.create_room('socket', 'room3', 'player', game_list);
		serverFunction.create_room('socket', 'room4', 'player', game_list);
		expect(serverFunction.get_game('room3', game_list)).toEqual(new Game('room3', new Player('socket', 'player')));
		expect(serverFunction.get_game('room5', game_list)).toEqual(undefined);
	});

	test('get_next_tetriminos', () => {
		const actual_game = new Game('room', new Player('socket', 'player'));

		serverFunction.player2_info('socket2', 'room', 'player2', actual_game);		
		expect(actual_game.player1.pos).toBe(0);
		expect(actual_game.player2.pos).toBe(0);
		expect(actual_game.list_of_tetrominoes.length).toBe(1);
		expect(serverFunction.get_next_tetriminos(actual_game, 'socket'))
			.toEqual({actual: new Tetromino(),next: new Tetromino()});
		expect(serverFunction.get_next_tetriminos(actual_game, 'socket2'))
			.toEqual({actual: new Tetromino(),next: new Tetromino()});
		expect(serverFunction.get_next_tetriminos(actual_game, 'socket2'))
			.toEqual({actual: new Tetromino(),next: new Tetromino()});
		expect(actual_game.player1.pos).toBe(1);
		expect(actual_game.player2.pos).toBe(2);
		expect(actual_game.list_of_tetrominoes.length).toBe(3);
	});

	test('start game', () => {
		const game = new Game('room', new Player('socket', 'player'));
		const started_game = new Game('room', new Player('socket', 'player'));

		started_game.running = true;
		expect(serverFunction.start_game(game)).toEqual(started_game);
	});

	test('reset game', () => {
		const game = new Game('room', new Player('socket', 'player'));
		const default_game = new Game('room', new Player('socket', 'player'));

		serverFunction.get_next_tetriminos(game, 'socket');
		serverFunction.get_next_tetriminos(game, 'socket');
		expect(serverFunction.reset_game(game)).toEqual(default_game);
		
		serverFunction.player2_info('socket2', 'room', 'player2', game);		
		serverFunction.player2_info('socket2', 'room', 'player2', default_game);		
		serverFunction.get_next_tetriminos(game, 'socket');
		serverFunction.get_next_tetriminos(game, 'socket2');
		serverFunction.get_next_tetriminos(game, 'socket');
		expect(serverFunction.reset_game(game)).toEqual(default_game);
	});

	test('ennemy socket', () => {
		const game = new Game('room', new Player('socket', 'player'));

		expect(serverFunction.ennemy_socket(undefined, 'socket')).toBe(undefined);
		expect(serverFunction.ennemy_socket(game, 'socket')).toBe(undefined);
		serverFunction.start_game(game);
		expect(serverFunction.ennemy_socket(game, 'socket')).toBe(undefined);
		serverFunction.player2_info('socket2', 'room', 'player2', game);		
		expect(serverFunction.ennemy_socket(game, 'socket')).toBe('socket2');
		expect(serverFunction.ennemy_socket(game, 'socket2')).toBe('socket');
	});

	test('remove game', () => {
		var game_list = [];

		serverFunction.create_info('socket', 'room1', 'player', undefined, undefined, game_list);
		serverFunction.create_info('socket', 'room2', 'player', undefined, undefined, game_list);
		serverFunction.create_info('socket', 'room3', 'player', undefined, undefined, game_list);
		serverFunction.create_info('socket', 'room4', 'player', undefined, undefined, game_list);
		expect(serverFunction.get_game('room3', serverFunction.remove_game(game_list, new Game('room3', new Player('socket3', 'player3'))))).toBe(undefined);

	});

});
