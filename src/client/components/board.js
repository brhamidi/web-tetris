import React from 'react';
import { List } from 'immutable';
import * as Styles from './board.css';

import { GameStatus } from '../actions';

const Board = ({ player, board, currentShape, shapeDown, OnPressEnter, status , OnStart}) => {
		const reducer = (acc, currValue) => {
				const y = currValue.y + currentShape.pos.y;
				const x = currValue.x + currentShape.pos.x;
				return acc.setIn([y, x], currentShape.color);
		}
		const tab = currentShape.shape.reduce(reducer, board);

		if (status == GameStatus.BEGINNING) {
				if ( player === 'host') {
						OnPressEnter();
						return (<p style={Styles.boardStyle} > press enter </p>);
				}
				else {
						OnStart();
						return (<p style={Styles.boardStyle} > waiting host </p>);
				}
		}
		else
				return (
						<div style={Styles.boardStyle} >
								{tab.map((row, y) => row.map( (elem, x) =>
										<div
												key={`${y}${x}`}
												style={Styles.blockStyle(elem)}
												onClick={() => shapeDown(currentShape)}
										>
												</div>
								)
								)}
										</div>
				)
}

export default Board;
