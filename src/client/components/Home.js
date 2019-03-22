import React, { useState, useEffect } from 'react'
import { GameStatus } from '../actions'

const Home = ({ status, cb, OnStart}) => {
	const [room, setRoom] = useState('');
	const [player, setPlayer] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (room !== '' && player !== '')
			cb(room, player);
	}

	const get_status_msg = (status)  => {
		switch (status) {
			case GameStatus.HOME:
				return '';
			case GameStatus.ERROR:
				return '';
			case GameStatus.LOADING:
				return '';
			case 'started':
				return 'This game is already started for this room'
			case 'full':
				return 'This room is full';
			case 'name':
				return 'This name is not available for this room';
			default:
				return '???';
		}
	}

	useEffect(() => {
		OnStart();
	}, [])

	return (
		<div>
			<div className="status">{get_status_msg(status)}</div>
			<h3 className="title">Home Page</h3>
			<form onSubmit={handleSubmit}>
				<label>room</label>
				<input className="room" required
					type="text"
					value={room}
					onChange={(e) => setRoom(e.target.value)}
				/>
				<label>player</label>
				<input className="player"
					type="text"
					value={player}
					onChange={(e) => setPlayer(e.target.value)}
				/>
				<input className="submit" type="submit" value="Submit" />
			</form>
		</div>
	)
}

export default Home;
