import currentShape from '../src/client/reducers/currentShape';
import board from '../src/client/reducers/board';
import status from '../src/client/reducers/status';
import info from '../src/client/reducers/info';
import spectre from '../src/client/reducers/spectre';
import nextShape from '../src/client/reducers/nextShape';
import score, { calculatePoint } from '../src/client/reducers/score';
import mode from '../src/client/reducers/mode';

import { updateShape, GameStatus} from '../src/client/actions';

import { List } from 'immutable';

describe('reducer status', () => {
	const initialState = GameStatus.LOADING

	test('should return the initial state', () => {
		expect(status(undefined, {})).toEqual(initialState)
	})
	test('should return new status', () => {
		expect(status(initialState,
			{type: 'STATUS_GAME', status: GameStatus.WON}
		)).toEqual(GameStatus.WON)
	})
})

describe('reducer spectre', () => {
	const initialState = List().set(9, 2).map(e => 0)

	test('should return the initial state', () => {
		expect(spectre(undefined, {})).toEqual(initialState)
	})
	test('should update the current spectre', () => {
		expect(spectre(initialState,
			{type: 'UPDATE_SPECTRE', spectre: { value: 42 }}
		)).toEqual({value: 42})
	})
})

describe('reducer score', () => {
	const initialState = 0

	test('should return the initial state', () => {
		expect(score(undefined, {})).toBe(initialState)
	})
	test('should return the new updated score', () => {
		expect(score(initialState, {type: 'UPDATE_SCORE', score: 3}))
			.toBe(initialState + (calculatePoint(3) * 1000) )
	})
})

describe('reducer next shape', () => {
	const initialState =
		List().set(6, undefined).map(e => List().set(4, undefined));

	test('should return the initial state', () => {
		expect(nextShape(undefined, {})).toEqual(initialState);
	})
	test('should reset the current next shape', () => {
		expect(nextShape({}, {type: 'RESET_NEXT_SHAPE'}))
			.toEqual(initialState);
	})
	test('should set the current next shape', () => {
		const shape = {
			pos: { x: 4, y: 18 },
			color: 'white',
			shape: [
				{x: 0, y: 0},
				{x: 1, y: 0},
				{x: 0, y: 1},
				{x: 1, y: 1}
			],
			len: 1
		};
		const action = {type: 'SET_NEXT_SHAPE', shape}
		const res =  action.shape.shape.reduce((acc, curr) => {
			const y = curr.y + 2;
			const x = curr.x + 1;
			return acc.setIn([y, x], action.shape.color);
		}, initialState)

		expect(nextShape(initialState, action))
			.toEqual(res)
	})
})

describe('reducer mode', () => {
	const initialState = {
		type: 'solo',
		meta : { name: undefined }
	};

	test('should return the initial state', () => {
		expect(mode(undefined, {})).toEqual(initialState);
	})
	test('should update mode', () => {
		const newMode = { type: 'multi', meta: { name: 'brams' }}

		expect(mode(initialState, {type: 'SET_MODE', mode: newMode}))
			.toEqual(newMode)
	})
})

describe('reducer info', () => {
	const initialState = 'undefined'

	test('should return the initial state', () => {
		expect(info(undefined, {})).toEqual(initialState);
	})
	test('should update info', () => {
		expect(info(initialState, {type: 'INFO', info: 'host'}))
			.toMatch('host')
	})
})

describe('reducer board', () => {
	const initialState = 
		List().set(19, undefined).map(e => List().set(9, undefined));

	test('should return the initial state', () => {
		expect(board(undefined, {})).toEqual(initialState);
	})
	test('should return un empty board', () => {
		expect(board({}, {type: 'RESET_BOARD'})).toEqual(initialState);
	})
	test('should return a maluced board', () => {
		const f = (board, n) => {
			if (n === 0) return board;
			return f(board.delete(0).insert(19, List().set(9, 0).map(e => 'black')), n-1);
		}
		const res = f(initialState, 2);

		expect(board(initialState, {type: 'MALUS', n: 2})).toEqual(res);
	})
	const shape = {
		pos: { x: 4, y: 18 },
		color: 'white',
		shape: [
			{x: 0, y: 0},
			{x: 1, y: 0},
			{x: 0, y: 1},
			{x: 1, y: 1}
		],
		len: 1
	};
	const mergedBoard = shape.shape.reduce((acc, curr) => {
		const y = curr.y + shape.pos.y;
		const x = curr.x + shape.pos.x;
		return acc.setIn([y, x], shape.color);
	}, initialState);


	test('should return a board merged with shape', () => {
		expect(board(initialState, {type: 'MERGE_SHAPE', shape}))
			.toEqual(mergedBoard);
	})
	test('should return a destroyed board', () => {
		const action = {type: 'DESTROY', tabY: [14, 13, 13, 11]}
		const res = action.tabY.sort((a, b) => {
			if (a < b) { return -1; }
			else if (a > b) { return 1; }
			else { return 0; }
		}).reduce((acc, curr) => {
			return acc.delete(curr).insert(0, List().set(9, undefined));
		}, mergedBoard);

		expect(board(mergedBoard, action)).toEqual(res);
	})
})

describe('reducer current shape', () => {
	const initialState = {
		pos: { x: 4, y: 0 },
		color: 'white',
		shape: [
			{x: 0, y: 0},
			{x: 1, y: 0},
			{x: 0, y: 1},
			{x: 1, y: 1}
		],
		len: 1
	};
	test('should return the initial state', () => {
		expect(currentShape(undefined, {})).toEqual(initialState);
	});
	test('shape left', () => {
		expect(currentShape(initialState, {type:'SHAPE_LEFT'}))
			.toEqual(updateShape(initialState, -1, 0));
	})
	test('shape right', () => {
		expect(currentShape(initialState, {type:'SHAPE_RIGHT'}))
			.toEqual(updateShape(initialState, 1, 0));
	})
	test('shape bottom', () => {
		const action = {type:'SHAPE_BOTTOM', jump: 3};

		expect(currentShape(initialState, action))
			.toEqual(updateShape(initialState, 0, action.jump));
	})
	test('shape rotate', () => {
		const res = Object.assign(
			{},
			initialState,
			{ shape: initialState.shape.map(e => ({
				x: -e.y + initialState.len - 1,
				y: e.x
			})) }
		);
		expect(currentShape(initialState, {type:'SHAPE_ROTATE'}))
			.toEqual(res);
	})
	test('shape down', () => {
		expect(currentShape(initialState, {type:'SHAPE_DOWN'}))
			.toEqual(updateShape(initialState, 0, 1));
	})
	test('set shape with no shape in action return current state', () => {
		expect(currentShape(initialState,
			{type: 'SET_SHAPE' }
		)).toEqual(initialState);
	});
	test('set shape', () => {
		expect(currentShape(initialState,
			{type: 'SET_SHAPE', shape: { newShape: true } }
		)).toEqual({newShape: true});
	});
	test('unknown action type must not affect current state', () => {
		expect(currentShape(initialState, {type: '42'}))
			.toEqual(initialState);
	})
})
