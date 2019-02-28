import React from 'react';
import * as Styles from './spectre.css';

const Spectre = ({ spectre, mode, OnStart }) => {
	const elem = spectre.map((v, k) =>
		(<div style={Styles.blockStyle(v * 5)} key={k}/>) )

	OnStart();
	if (mode.type === 'solo') {
		return (
		<div style={Styles.spectreStyle} >
			<h2 style={Styles.title}> Solo Mode </h2>
		</div>
		);
	}
	return (
		<div style={Styles.spectreStyle} >
			<h2 style={Styles.title}> [{mode.meta.name}] </h2>
			<div style={Styles.boardStyle}>
				{elem}
			</div>
		</div>
	)
};

export default Spectre;
