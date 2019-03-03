import { List } from 'immutable'
import * as actions from '../src/client/actions'
import { GameStatus } from '../src/client/actions'

describe('action sync', () => {
	test('update mode', () => {
		const obj = { type: 'solo', meta: { name: undefined } };
		const res = { type: 'SET_MODE', mode: obj };
		expect(actions.updateMode(obj)).toEqual(res);
	});
	test('update spectre', () => {
		const obj = List().set(9, 0);
		const res = { type: 'UPDATE_SPECTRE', spectre: obj };
		expect(actions.updateSpectre(obj)).toEqual(res);
	});
	test('update score', () => {
		const obj = 42;
		const res = { type: 'UPDATE_SCORE', score: obj };
		expect(actions.updateScore(obj)).toEqual(res);
	});
	test('set info', () => {
		const obj = 'host';
		const res = { type: 'INFO', info: obj };
		expect(actions.info(obj)).toEqual(res);
	});
	test('status game', () => {
		const obj = GameStatus.LOADING;
		const res = { type: 'STATUS_GAME', status: obj };
		expect(actions.setStatusGame(obj)).toEqual(res);
	});
	test('set current shape', () => {
		const obj = undefined;
		const res = { type: 'SET_SHAPE', shape: obj };
		expect(actions.setCurrShape(obj)).toEqual(res);
	});
	test('shape left', () => {
		const res = { type: 'SHAPE_LEFT' };
		expect(actions.shapeLeft()).toEqual(res);
	});
	test('shape rotate', () => {
		const res = { type: 'SHAPE_ROTATE'  };
		expect(actions.shapeRotate()).toEqual(res);
	});
	test('shape down', () => {
		const res = { type: 'SHAPE_DOWN'  };
		expect(actions.shapeDown()).toEqual(res);
	});
	test('shape bottom', () => {
		const res = { type: 'SHAPE_BOTTOM', jump: 42};
		expect(actions.shapeBottom(42)).toEqual(res);
	});
	test('merge current shape', () => {
		const res = { type: 'MERGE_SHAPE', shape: undefined };
		expect(actions.mergeCurrShape(undefined)).toEqual(res);
	});
	test('destroy line', () => {
		const tabY = List.of([13, 14, 15]);
		const res = { type: 'DESTROY', tabY: tabY };
		expect(actions.destroyLine(tabY)).toEqual(res);
	});
	test('add malus', () => {
		const res = { type: 'MALUS', n: 4 };
		expect(actions.addMalus(4)).toEqual(res);
	});
	test('set next shape', () => {
		const res = { type: 'SET_NEXT_SHAPE', shape: 42 };
		expect(actions.setNextShape(42)).toEqual(res);
	});
});
