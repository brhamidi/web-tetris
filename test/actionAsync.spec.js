import { GameStatus } from '../src/client/actions';
import { emptyBoard as board } from '../src/client/reducers/board';
import { initialState as mode } from '../src/client/reducers/mode';
import { initialState as currentShape } from '../src/client/reducers/currentShape';
import { initialState as nextShape } from '../src/client/reducers/nextShape';
import { initialState as spectre } from '../src/client/reducers/spectre';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { List } from 'immutable';

import * as actions from '../src/client/actions';

const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');

const info = 'undefined';
const status = GameStatus.LOADING;

const score = 0;
let socket;
let httpServer;
let httpServerAddr;
let ioServer;
let middlewares;
let mockStore;
let store;

beforeAll((done) => {
	httpServer = http.createServer().listen(1337, '127.0.0.1');
	httpServerAddr = httpServer.listen().address();
	ioServer = ioBack(httpServer);
	middlewares = [thunk];
	mockStore = configureStore(middlewares);
	ioServer.on('connection', (socket) => {
		socket.on('info', (a, b) => {
			socket.emit('info_response', 'host');
			socket.emit('mode', 'mode');
		})
	})
	done();
});

afterAll((done) => {
	ioServer.close();
	httpServer.close();
	done();
});

beforeEach((done) => {
	socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
		'reconnection delay': 0,
		'reopen delay': 0,
		'force new connection': true,
		transports: ['websocket'],
	});
	socket.on('connect', () => {
		store = mockStore({
			mode,
			nextShape,
			spectre,
			info,
			status,
			board,
			currentShape,
			score
		})
		done();
	});
});

afterEach((done) => {
	if (socket.connected) {
		socket.disconnect();
	}
	done();
});

describe('Async action dispatch good action', () => {
	test('newTetrimino - Board filled', (done) => {
		const expectedActions = [
			actions.destroyLine(List.of(0, 1, 2, 3)),
			actions.updateScore(4),
			actions.setCurrShape(undefined)
		]

		const newBoard =
			List().set(19, undefined)
			.map(e => List()
				.set(9, undefined)
				.map(e => 'green')
			);
		const newShape = {
			pos: { x: 4, y: 0 },
			color: 'purple',
			shape: [
				{x: 0, y: 0},
				{x: 0, y: 1},
				{x: 0, y: 2},
				{x: 0, y: 3}
			],
			len: 4
		};
		store = mockStore(Object.assign({}, store.getState(), {
			currentShape: newShape,
			board: newBoard
		}));
		store.dispatch(actions.newTetrimino(socket));
		setTimeout(() => {
			expect(store.getActions()).toEqual(expectedActions);
			done();
		}, 100)
	})
	test('newTetrimino - Board empty', (done) => {
		const expectedActions = [
			actions.setCurrShape(undefined)
		]

		store.dispatch(actions.newTetrimino(socket));
		setTimeout(() => {
			expect(store.getActions()).toEqual(expectedActions);
			done();
		}, 100)
	})
	test('setInfo - Game is running', (done) => {
		const expectedActions = [
			actions.info('host'),
			actions.updateMode('mode')
		]

		store = mockStore(Object.assign({}, store.getState(), {status: GameStatus.RUNNING}));
		store.dispatch(actions.setInfo(socket, 'test', 'test'));
		setTimeout(() => {
			expect(store.getActions()).toEqual(expectedActions);
			done();
		}, 100)
	})
	test('setInfo - Game is Loading', (done) => {
		const expectedActions = [
			actions.info('host'),
			actions.setStatusGame(GameStatus.BEGINNING),
			actions.updateMode('mode')
		]

		store.dispatch(actions.setInfo(socket, 'test', 'test'));
		setTimeout(() => {
			expect(store.getActions()).toEqual(expectedActions);
			done();
		}, 100)
	})
	test('shapeShouldDown - can down', (done) => {
		const newBoard = List().set(19, undefined).map(e =>
			List().set(9, undefined));
		const newShape = {
			pos: { x: 4, y: 0 },
			color: 'purple',
			shape: [
				{x: 0, y: 0},
				{x: 0, y: 1},
				{x: 0, y: 2},
				{x: 0, y: 3}
			],
			len: 4
		};
		const expectedActions = [
			actions.shapeDown(newBoard)
		];
		store = mockStore(Object.assign({}, store.getState(), {
			currentShape: newShape,
			board: newBoard
		}));
		store.dispatch(actions.shapeShouldDown(socket));
		setTimeout(() => {
			expect(store.getActions()).toEqual(expectedActions);
			done();
		}, 100);
	});
	test('shapeShouldDown - is alive', (done) => {
		const newBoard = List().set(19, undefined).map(e =>
			List().set(9, undefined));
		const newShape = {
			pos: { x: 4, y: 16 },
			color: 'purple',
			shape: [
				{x: 0, y: 0},
				{x: 0, y: 1},
				{x: 0, y: 2},
				{x: 0, y: 3}
			],
			len: 4
		};
		const expectedActions = [
			actions.mergeCurrShape(newShape),
			actions.setCurrShape(undefined)
		];
		store = mockStore(Object.assign({}, store.getState(), {
			currentShape: newShape,
			board: newBoard
		}));
		store.dispatch(actions.shapeShouldDown(socket));
		setTimeout(() => {
			expect(store.getActions()).toEqual(expectedActions);
			done();
		}, 100);
	});
	test('shapeShouldDown - is dead', (done) => {
		const newBoard = List().set(19, undefined).map(e =>
			List().set(9, undefined).map(e => 'e'));
		const newShape = {
			pos: { x: 4, y: -1 },
			color: 'purple',
			shape: [
				{x: 0, y: 0},
				{x: 0, y: 1},
				{x: 0, y: 2},
				{x: 0, y: 3}
			],
			len: 4
		};
		const expectedActions = [
			actions.mergeCurrShape(newShape),
			actions.setStatusGame(GameStatus.LOOSE),
			actions.reset_board,
			actions.reset_next_shape
		];
		store = mockStore(Object.assign({}, store.getState(), {
			currentShape: newShape,
			board: newBoard
		}));
		store.dispatch(actions.shapeShouldDown(socket));
		setTimeout(() => {
			expect(store.getActions()).toEqual(expectedActions);
			done();
		}, 100);
	});
	test('startFall', (done) => {
		const expectedActions = [
			actions.setCurrShape(undefined)
		];
		store.dispatch(actions.startFall(socket));
		setTimeout(() => {
			expect(store.getActions()).toEqual(expectedActions);
			done();
		}, 100);
	});
	test('OnStart - OnEvent - OnPress - handler', (done) => {
		const expectedActions = [
			actions.setStatusGame(GameStatus.RUNNING),
			actions.setCurrShape(undefined),
			actions.updateSpectre('spectre'),
			actions.setCurrShape(currentShape),
			actions.setNextShape(List().set(6, undefined).map(e => List().set(4, undefined).map(e => 'blue'))),
			actions.addMalus(2),
			actions.setCurrShape(actions.updateShape(currentShape, 0, -2))
		];
		store.dispatch(actions.OnStart(socket));
		ioServer.emit('start');
		setTimeout(() => {
			ioServer.emit('spectre', 'spectre');
			ioServer.emit('tetrimino', currentShape, List().set(6, undefined).map(e => List().set(4, undefined).map(e => 'blue')));
			ioServer.emit('malus', 2);
			setTimeout(() => {
				expect(store.getActions()).toEqual(expectedActions);
				done();
			}, 100);
		}, 100);
	});
})
