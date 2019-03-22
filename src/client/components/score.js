import React from 'react';
import * as Styles from './score.css';

const Score = ({ score, name}) => (
	<div style={Styles.scoreStyle} >
		<p> Score: {score}</p>
		<p> Player name: {name}</p>
	</div>
);

export default Score;
