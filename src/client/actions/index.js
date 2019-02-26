import { List } from 'immutable';

export const GameStatus = {
		ERROR: 'ERROR',
		RUNNING: 'RUNNING',
		LOADING: 'LOADING',
		BEGINNING: 'BEGINNING'
};

const updateSpectre = (spectre) => ({
		type: 'UPDATE_SPECTRE',
		spectre
});

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

const shapeDown = () => ({
		type: 'SHAPE_DOWN'
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

const newTetrimino = (socket) => {
		return (dispatch, getState) => {
				const { board } = getState();
				// TODO calculate new spectre from curr board
				const init = List().set(9, 0).map(e => 7);

				socket.emit('new_tetrimino', init, 0);
		}
}

const mergeCurrShape = (shape) => ({
		type: 'MERGE_SHAPE',
		shape
})

export const shapeShouldDown = (socket) => {
		return (dispatch, getState) => {
				const {currentShape, board} = getState();

				if (canDown(currentShape, board))
						dispatch(shapeDown());
				else {
						dispatch(mergeCurrShape(currentShape));
						return dispatch(newTetrimino(socket));
				}
		}
}

const startFall = (socket) => {
		return dispatch => {
				setInterval(() => dispatch(shapeShouldDown(socket)), 1000);
				return dispatch(newTetrimino(socket));
		}
}

const OnEvent = (socket) => {
		return dispatch => {
				socket.on('spectre', (spectre) => {
						dispatch(updateSpectre(spectre));
				})
				socket.on('tetrimino', (curr, next) => {
						dispatch(setCurrShape(curr));
				})
				const handler = (event) => {
						if (event.code == "Space")
								console.log('Dispatch chute shape');
						if (event.code == "ArrowUp")
								console.log('Dispatch Rotate Action');
						if (event.code == "ArrowDown")
								console.log('Dispatch shapeDown');
						if (event.code == "ArrowLeft")
								console.log('Dispatch Shape left');
						if (event.code == "ArrowRight")
								console.log('Dispatch Shape right');
				}
				window.addEventListener("keydown", handler);
				return dispatch(startFall(socket))
		}
}

export const OnStart = (socket) => {
		return dispatch => {
				socket.on('start', () => {
						dispatch(setStatusGame(GameStatus.RUNNING));
							return dispatch(OnEvent(socket))
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
								return dispatch(OnEvent(socket))
						}
				}
				window.addEventListener("keydown", press_enter);
		}
}
