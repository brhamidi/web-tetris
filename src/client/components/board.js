import React, { useEffect } from 'react';
import { List } from 'immutable';
import * as Styles from './board.css';

import { GameStatus, shapeToBotton, updateShape } from '../actions';

const Board = ({ OnStart, player, status, currentShape, board }) => {

	useEffect(() => {
		if (status === GameStatus.WON || status === GameStatus.LOOSE
			|| status == GameStatus.BEGINNING)
			OnStart();
	}, [player])

	useEffect(() => {
		if (status === GameStatus.WON || status === GameStatus.LOOSE)
			OnStart()
	}, [status])

	const reducerBoard = (acc, currValue) => {
		const y = currValue.y + currentShape.pos.y;
		const x = currValue.x + currentShape.pos.x;
		if (y >= 0)
			return acc.setIn([y, x], currentShape.color);
		return acc;
	}
	if (status === GameStatus.BEGINNING)
		return (<p style={Styles.boardStyle} >{player === 'host' ? 'press enter' : 'waiting host'}</p>);
	if (status === GameStatus.WON || status === GameStatus.LOOSE)
		return ( <p style={Styles.boardStyle} > I {status} </p> )

	const prevShapeY = shapeToBotton(currentShape, board, 0);
	const prevShape = updateShape(currentShape, 0, prevShapeY);
	const tab = prevShape.shape.reduce((acc, currValue) => {
		const y = currValue.y + prevShape.pos.y;
		const x = currValue.x + prevShape.pos.x;
		if (y >= 0 && currentShape.color != 'white')
			return acc.setIn([y, x], 'preview');
		return acc;
	}, board);
	const finaltab = currentShape.shape.reduce(reducerBoard, tab);

	return (
		<div style={Styles.boardStyle} >
			{finaltab.map((row, y) => row.map( (elem, x) =>
				<div
					key={`${y}${x}`}
					style={Styles.blockStyle(elem === 'preview' ?
						currentShape.color : elem, elem === 'preview')}
				>
				</div>
			)
			)}
		</div>
	)
}

export default Board;
