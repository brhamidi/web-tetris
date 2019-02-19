import React from 'react';
import { List } from 'immutable';
import * as Styles from './board.css';

const Board = (props) => {
		const list = props.list
				.setIn([10, 5], 'red')
				.setIn([10, 6], 'red')
				.setIn([9, 5], 'red')
				.setIn([9, 6], 'red')
				.setIn([12, 2], 'green')
				.setIn([13, 2], 'green')
				.setIn([13, 3], 'green')
				.setIn([14, 3], 'green');
		const blocks = list.map(row => row.map(
				elem =>
				<div style={Styles.blockStyle(elem)}>
				</div>
			)
		);

		return (
				<div style={Styles.boardStyle} >
						{blocks}
				</div>
		);
}

export default Board;
