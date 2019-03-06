import { List } from 'immutable'

const initialState = List().set(6, undefined).map(e => List().set(4, undefined));

const nextShape = (state = initialState, action) => {
	switch (action.type) {
		case 'RESET_NEXT_SHAPE':
			return initialState
		case 'SET_NEXT_SHAPE':
			return (
				action.shape.shape.reduce((acc, curr) => {
					const y = curr.y + 2;
					const x = curr.x + 1;
					return acc.setIn([y, x], action.shape.color);
				}, initialState)
			);
		default:
			return state;
	}
}

export default nextShape;
