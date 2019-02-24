import { combineReducers } from 'redux'
import currentShape from './currentShape';
import board from './board';
import status from './status';
import info from './info';

export default combineReducers({
		info,
		status,
		board,
		currentShape
})
