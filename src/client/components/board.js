import React from 'react';
import { List } from 'immutable';
import * as Styles from './board.css';

import { GameStatus } from '../actions';

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.reducerBoard = this.reducerBoard.bind(this);
	}

	componentDidMount() {
		this.props.OnStart();
	}

	componentWillUnmount() {
		this.props.OnClose();
	}
	reducerBoard(acc, currValue) {
		const y = currValue.y + this.props.currentShape.pos.y;
		const x = currValue.x + this.props.currentShape.pos.x;
		return acc.setIn([y, x], this.props.currentShape.color);
	}

	render() {
		const {player, board, currentShape, status } = this.props;
		const tab = currentShape.shape.reduce(this.reducerBoard, board);

		if (status == GameStatus.BEGINNING) {
			if ( player === 'host')
				return (<p style={Styles.boardStyle} > press enter </p>);
			else
				return (<p style={Styles.boardStyle} > waiting host </p>);
		}
		if (status == GameStatus.WON)
			return (<p> I WON </p>)
		if (status == GameStatus.LOOSE)
			return (<p> I LOOSE </p>)
		return (
			<div style={Styles.boardStyle} >
				{tab.map((row, y) => row.map( (elem, x) =>
					<div
						key={`${y}${x}`}
						style={Styles.blockStyle(elem)}
					>
						</div>
								)
								)}
										</div>
				)

		}
}

export default Board;
