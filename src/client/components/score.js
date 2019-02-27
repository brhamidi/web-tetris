import React from 'react';
import * as Styles from './score.css';

const Score = ({score}) => (
	<div style={Styles.scoreStyle} >

		<p> Score: {score}</p>

	</div>
);

export default Score;
