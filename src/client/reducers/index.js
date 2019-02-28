import { combineReducers } from 'redux'
import currentShape from './currentShape';
import board from './board';
import status from './status';
import info from './info';
import spectre from './spectre';
import nextShape from './nextShape';
import score from './score';
import mode from './mode';

export default combineReducers({
	mode,
	nextShape,
	spectre,
	info,
	status,
	board,
	currentShape,
	score
})
