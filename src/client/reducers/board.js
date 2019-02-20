import { List } from 'immutable';

const emptyBoard = List().set(19, undefined).map(e => List().set(9, undefined));

const board = (board = emptyBoard, action) => {
		return board;
};

export default board;
