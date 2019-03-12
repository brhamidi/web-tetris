import React, { useEffect } from 'react';
import * as Styles from './spectre.css';

const Spectre = ({ OnStart, mode, spectre }) => {
	const elem = spectre.map((v, k) => (<div style={Styles.blockStyle(v * 5)} key={k}/>) )

	useEffect(() => {
		OnStart();
	}, []);

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
}

export default Spectre;
