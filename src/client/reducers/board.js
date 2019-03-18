import { List } from 'immutable';

export const emptyBoard =
	List().set(19, undefined).map(e => List().set(9, undefined));

const board = (board = emptyBoard, action) => {
	switch (action.type) {
		case 'RESET_BOARD':
			return emptyBoard;
		case 'MALUS':
			const f = (board, n) => {
				if (n === 0) return board;
				return f(board.delete(0).insert(19, List().set(9, 0).map(e => 'black')), n-1);
			}
			return f(board, action.n);
		case 'DESTROY':
			const newTab = action.tabY.sort((a, b) => {
				if (a < b) { return -1; }
				else if (a > b) { return 1; }
				else { return 0; } });

			return newTab.reduce((acc, curr) => {
				return acc.delete(curr).insert(0, List().set(9, undefined));
			}, board);
		case 'MERGE_SHAPE':
			return (
				action.shape.shape.reduce((acc, curr) => {
					const y = curr.y + action.shape.pos.y;
					const x = curr.x + action.shape.pos.x;
					if (y >= 0)
						return acc.setIn([y, x], action.shape.color);
					else
						return acc;
				}, board)
			);
		default:
			return board;
	}
};

export default board;
