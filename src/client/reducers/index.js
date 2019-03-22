import { combineReducers } from 'redux'
import currentShape from './currentShape';
import board from './board';
import status from './status';
import info from './info';
import spectre from './spectre';
import nextShape from './nextShape';
import score from './score';
import mode from './mode';

import { List } from 'immutable'

const name = (state = 'Marvin', action) => {
	switch (action.type) {
		case 'SET_NAME':
			return action.name;
		default:
			return state;
	}
}

const gameList = (state = List(), action) => {
	switch (action.type) {
		case 'SET_GAME_LIST':
			return action.list
		default:
			return state;
	}
}

export default combineReducers({
	mode,
	nextShape,
	spectre,
	info,
	status,
	board,
	currentShape,
	score,
	name,
	gameList
})
