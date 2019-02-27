import { combineReducers } from 'redux'
import currentShape from './currentShape';
import board from './board';
import status from './status';
import info from './info';
import spectre from './spectre';
import nextShape from './nextShape';
import score from './score';

export default combineReducers({
	nextShape,
	spectre,
	info,
	status,
	board,
	currentShape,
	score
})
