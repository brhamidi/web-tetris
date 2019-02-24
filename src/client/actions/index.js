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
						console.log(`receive info: ${msg}`);
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

const newTetrimino = (socket) => {
	return dispatch => {
			console.log('send new tetrimino not implemt');
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
								dispatch(setStatusGame(GameStatus.RUNNING));
								dispatch(newTetrimino(socket));
								window.removeEventListener("keydown", press_enter);
								socket.emit('start');
						}
				}
				window.addEventListener("keydown", press_enter);
		}
}

export const shapeDown = shape => ({
		type: 'SHAPE_DOWN',
		shape
})
