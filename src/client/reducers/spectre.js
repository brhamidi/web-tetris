import { List } from 'immutable';

const initialState = List().set(9, 2).map(e => 20);

const spectre = (state = initialState, action) => {
		switch(action.type) {
			case 'UPDATE_SPECTRE':
						return action.spectre;
				default:
						return state;
		}
}

export default spectre;
