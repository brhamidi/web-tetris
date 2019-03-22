import React, { useEffect } from 'react';

import ScoreContainer from '../containers/ScoreContainer';
import SpectreContainer from '../containers/SpectreContainer';
import NextShapeContainer from './NextShapeContainer';
import BoardContainer from './BoardContainer';
import Home from '../components/Home';

import { setStatusGame, GameStatus, setInfo, OnGame } from '../actions';

import { connect } from 'react-redux';

import { List } from 'immutable';
import * as Styles from './app.css';

import io from "socket.io-client";

const socket = io("http://localhost:3000");

const getInfo = () => {
	const url = window.location.hash.slice(1);
	const split1 = url.split(']');

	if (window.location.hash === '')
		return setStatusGame(GameStatus.HOME);
	if (split1[1] === '' && split1[2] == undefined) {
		const split2 = split1[0].split('[');
		if (split2[2] == undefined && split2[0] && split2[1]) {
			const room = split2[0];
			const player = split2[1];
			return (setInfo(socket, room, player));
		}
		return (setStatusGame(GameStatus.ERROR));
	}
	return (setStatusGame(GameStatus.ERROR));
}

const mapStateToProps = state => ({
	info: state.info,
	status: state.status,
	gameList: state.gameList
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	OnStart: () => dispatch(getInfo()),
	HomeCb: (room, player) => dispatch(setInfo(socket, room, player)),
	HomeOnStart: () => dispatch(OnGame(socket))
})

const AppContainer = ({ info, status, OnStart, HomeCb, HomeOnStart, gameList }) => {
	useEffect(() => {
		OnStart();
	}, [])

	if (status === GameStatus.ERROR || status === GameStatus.LOADING || status === GameStatus.HOME ||
		(info !== 'host' && info !== 'player2')) {
		const curr_status =
			status === GameStatus.ERROR || status === GameStatus.LOADING || status === GameStatus.HOME ? status : info;
		return (
			<div style={Styles.appStyle} >
				<div style={Styles.headerStyle} >
					<h3> web - tetris </h3>
				</div>
				<Home
					status={curr_status}
					cb={HomeCb}
					OnStart={HomeOnStart}
					gameList={gameList}
				/>
			</div>
		)
	}
	return (
		<div style={Styles.appStyle} >
			<div style={Styles.headerStyle} >
				<h3> web - tetris </h3>
			</div>
			<ScoreContainer />
			<NextShapeContainer />
			<BoardContainer
				player={info}
				socket={socket}
			/>
			<SpectreContainer socket={socket} />
		</div>
	)

}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
