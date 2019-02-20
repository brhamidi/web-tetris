import React from 'react';
import { List } from 'immutable';
import * as Styles from './board.css';

const Board = ({ board, currentShape, shapeDown}) => {
		const reducer = (acc, currValue) => {
				const y = currValue.y + currentShape.pos.y;
				const x = currValue.x + currentShape.pos.x;
				return acc.setIn([y, x], currentShape.color);
		}
		const tab = currentShape.shape.reduce(reducer, board);

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
		);
}

export default Board;
