import React from 'react';
import { shallow } from 'enzyme';
import Board from '../src/client/components/board';

import { List } from 'immutable'

describe('Board', () => {
	test('renders correctly when WON', () => {
		const OnStart = jest.fn();
		const board = List().set(19, undefined).map(e => List().set(9, undefined));
		const currentShape = {
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

		const wrapper = shallow(<Board
			OnStart={OnStart}
			player={'host'}
			status={'WON'}
			board={board}
			currentShape={currentShape}
			/>);

		expect(wrapper).toMatchSnapshot();
	});
	test('renders correctly when LOOSE', () => {
		const OnStart = jest.fn();
		const board = List().set(19, undefined).map(e => List().set(9, undefined));
		const currentShape = {
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

		const wrapper = shallow(<Board
			OnStart={OnStart}
			player={'host'}
			status={'LOOSE'}
			board={board}
			currentShape={currentShape}
			/>);

		expect(wrapper).toMatchSnapshot();
	});
	test('renders correctly when running initial', () => {
		const OnStart = jest.fn();
		const board = List().set(19, undefined).map(e => List().set(9, undefined));
		const currentShape = {
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

		const wrapper = shallow(<Board
			OnStart={OnStart}
			player={'host'}
			status={'RUNNING'}
			board={board}
			currentShape={currentShape}
			/>);

		expect(wrapper).toMatchSnapshot();
	});
	test('renders correctly when beggining and player2', () => {
		const OnStart = jest.fn();
		const board = List().set(19, undefined).map(e => List().set(9, undefined));
		const currentShape = {
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

		const wrapper = shallow(<Board
			OnStart={OnStart}
			player={'player2'}
			status={'BEGINNING'}
			board={board}
			currentShape={currentShape}
			/>);

		expect(wrapper).toMatchSnapshot();
	});
	test('renders correctly when beggining and host', () => {
		const OnStart = jest.fn();
		const board = List().set(19, undefined).map(e => List().set(9, undefined));
		const currentShape = {
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

		const wrapper = shallow(<Board
			OnStart={OnStart}
			player={'host'}
			status={'BEGINNING'}
			board={board}
			currentShape={currentShape}
			/>);

		expect(wrapper).toMatchSnapshot();
	});
});
