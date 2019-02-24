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
				socket.on('tetrimino', (curr, next) => {
						console.log(`curr: ${curr}`);
						console.log(`next: ${next}`);
				})
				socket.emit('new_tetrimino', {}, 0);
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

export const shapeDown = shape => ({
		type: 'SHAPE_DOWN',
		shape
})
