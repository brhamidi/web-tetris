import { List } from 'immutable';

const emptyBoard =
		List().set(19, undefined).map(e => List().set(9, undefined));

const board = (board = emptyBoard, action) => {
		switch (action.type) {
				case 'MERGE_SHAPE':
						return (
								action.shape.shape.reduce((acc, curr) => {
										const y = curr.y + action.shape.pos.y;
										const x = curr.x + action.shape.pos.x;
										return acc.setIn([y, x], action.shape.color);
								}, board)
						);
				default:
						return board;
		}
};

export default board;
