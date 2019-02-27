import React from 'react';
import * as Styles from './spectre.css';

const Spectre = ({ spectre }) => {
	const elem = spectre.map((v, k) =>
		(<div style={Styles.blockStyle(v * 5)} key={k}/>) )

	return (
		<div style={Styles.spectreStyle} >
			<h2 style={Styles.title}> Opponent Spectrum </h2>
			<div style={Styles.boardStyle}>
				{elem}
			</div>
		</div>
	)
};

export default Spectre;
