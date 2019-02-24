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

export const shapeDown = shape => ({
		type: 'SHAPE_DOWN',
		shape
})
