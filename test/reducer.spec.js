import currentShape from '../src/client/reducers/currentShape';
import board from '../src/client/reducers/board';
import status from '../src/client/reducers/status';
import info from '../src/client/reducers/info';
import spectre from '../src/client/reducers/spectre';
import nextShape from '../src/client/reducers/nextShape';
import score from '../src/client/reducers/score';
import mode from '../src/client/reducers/mode';

import { updateShape } from '../src/client/actions';

describe('reducers current shape', () => {
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
	test('initial state must be set', () => {
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
