import { GameStatus } from '../src/client/actions';
import { emptyBoard as board } from '../src/client/reducers/board';
import { initialState as mode } from '../src/client/reducers/mode';
import { initialState as currentShape } from '../src/client/reducers/currentShape';
import { initialState as nextShape } from '../src/client/reducers/nextShape';
import { initialState as spectre } from '../src/client/reducers/spectre';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

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

describe('Async action dispatch good actoin', () => {
	test('newTetrimino', (done) => {
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
			actions.info('host')
		]

		store = mockStore(Object.assign({}, store.getState(), {status: GameStatus.RUNNING}));
		store.dispatch(actions.setInfo(socket, 'test', 'test'));
		setTimeout(() => {
			expect(store.getActions()).toEqual(expectedActions);
			done();
		}, 100)
	})
	test('setInfo - Game is beginning', (done) => {
		const expectedActions = [
			actions.info('host'),
			actions.setStatusGame(GameStatus.BEGINNING)
		]

		store.dispatch(actions.setInfo(socket, 'test', 'test'));
		setTimeout(() => {
			expect(store.getActions()).toEqual(expectedActions);
			done();
		}, 100)
	})
})
