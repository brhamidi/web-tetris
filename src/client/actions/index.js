import { List, fromJS} from 'immutable';

export const GameStatus = {
	ERROR: 'ERROR',
	RUNNING: 'RUNNING',
	LOADING: 'LOADING',
	WON: 'WON',
	LOOSE: 'LOOSE',
	BEGINNING: 'BEGINNING'
};

export const updateShape = (shape, posx, posy) => {
	return Object.assign(
		{},
		shape,
		{ pos: { x: posx + shape.pos.x, y: shape.pos.y + posy } }
	)
}

export const updateMode = (mode) => ({
	type: 'SET_MODE',
	mode
})

export const updateSpectre = (spectre) => ({
	type: 'UPDATE_SPECTRE',
	spectre
});

export const updateScore = (score) => ({
	type: 'UPDATE_SCORE',
	score
});

export const info = (info) => ({
	type: 'INFO',
	info
});

export const setInfo = (socket, room, player) => {
	return (dispatch, getState) => {
		socket.on('mode', (mode) => {
			dispatch(updateMode(mode));
		})
		socket.on('info_response', (msg => {
			dispatch(info(msg));
			const { status } = getState();
			if (status !== GameStatus.RUNNING) {
				dispatch(setStatusGame(GameStatus.BEGINNING));
			}
		}));
		socket.emit('info', room, player);
	}
};

export const setStatusGame = (status) => ({
	type: 'STATUS_GAME',
	status
});

export const setCurrShape = (shape) => ({
	type: 'SET_SHAPE',
	shape
})

export const shapeRight = () => ({
	type: 'SHAPE_RIGHT'
})

export const shapeLeft = () => ({
	type: 'SHAPE_LEFT'
})

export const shapeRotate = () => ({
	type: 'SHAPE_ROTATE'
})

export const shapeDown = () => ({
	type: 'SHAPE_DOWN'
})

export const shapeBottom = (jump) => ({
	type: 'SHAPE_BOTTOM',
	jump
})

export const canDown = (shape, board) => {
	const tabY = shape.shape.map(pos => pos.y);
	const tab = tabY.filter(y => y + shape.pos.y >= 19);

	if (tab.length === 0) {
		const newValue = shape.shape.map(
			e => ({x: shape.pos.x + e.x, y: shape.pos.y + 1 + e.y})
		).filter(e => e.y >= 0);
		const colorTab = newValue.map(e => board.get(e.y).get(e.x))
		return colorTab.filter(e => e !== undefined).length > 0 ?
			false : true;
	}
}

export const calculateMalus = (board, shape) => {
	const lineY = shape.shape.reduce((acc, curr) => {
		if (acc.includes(curr.y + shape.pos.y) === true)
			return acc;
		else
			return acc.push(curr.y + shape.pos.y);
	}, List())
		.map(e => ({ y: e, line: board.get(e)}) );

	return lineY
		.filter( ({ y, line }) => line.includes(undefined) === false)
		.map(e => e.y);
};

export const destroyLine = (tabY) => ({
	type: 'DESTROY',
	tabY
})

export const calculateSpectrum = (board) =>
{
	const init = List().set(9, undefined);
	return (board.reduce((acc, curr, key) => {
		return (curr.reduce((acc2, curr2, key2) => {
			if (!acc2.get(key2) && curr2)
				return acc2.set(key2, key);
			return acc2;
		}, acc))
	}, init)).map((e) => {return (20 - ((e == undefined) ? 20 : e))});
}

export const newTetrimino = (socket) => {
	return (dispatch, getState) => {
		const { board, currentShape} = getState();

		const destroy = calculateMalus(board, currentShape);

		if (destroy.size > 0) {
			dispatch(destroyLine(destroy));
			dispatch(updateScore(destroy.size));
		}
		const malus = destroy.size > 0 ? destroy.size - 1 : 0;
		const spectre = calculateSpectrum(board);
		dispatch(setCurrShape(undefined));
		socket.emit('new_tetrimino', spectre, malus);
	}
}

export const mergeCurrShape = (shape) => ({
	type: 'MERGE_SHAPE',
	shape
})

let timerId; // TODO pass that in state

export const shapeShouldDown = (socket) => {
	return (dispatch, getState) => {
		const {currentShape, board} = getState();

		if (canDown(currentShape, board))
			dispatch(shapeDown(board));
		else
		{
			dispatch(mergeCurrShape(currentShape));
			const { board } = getState();
			if ((board.get(0).filter(e => e === undefined).size) === 10)
				return dispatch(newTetrimino(socket));
			else {
				dispatch(setStatusGame(GameStatus.LOOSE));
				socket.emit('dead');
				return dispatch(OnCloseBoard(socket));
			}
		}
	}
}

