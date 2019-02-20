const initialState = {
		pos: { x: 4, y: 0 },
		color: 'green',
		shape: [
				{x: 0, y: 0},
				{x: 0, y: 1},
				{x: 1, y: 1},
				{x: 1, y: 2}
		]
};

const currentShape = (shape = undefined, action) => {
		if (typeof shape === 'undefined')
				return initialState;
		if (shape === null)
				return initialState;
		switch (action.type) {
				case 'SHAPE_DOWN':
						return Object.assign(
								{},
								shape,
								{pos : { x: shape.pos.x, y: shape.pos.y + 1 }}
						)
				default:
						return shape
		}
};

export default currentShape;
