
export const blockStyle = (elem, preview) => {
	const value = elem === undefined ? 'white' : elem

	return {
		border: 'solid black 1px',
		opacity: preview ? '0.2' : '1',
		borderRadius: '0px',
		width: '9%',
		height: '36px',
		backgroundColor: value
	};
};

export const boardStyle = {
	width: '600px',
	height: '800px',
	backgroundColor: '#F7F7F7',
	border: 'solid red 3px',
	display: 'flex',
	flexFlow: 'row wrap',
	justifyContent: 'center'
};
