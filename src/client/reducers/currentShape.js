const initialState = {
		pos: { x: 4, y: 0 },
		color: 'white',
		shape: [
				{x: 0, y: 0},
				{x: 0, y: 1},
				{x: 1, y: 1},
				{x: 1, y: 2}
		]
};

const currentShape = (shape = initialState, action) => {
		switch (action.type) {
				case 'SHAPE_DOWN':
						return Object.assign(
								{},
								shape,
								{pos : { x: shape.pos.x, y: shape.pos.y + 1}}
						)
				case 'SET_SHAPE':
						return action.shape;
				default:
						return shape
		}
};

export default currentShape;
