import React from 'react';
import { spectreStyle } from './spectre.css';

const Spectre = ({ spectre }) => {
		const elem = spectre.map((v, k) => (<p key={k}>key: {k} value {v}</p>) )
		return (
				<div style={spectreStyle} >
						{elem}
				</div>
		)
};

export default Spectre;
