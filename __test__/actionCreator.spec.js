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
	test('canDown', () =>{
		const shape = {
			pos: { x: 4, y: 4 },
			color: 'orange',
			shape: [
				{x: 1, y: 0},
				{x: 2, y: 0},
				{x: 3, y: 0},
				{x: 4, y: 0}
			],
			len: 4
		};
		const emptyBoard = List().set(19, undefined).map(e => List().set(9, undefined));
		const filledBoard = List().set(19, undefined).map(e => List().set(9, 'orange').map(e => 'orange'));

		expect(actions.canDown(shape, emptyBoard)).toBe(true);
		expect(actions.canDown(shape, filledBoard)).toBe(false);
	});
	test('update Shape', () => {
		const shape1 = {
			pos: { x: 4, y: 4 },
			color: 'orange',
			shape: [
				{x: 1, y: 0},
				{x: 2, y: 0},
				{x: 3, y: 0},
				{x: 4, y: 0}
			],
			len: 4
		};
		const shape2 = {
			pos: { x: 3, y: 6 },
			color: 'orange',
			shape: [
				{x: 1, y: 0},
				{x: 2, y: 0},
				{x: 3, y: 0},
				{x: 4, y: 0}
			],
			len: 4
		};
		expect(actions.updateShape(shape1, -1, 2)).toEqual(shape2);
	});
	test('calculate malus', () => {
		const shape = {
			pos: { x: 4, y: 4 },
			color: 'orange',
			shape: [
				{x: 1, y: 0},
				{x: 2, y: 0},
				{x: 3, y: 0},
				{x: 4, y: 0}
			],
			len: 4
		};
		const shape2 = {
			pos: { x: 4, y: 4 },
			color: 'orange',
			shape: [
				{x: 0, y: 0},
				{x: 0, y: 1},
				{x: 1, y: 2},
				{x: 0, y: 0}
			],
			len: 4
		};
		const emptyBoard = List().set(19, undefined).map(e => List().set(9, undefined));
		const filledBoard = List().set(19, undefined).map(e => List().set(9, 'orange').map(e => 'orange'));
		const emptyLineList = List([]);
		const lineList = List([4]);
		const lineList2 = List([4, 5, 6]);

		expect(actions.calculateMalus(emptyBoard, shape)).toEqual(emptyLineList);
		expect(actions.calculateMalus(filledBoard, shape)).toEqual(lineList);
		expect(actions.calculateMalus(filledBoard, shape2)).toEqual(lineList2);
	});
	test('calculate spectrum', () => {
		const emptyBoard = List().set(19, undefined).map(e => List().set(9, undefined));
		const filledBoard = List().set(19, undefined).map(e => List().set(9, 'orange').map(e => 'orange'));
		const lineList = List([19,19,19,19,19,19,19,19,19,19]);
		const lineList2 = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

		expect(actions.calculateSpectrum(filledBoard)).toEqual(lineList);
		expect(actions.calculateSpectrum(emptyBoard)).toEqual(lineList2);
	});
	test('can put', () => {
		const shape = {
			pos: { x: 4, y: 4 },
			color: 'orange',
			shape: [
				{x: 1, y: 0},
				{x: 2, y: 0},
				{x: 3, y: 0},
				{x: 4, y: 0}
			],
			len: 4
		};
		const emptyBoard = List().set(19, undefined).map(e => List().set(9, undefined));
		const filledBoard = List().set(19, undefined).map(e => List().set(9, 'orange').map(e => 'orange'));
		expect(actions.canPut(shape, emptyBoard)).toBe(true);
		expect(actions.canPut(shape, filledBoard)).toBe(false);
	});
});
