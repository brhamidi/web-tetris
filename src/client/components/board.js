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
				const { loadInitialEvent } = this.props;

				loadInitialEvent();
				this.props.OnStart();
		}

		reducerBoard(acc, currValue) {
				const y = currValue.y + this.props.currentShape.pos.y;
				const x = currValue.x + this.props.currentShape.pos.x;
				return acc.setIn([y, x], this.props.currentShape.color);
		}

		render() {
				const {player, board, currentShape, shapeShouldDown, status } = this.props;
				const tab = currentShape.shape.reduce(this.reducerBoard, board);

				if (status == GameStatus.BEGINNING) {
						if ( player === 'host')
								return (<p style={Styles.boardStyle} > press enter </p>);
						else
								return (<p style={Styles.boardStyle} > waiting host </p>);
				}
				return (
						<div style={Styles.boardStyle} >
								{tab.map((row, y) => row.map( (elem, x) =>
										<div
												key={`${y}${x}`}
												style={Styles.blockStyle(elem)}
												onClick={() => shapeShouldDown()}
										>
												</div>
								)
								)}
										</div>
				)

		}
}

export default Board;
