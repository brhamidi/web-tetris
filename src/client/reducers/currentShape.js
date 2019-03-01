import { updateShape } from '../actions';

const initialState = {
	pos: { x: 4, y: 0 },
	color: 'white',
	shape: [
		{x: 0, y: 0},
		{x: 0, y: 0},
		{x: 0, y: 0},
		{x: 0, y: 0}
	],
	len: 2
};

const currentShape = (shape = initialState, action) => {
	switch (action.type) {
		case 'SHAPE_DOWN':
			return updateShape(shape, 0, 1);
		case 'SET_SHAPE':
			if (action.shape)
				return action.shape;
			else
				return initialState;
		case 'SHAPE_RIGHT':
			return updateShape(shape, 1, 0);
		case 'SHAPE_LEFT':
			return updateShape(shape, -1, 0);
		case 'SHAPE_ROTATE':
			return Object.assign(
				{},
				shape,
				{ shape: shape.shape.map(e => ({
					x: -e.y + shape.len - 1,
					y: e.x
				})) }
			);
		case 'SHAPE_BOTTOM':
			console.log('actionjump', action.jump);
			return updateShape(shape, 0, action.jump);
		default:
			return shape
	}
};

export default currentShape;
