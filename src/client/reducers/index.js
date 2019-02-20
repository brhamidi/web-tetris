import { combineReducers } from 'redux'
import currentShape from './currentShape';
import board from './board';

export default combineReducers({
		board,
		currentShape
})
