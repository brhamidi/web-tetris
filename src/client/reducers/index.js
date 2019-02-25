import { combineReducers } from 'redux'
import currentShape from './currentShape';
import board from './board';
import status from './status';
import info from './info';
import spectre from './spectre';

export default combineReducers({
		spectre,
		info,
		status,
		board,
		currentShape
})
