
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
	return {
		border: 'solid black 1px',
		width: '19%',
		height: '50px',
		backgroundColor: elem === undefined ? 'white' : elem
	};

};

export const boardStyle = {
	display: 'flex',
	width: '80%',
	height: '350px',
	flexFlow: 'row wrap',
	justifyContent: 'center'
};
