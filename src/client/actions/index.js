import { List } from 'immutable';

export const GameStatus = {
		ERROR: 'ERROR',
		RUNNING: 'RUNNING',
		LOADING: 'LOADING',
		BEGINNING: 'BEGINNING'
};

const info = (info) => ({
		type: 'INFO',
		info
});

export const setInfo = (socket, room, player) => {
		return dispatch => {
				socket.on('info_response', (msg => {
						dispatch(info(msg));
						dispatch(setStatusGame(GameStatus.BEGINNING));
				}));
				socket.emit('info', room, player);
		}
};

export const setStatusGame = (status) => ({
		type: 'STATUS_GAME',
		status
});

const setCurrShape = (shape) => ({
		type: 'SET_SHAPE',
		shape: {
				pos: { x: shape.x, y: 0 },
				color: shape.color,
				shape: shape.shape
		}
})

const newTetrimino = (socket) => {
		return dispatch => {
				socket.emit('new_tetrimino', {}, 0);
		}
}

export const OnTetrimino = (socket) => {
		return dispatch => {
				socket.on('tetrimino', (curr, next) => {
						dispatch(setCurrShape(curr));
				})
		}
}

const shapeDown = shape => ({
		type: 'SHAPE_DOWN',
		shape
})

const canDown = (shape, board) => {
		const tabY = shape.shape.map(pos => pos.y);
		const tab = tabY.filter(y => y + shape.pos.y >= 19);

		if (tab.length === 0) {
				const newValue = shape.shape.map(
						e => ({x: shape.pos.x + e.x, y: shape.pos.y + 1 + e.y})
				)
				const colorTab = newValue.map(e => board.get(e.y).get(e.x))

				return colorTab.filter(e => e !== undefined).length > 0 ?
						false : true;
		}
}

const mergeCurrShape = (shape) => ({
		type: 'MERGE_SHAPE',
		shape
})

export const shapeShouldDown = (shape, board, socket) => {
		return dispatch => {
				if (canDown(shape, board))
						dispatch(shapeDown(shape));
				else {
						dispatch(mergeCurrShape(shape));
						return dispatch(newTetrimino(socket));
				}
		}
}

export const OnStart = (socket) => {
		return dispatch => {
				socket.on('start', () => {
						dispatch(setStatusGame(GameStatus.RUNNING));
						dispatch(newTetrimino(socket));
				});
		};
};

export const startGame = (socket) => {
		return dispatch => {
				const press_enter = (event) => {
						if (event.code == "Enter")
						{
								window.removeEventListener("keydown", press_enter);
								socket.emit('start');
								dispatch(setStatusGame(GameStatus.RUNNING));
								return dispatch(newTetrimino(socket));
						}
				}
				window.addEventListener("keydown", press_enter);
		}
}
