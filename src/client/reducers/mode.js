const initialState = {
	type: 'solo',
	meta : { name: undefined }
};

const mode = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_MODE':
			return action.mode
		default:
			return state;
	}
}

export default mode;
