import { GameStatus } from '../actions';

const status = (status = GameStatus.HOME, action) => {
	switch (action.type) {
		case 'STATUS_GAME':
			return action.status
		default:
			return status;
	}
};

export default status;
