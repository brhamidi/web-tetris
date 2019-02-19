import React from 'react';
import { List } from 'immutable';
import { boardStyle } from './board.css';

const Board = (props) => {
		const list = props.list;

		return (
				<div style={boardStyle} >
						Board
				</div>
		);
}

export default Board;
