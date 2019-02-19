
export const blockStyle = (elem) => {
		return {
				border: 'solid black 1px',
				width: '9%',
				height: '36px',
				backgroundColor: elem === undefined ? 'white' : elem
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
