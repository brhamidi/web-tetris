import React from 'react';

import Score from '../components/score';
import Spectre from '../components/spectre';
import NextShape from '../components/nextShape';
import BoardContainer from './BoardContainer';

import { setStatusGame, GameStatus, setInfo} from '../actions';

import { connect } from 'react-redux';

import { List } from 'immutable';
import * as Styles from './app.css';

import io from "socket.io-client";

const mapStateToProps = state => {
		return {
				info: state.info,
				status: state.status
		}
}

const socket = io.connect("http://localhost:3000");

class App extends React.Component {
		constructor(props) {
				super(props);
				const initialDispatch = this.getInfo(this.props.dispatch);
				initialDispatch(socket);
		}

		getInfo(dispatch) {
				const url = window.location.hash.slice(1);
				const split1 = url.split(']');
				if (split1[1] == '' && split1[2] == undefined) {
						const split2 = split1[0].split('[');
						if (split2[2] == undefined && split2[0] && split2[1]) {
								const room = split2[0];
								const player = split2[1];
								return () => dispatch(setInfo(socket, room, player));
						}
						return () => dispatch(setStatusGame(GameStatus.ERROR));
				}
				return () => dispatch(setStatusGame(GameStatus.ERROR));
		}

		render() {
				// TODO  a parametric component for error message
				if (this.props.status == GameStatus.ERROR)
						return <h2> Error .. </h2>;
				if (this.props.status == GameStatus.LOADING)
						return <h2> Loading .. </h2>;
				if (this.props.info == 'full')
						return <h2> Session Full </h2>;
				if (this.props.info == 'started')
						return <h2> Game still already </h2>;
				return (
						<div style={Styles.appStyle} >
								<div style={Styles.headerStyle} >
										<h3> tetris </h3>
								</div>
								<Score />
								<div style={Styles.infoOppStyle} >
										Info opponent: {this.props.info}
								</div>
								<NextShape index={1} />
								<BoardContainer
										player={this.props.info}
										socket = {socket}
								/>
								<Spectre />
						</div>
				);
		}
}

export default connect(mapStateToProps)(App);
