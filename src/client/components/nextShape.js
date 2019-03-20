import React from 'react';
import * as Styles from './nextShape.css';

const NextShape = ({ shape }) => {
	return (
	<div style={Styles.nextShapeStyle}>
		<h2 style={Styles.title} > Next Shape </h2>
		<div style={Styles.boardStyle} >
			{shape.map((row, y) => row.map( (elem, x) =>
				<div
					key={`${y}${x}`}
					style={Styles.blockStyle(elem)}
				/>
			)
			)}
		</div>
	</div>
);
}
export default NextShape;
