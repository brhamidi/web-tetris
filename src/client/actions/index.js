import { List } from 'immutable';

export const GameStatus = {
	ERROR: 'ERROR',
	RUNNING: 'RUNNING',
	LOADING: 'LOADING',
	WON: 'WON',
	LOOSE: 'LOOSE',
	BEGINNING: 'BEGINNING'
};

export const updateShape = (shape, posx, posy) => {
	return Object.assign({}, shape, { pos: { x: posx + shape.pos.x, y: shape.pos.y + posy } })
}

const updateSpectre = (spectre) => ({
	type: 'UPDATE_SPECTRE',
	spectre
});

const updateScore = (score) => ({
	type: 'UPDATE_SCORE',
	score
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
	shape
})

const shapeRight = () => ({
	type: 'SHAPE_RIGHT'
})

const shapeLeft = () => ({
	type: 'SHAPE_LEFT'
})

const shapeRotate = () => ({
	type: 'SHAPE_ROTATE'
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

const calculateMalus = (board, shape) => {
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

const destroyLine = (tabY) => ({
	type: 'DESTROY',
	tabY
})

const calculateSpectrum = (board) =>
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

const newTetrimino = (socket) => {
	return (dispatch, getState) => {
		const { board, currentShape} = getState();

		const destroy = calculateMalus(board, currentShape);

		if (destroy.size > 0) {
			dispatch(destroyLine(destroy));
		}
		const malus = destroy.size > 0 ? destroy.size - 1 : 0;
		dispatch(updateScore(destroy.size));
		const spectre = calculateSpectrum(board);
		console.log(spectre);
		socket.emit('new_tetrimino', spectre, malus);
	}
}

const mergeCurrShape = (shape) => ({
	type: 'MERGE_SHAPE',
	shape
})

let timerId; // TODO pass that in state

export const shapeShouldDown = (socket) => {
	return (dispatch, getState) => {
		const {currentShape, board} = getState();

		if (canDown(currentShape, board))
			dispatch(shapeDown(board));
		else {
			dispatch(mergeCurrShape(currentShape));
			const { board } = getState();
			if ((board.get(0).filter(e => e === undefined).size) === 10)
				return dispatch(newTetrimino(socket));
			else {
				clearInterval(timerId);
				dispatch(setStatusGame(GameStatus.LOOSE));
				socket.emit('dead');
			}
		}
	}
}

const startFall = (socket) => {
	return dispatch => {
		timerId = setInterval(() => dispatch(shapeShouldDown(socket)), 1000);
		return dispatch(newTetrimino(socket));
	}
}

const canPut = (shape, board) => {
	const shapeValue = shape.shape.map(({x, y}) => {
		return {x: x + shape.pos.x, y: shape.pos.y + y};
	})

	if (shapeValue.filter(({x, y}) => x < 0 || x > 9 || y < 0 || y > 19)
		.length === 0)
	{
		const boardValue = shapeValue.map(({x, y}) => {
			return board.get(y).get(x);
		})
		if (boardValue.filter(e => e !== undefined).length > 0)
			return false;
		return true;
	}
	return false;
}

const OnPress = (socket) => {
	return (dispatch, getState) => {
		const handler = (event, getState) => {
			const { currentShape, board } = getState();
			const shape = currentShape;

			if (event.code == "Space")
				console.log('Dispatch chute shape');
			if (event.code == "ArrowUp") {
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
			if (event.code == "ArrowDown") {
				event.preventDefault();
				if (canPut(updateShape(shape, 0, 1), board))
					dispatch(shapeDown());
			}
			if (event.code == "ArrowLeft")
				if (canPut(updateShape(shape, -1, 0), board))
					dispatch(shapeLeft());
			if (event.code == "ArrowRight")
				if (canPut(updateShape(shape, 1, 0), board))
					dispatch(shapeRight());
		}
		window.addEventListener("keydown", (e) => handler(e, getState));
		return dispatch(startFall(socket))
	}
}

const addMalus = (n) => ({
	type: 'MALUS',
	n
})

const setNextShape = (shape) => ({
	type: 'SET_NEXT_SHAPE',
	shape
});

const OnEvent = (socket) => {
	return (dispatch, getState) => {
		socket.on('spectre', (spectre) => {
			dispatch(updateSpectre(spectre));
		})
		socket.on('tetrimino', (curr, next) => {
			dispatch(setCurrShape(curr));
			dispatch(setNextShape(next));
		})
		socket.on('won', () => {
			clearInterval(timerId);
			dispatch(setStatusGame(GameStatus.WON));
		})
		socket.on('malus', (n) => {
			dispatch(addMalus(n))
		})
		return dispatch(OnPress(socket));
	}
}

export const OnCloseBoard = (socket) => {
	return dispatch => {
		socket.removeAllListeners("spectre");
		socket.removeAllListeners("tetrimino");
		socket.removeAllListeners("won");
		socket.removeAllListeners("malus");
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
				return dispatch(OnEvent(socket))
			}
		}
		window.addEventListener("keydown", press_enter);
	}
}
