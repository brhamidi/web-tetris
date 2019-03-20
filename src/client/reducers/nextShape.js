import { List } from 'immutable'

export const initialState = List().set(3, undefined).map(e => List().set(3, undefined));

const nextShape = (state = initialState, action) => {
	switch (action.type) {
		case 'RESET_NEXT_SHAPE':
			return initialState
		case 'SET_NEXT_SHAPE':
			if (action.shape.shape)
				return (
					action.shape.shape.reduce((acc, curr) => {
						const y = curr.y;
						const x = curr.x;
						return acc.setIn([y, x], action.shape.color);
					}, initialState)
				);
		default:
			return state;
	}
}

export default nextShape;
