const initialState = 'undefined'

const info = (info = initialState, action) => {
		switch (action.type) {
				case 'INFO':
						return action.info;
				default:
						return info;
		}
}

export default info;
