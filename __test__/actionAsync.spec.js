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
	jest.setTimeout(50000);
	httpServer = http.createServer().listen(1337, '127.0.0.1');
	httpServerAddr = httpServer.listen().address();
	ioServer = ioBack(httpServer);
	middlewares = [thunk];
	mockStore = configureStore(middlewares);
	ioServer.on('connection', (socket) => {
		socket.on('info', (a, b) => {
			socket.emit('info_response', {info: 'host', meta: {name: undefined}});
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
		}, 50)
	})
	test('newTetrimino - Board empty', (done) => {
		const expectedActions = [
			actions.setCurrShape(undefined)
		]

		store.dispatch(actions.newTetrimino(socket));
		setTimeout(() => {
			expect(store.getActions()).toEqual(expectedActions);
			done();
		}, 50)
	})
	test('setInfo - Game is running', (done) => {
		const expectedActions = [
			actions.info('host'),
			actions.setName('test'),
			actions.setStatusGame(GameStatus.BEGINNING),
			actions.updateMode('mode')
		]

		store = mockStore(Object.assign({}, store.getState(), {status: GameStatus.RUNNING}));
		store.dispatch(actions.setInfo(socket, 'test', 'test'));
		setTimeout(() => {
			expect(store.getActions()).toEqual(expectedActions);
			done();
		}, 50)
	})
	test('setInfo - Game is Loading', (done) => {
		const expectedActions = [
			actions.info('host'),
			actions.setName('test'),
			actions.setStatusGame(GameStatus.BEGINNING),
			actions.updateMode('mode')
		]

		store.dispatch(actions.setInfo(socket, 'test', 'test'));
		setTimeout(() => {
			expect(store.getActions()).toEqual(expectedActions);
			done();
		}, 50)
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
	test('OnStart - OnEvent spectre, malus, won', (done) => {
		const expectedActions = [
			actions.setStatusGame(GameStatus.RUNNING),
			actions.setCurrShape(undefined),
			actions.updateSpectre('spectre'),
			actions.addMalus(2),
			actions.setCurrShape(actions.updateShape(currentShape, 0, -2)),
			actions.setStatusGame(GameStatus.WON),
			actions.reset_board,
			actions.reset_next_shape
		];

		store.dispatch(actions.OnStart(socket));
		ioServer.emit('start');

		setTimeout(() => {
			ioServer.emit('spectre', 'spectre');
			ioServer.emit('malus', 2);
			ioServer.emit('won');

			setTimeout(() => {
				expect(store.getActions()).toEqual(expectedActions);
				done();
			}, 100);
		}, 100);
	});

	test('OnStart - OnEvent malus dead', (done) => {
		const newBoard = List().set(19, undefined).map(e =>
			List().set(9, 'black'));
		store = mockStore(Object.assign({}, store.getState(), {
			board: newBoard
		}));

		const expectedActions = [
			actions.setStatusGame(GameStatus.RUNNING),
			actions.setCurrShape(undefined),
			actions.addMalus(3),
			actions.setStatusGame(GameStatus.LOOSE),
			actions.reset_board,
			actions.reset_next_shape
		];

		store.dispatch(actions.OnStart(socket));
		ioServer.emit('start');

		setTimeout(() => {
			ioServer.emit('malus', 3);
			setTimeout(() => {
				expect(store.getActions()).toEqual(expectedActions);
				done();
			}, 100);
		}, 100);
	});

	test('OnStart - OnEvent - OnPress - handler', (done) => {
		const newBoard = List().set(19, undefined).map(e =>
			List().set(9, undefined));
		const newShape = {
			pos: { x: 4, y: 4 },
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
			board: newBoard,
			currentShape: newShape
		}));
		const expectedActions = [
			actions.setStatusGame(GameStatus.RUNNING),
			actions.setCurrShape(undefined),
			actions.shapeRotate(),
			actions.shapeLeft(),
			actions.shapeRight(),
			actions.shapeDown(),
		];

		store.dispatch(actions.OnStart(socket));
		ioServer.emit('start');
		setTimeout(() => {
			const arrowUp = new Event('keydown');
			arrowUp.code = 'ArrowUp'
			const arrowLeft = new Event('keydown');
			arrowLeft.code = 'ArrowLeft'
			const arrowRight = new Event('keydown');
			arrowRight.code = 'ArrowRight'
			const arrowDown = new Event('keydown');
			arrowDown.code = 'ArrowDown'
			window.dispatchEvent(arrowUp);
			window.dispatchEvent(arrowLeft);
			window.dispatchEvent(arrowRight);
			window.dispatchEvent(arrowDown);
			setTimeout(() => {
				expect(store.getActions()).toEqual(expectedActions);
				done();
			}, 100);
		}, 100);
	});
	test('OnStart - OnEvent - OnPress - handler cant up/right', (done) => {
		const newBoard = List().set(19, undefined).map(e =>
			List().set(9, undefined));
		const newShape = {
			pos: { x: 8, y: 16 },
			color: 'purple',
			shape: [
				{x: 1, y: 0},
				{x: 1, y: 1},
				{x: 1, y: 2},
				{x: 1, y: 3}
			],
			len: 4
		};
		store = mockStore(Object.assign({}, store.getState(), {
			board: newBoard,
			currentShape: newShape
		}));
		const expectedActions = [
			actions.setStatusGame(GameStatus.RUNNING),
			actions.setCurrShape(undefined)
		];

		store.dispatch(actions.OnStart(socket));
		ioServer.emit('start');
		setTimeout(() => {
			const arrowUp = new Event('keydown');
			arrowUp.code = 'ArrowUp'
			const arrowRight = new Event('keydown');
			arrowRight.code = 'ArrowRight'
			window.dispatchEvent(arrowUp);
			window.dispatchEvent(arrowRight);
			setTimeout(() => {
				expect(store.getActions()).toEqual(expectedActions);
				done();
			}, 100);
		}, 100);
	});
	test('OnStart - OnEvent - OnPress - handler cant left/down', (done) => {
		const newBoard = List().set(19, undefined).map(e =>
			List().set(9, undefined));
		const newShape = {
			pos: { x: -1, y: 16 },
			color: 'purple',
			shape: [
				{x: 1, y: 0},
				{x: 1, y: 1},
				{x: 1, y: 2},
				{x: 1, y: 3}
			],
			len: 4
		};
		store = mockStore(Object.assign({}, store.getState(), {
			board: newBoard,
			currentShape: newShape
		}));
		const expectedActions = [
			actions.setStatusGame(GameStatus.RUNNING),
			actions.setCurrShape(undefined),
			actions.mergeCurrShape(newShape),
			actions.setCurrShape(undefined)
		];

		store.dispatch(actions.OnStart(socket));
		ioServer.emit('start');
		setTimeout(() => {
			const arrowLeft = new Event('keydown');
			arrowLeft.code = 'ArrowLeft'
			const arrowDown = new Event('keydown');
			arrowDown.code = 'ArrowDown'
			window.dispatchEvent(arrowLeft);
			window.dispatchEvent(arrowDown);
			setTimeout(() => {
				expect(store.getActions()).toEqual(expectedActions);
				done();
			}, 100);
		}, 100);
	});
	test('OnStart - OnEvent - OnPress - handler space', (done) => {
		const newBoard = List().set(19, undefined).map(e =>
			List().set(9, undefined));
		const newShape = {
			pos: { x: -1, y: 16 },
			color: 'purple',
			shape: [
				{x: 1, y: 0},
				{x: 1, y: 1},
				{x: 1, y: 2},
				{x: 1, y: 3}
			],
			len: 4
		};
		store = mockStore(Object.assign({}, store.getState(), {
			board: newBoard,
			currentShape: newShape
		}));
		const expectedActions = [
			actions.setStatusGame(GameStatus.RUNNING),
			actions.setCurrShape(undefined),
			actions.shapeBottom(0),
			actions.mergeCurrShape(newShape),
			actions.setCurrShape(undefined)
		];

		store.dispatch(actions.OnStart(socket));
		ioServer.emit('start');
		setTimeout(() => {
			const space = new Event('keydown');
			space.code = 'Space'
			window.dispatchEvent(space);
			setTimeout(() => {
				expect(store.getActions()).toEqual(expectedActions);
				done();
			}, 200);
		}, 200);
	});
	test('startGame', (done) => {
		const expectedActions = [
			actions.setStatusGame(GameStatus.RUNNING),
			actions.setCurrShape(undefined),
		];

		store.dispatch(actions.startGame(socket));
		setTimeout(() => {
			const enter = new Event('keydown');
			enter.code = 'Enter'
			window.dispatchEvent(enter);
			setTimeout(() => {
				expect(store.getActions()).toEqual(expectedActions);
				done();
			}, 200);
		}, 200);
	});
})