export const startFall = (socket) => {
	return dispatch => {
		timerId = setInterval(() => dispatch(shapeShouldDown(socket)), 1000);
		return dispatch(newTetrimino(socket));
	}
}

export const canPut = (shape, board) => {
	const shapeValue = shape.shape.map(({x, y}) => {
		return {x: x + shape.pos.x, y: shape.pos.y + y};
	})

	if (shapeValue.filter(({x, y}) => x < 0 || x > 9 || y > 19)
		.length === 0)
	{
		const boardValue = shapeValue.map(({x, y}) => {
			if (y >= 0)
				return board.get(y).get(x);
		})
		if (boardValue.filter(e => e !== undefined).length > 0)
			return false;
		return true;
	}
	return false;
}

export const shapeToBotton = (shape, board, y) => {
	return (canPut(updateShape(shape, 0, y + 1), board) === true ?
		shapeToBotton(shape, board, y + 1) : y);
}

const handler = (event, getState, socket, dispatch) => {
	const { currentShape, board } = getState();
	const shape = currentShape;
	
	if (currentShape.color != 'white')
	{
		if (event.code === "Space") {
			event.preventDefault();
			dispatch(shapeBottom(shapeToBotton(shape, board, 0)));
			return dispatch(shapeShouldDown(socket))
		}
		if (event.code === "ArrowUp") {
			event.preventDefault();
			const newShape = Object.assign(
				{},
				shape,
				{
					shape: shape.shape.map(e => ({
						x: -e.y + shape.len - 1,
						y: e.x
					})) 
				} )
			if (canPut(newShape, board))
				dispatch(shapeRotate());
		}
		if (event.code === "ArrowDown") {
			event.preventDefault();
			if (canPut(updateShape(shape, 0, 1), board))
			{
				clearInterval(timerId);
				dispatch(shapeDown());
				timerId =
					setInterval(() => dispatch(shapeShouldDown(socket)), 1000);
			}
			else
				return dispatch(shapeShouldDown(socket))
		}
		if (event.code === "ArrowLeft") {
			event.preventDefault();
			if (canPut(updateShape(shape, -1, 0), board))
				dispatch(shapeLeft());
		}
		if (event.code === "ArrowRight") {
			event.preventDefault();
			if (canPut(updateShape(shape, 1, 0), board))
				dispatch(shapeRight());
		}
	}
}

let f;
export const OnPress = (socket) => {
	return (dispatch, getState) => {
		f = (e) => handler(e, getState, socket, dispatch);
	
		window.addEventListener('keydown', f);
		return dispatch(startFall(socket))
	}
}

export const addMalus = (n) => ({
	type: 'MALUS',
	n
})

export const setNextShape = (shape) => ({
	type: 'SET_NEXT_SHAPE',
	shape
});

export const OnEvent = (socket) => {
	return (dispatch, getState) => {
		socket.on('spectre', (spectre) => {
			dispatch(updateSpectre(spectre));
		})
		socket.on('tetrimino', (curr, next) => {
			dispatch(setCurrShape(curr));
			dispatch(setNextShape(fromJS(next)));
		})
		socket.on('won', () => {
			dispatch(setStatusGame(GameStatus.WON));
			return dispatch(OnCloseBoard(socket));
		})
		socket.on('malus', (n) => {
			dispatch(addMalus(n))
			const { board, currentShape } = getState();
			if ((board.get(0).filter(e => e === undefined).size) === 10)
				dispatch(setCurrShape(updateShape(currentShape, 0, n * -1)));
			else {
				dispatch(setStatusGame(GameStatus.LOOSE));
				socket.emit('dead');
				return dispatch(OnCloseBoard(socket));
			}
		})
		return dispatch(OnPress(socket));
	}
}

export const reset_board = {
	type: 'RESET_BOARD'
};

export const reset_next_shape = {
	type: 'RESET_NEXT_SHAPE'
};

export const OnCloseBoard = (socket) => {
	return (dispatch, getState) => {
		clearInterval(timerId);
		socket.removeAllListeners('spectre');
		socket.removeAllListeners('tetrimino');
		socket.removeAllListeners('won');
		socket.removeAllListeners('malus');
		window.removeEventListener("keydown", f);
		dispatch(reset_board);
		dispatch(reset_next_shape);
	};
}

export const OnStart = (socket) => {
	return dispatch => {
		socket.on('start', () => {
			dispatch(setStatusGame(GameStatus.RUNNING));
			socket.removeAllListeners("start");
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
				socket.removeAllListeners('start');
				return dispatch(OnEvent(socket))
			}
		}
		window.addEventListener("keydown", press_enter);
	}
}
