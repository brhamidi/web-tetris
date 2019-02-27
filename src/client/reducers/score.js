function calculatePoint(line)
{
	return (line + ((line - 1 > 0) ? calculatePoint(line - 1) : 0))
};

const score = (state = 0, action) => {
	switch (action.type) {
		case 'UPDATE_SCORE':
			return state + (calculatePoint(action.score) * 1000);
		default:
			return state;
	}
}

export default score;
