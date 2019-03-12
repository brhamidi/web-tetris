import React, { useState } from 'react'
import { GameStatus } from '../actions'

const Home = ({ status, cb }) => {
	const [room, setRoom] = useState('');
	const [player, setPlayer] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (room !== '' && player !== '') {
			cb(room, player);
			window.location.hash = `#${room}[${player}]`;
		}
	}

	return (
		<div>
			{status}
			<h3> Home Page </h3>
			<form onSubmit={handleSubmit}>
				<label> room </label>
				<input
					type="text"
					value={room}
					onChange={(e) => setRoom(e.target.value)}
				/>
				<label> player </label>
				<input
					type="text"
					value={player}
					onChange={(e) => setPlayer(e.target.value)}
				/>
				<input type="submit" value="Submit" />
			</form>
		</div>
	)
}

export default Home;
