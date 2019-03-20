
export const nextShapeStyle = {
	width: '400px',
	backgroundColor: 'black',
	display: 'flex',
	flexFlow: 'row wrap',
	justifyContent: 'center'
}

export const title = {
	color: 'white',
	width: '300px',
	textAlign: 'center'

};

export const blockStyle = (elem) => {
	const borderColor = elem === undefined ? 'black' : 'white';

	return {
		width: '50px',
		height: '50px',
		backgroundColor: elem === undefined ? 'black' : elem
	};

};

export const boardStyle = {
	display: 'flex',
	width: '200px',
	height: '200px',
	flexFlow: 'row wrap',
	justifyContent: 'center'
};
