
export const nextShapeStyle = {
	width: '15%',
	backgroundColor: 'black',
	display: 'flex',
	flexFlow: 'row wrap',
	justifyContent: 'center'
}

export const title = {
	color: 'white'
};

export const blockStyle = (elem) => {
	const borderColor = elem === undefined ? 'black' : 'white';

	return {
		width: '19%',
		height: '50px',
		backgroundColor: elem === undefined ? 'black' : elem,
		border: `solid ${borderColor} 1px`
	};

};

export const boardStyle = {
	display: 'flex',
	width: '80%',
	height: '350px',
	flexFlow: 'row wrap',
	justifyContent: 'center'
};
