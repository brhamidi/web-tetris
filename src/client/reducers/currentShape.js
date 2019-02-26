const initialState = {
	pos: { x: 4, y: 0 },
	color: 'white',
	shape: [
		{x: 0, y: 0},
		{x: 0, y: 1},
		{x: 1, y: 1},
		{x: 1, y: 2}
	],
	len: 2
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
		case 'SHAPE_RIGHT':
			const colorTabRight = shape.shape.map(e => action.board.get(e.y).get(e.x + 1));

			return Object.assign(
				{},
				shape,
				{pos: shape.shape.filter(({x, y}) => {
					return (x + shape.pos.x + 1 < 0 || x + shape.pos.x + 1 > 9);}
				).length > 0 ? shape.pos
					: (colorTabRight.filter(e => e !== undefined).length > 0 ?
						shape.pos : {x: shape.pos.x + 1, y: shape.pos.y})}
			);
		case 'SHAPE_LEFT':
			const colorTabLeft = shape.shape.map(e => action.board.get(e.y).get(e.x - 1));

			return Object.assign(
				{},
				shape,
				{pos: shape.shape.filter((({x, y}) => {
					return (x + shape.pos.x - 1 < 0 || x + shape.pos.x - 1 > 9);})).length > 0 ? shape.pos
					: (colorTabLeft.filter(e => e !== undefined).length > 0 ?
						shape.pos : {x: shape.pos.x - 1, y: shape.pos.y})}
			);
		case 'SHAPE_ROTATE':
			const newShape = shape.shape.map(({x, y}) => {return ({x: (-y + shape.len - 1), y: x});});
			const colorTab = newShape.map(e => action.board.get(e.y).get(e.x));

			return Object.assign(
				{},
				shape,
				{shape: newShape.filter((({x, y}) => {
					return (x < 0 || x > 9 || y < 0 || y > 19);})).length > 0 ?
					(colorTab.filter(e => e !== undefined).length > 0 ?
						shape.shape : newShape)
					: newShape}
			);

		default:
			return shape
	}
};

export default currentShape;
