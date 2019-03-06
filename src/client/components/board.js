import React from 'react';
import { List } from 'immutable';
import * as Styles from './board.css';

import { GameStatus, shapeToBotton, updateShape } from '../actions';

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.reducerBoard = this.reducerBoard.bind(this);
	}

	componentDidMount() {
		this.props.OnStart();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.player === 'player2'
			&& this.props.player === 'host'
			&& (this.props.status === GameStatus.BEGINNING
				|| this.props.status === GameStatus.WON
				|| this.props.status === GameStatus.LOOSE
			)) {
			this.props.OnStart();
		}
		if ((this.props.status === GameStatus.WON
			|| this.props.status === GameStatus.LOOSE)
			&& prevProps.status === GameStatus.RUNNING) {
			this.props.OnStart();
		}
	}

	reducerBoard(acc, currValue) {
		const y = currValue.y + this.props.currentShape.pos.y;
		const x = currValue.x + this.props.currentShape.pos.x;
		if (y >= 0)
			return acc.setIn([y, x], this.props.currentShape.color);
		return acc;
	}

	render() {
		const {player, board, currentShape, status } = this.props;

		if (status === GameStatus.BEGINNING) {
			if ( player === 'host')
				return ( <p style={Styles.boardStyle} > press enter </p> );
			else
				return (<p style={Styles.boardStyle} > waiting host </p>);
		}
		if (status === GameStatus.WON || status === GameStatus.LOOSE) {
			return ( <p style={Styles.boardStyle} > I {status} </p> )
		}

		const prevShapeY = shapeToBotton(currentShape, board, 0);
		const prevShape = updateShape(currentShape, 0, prevShapeY);
		const tab = prevShape.shape.reduce((acc, currValue) => {
			const y = currValue.y + prevShape.pos.y;
			const x = currValue.x + prevShape.pos.x;
			if (y >= 0)
				return acc.setIn([y, x], 'black');
			return acc;
		}, board);
		const finaltab = currentShape.shape.reduce(this.reducerBoard, tab);

		return (
			<div style={Styles.boardStyle} >
				{finaltab.map((row, y) => row.map( (elem, x) =>
					<div
						key={`${y}${x}`}
						style={Styles.blockStyle(elem === 'black' ?
							currentShape.color : elem, elem === 'black' ? true : false)}
					>
					</div>
					)
				)}
			</div>
				)

		}
}

export default Board;
