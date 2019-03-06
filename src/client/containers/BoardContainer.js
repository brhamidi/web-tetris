import { connect } from 'react-redux'
import { shapeShouldDown, startGame, OnStart, OnEvent, OncloseBoard, setStatusGame} from '../actions'
import Board from '../components/board'


const mapStateToProps = (state, ownProps) => ({
		status: state.status,
		player: ownProps.player,
		board: state.board,
		currentShape: state.currentShape
})

const getOnstart = (dispatch, socket, info) => {
		if (info === 'host')
				dispatch(startGame(socket));
		else
				dispatch(OnStart(socket));
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	OnStart: () => getOnstart(dispatch, ownProps.socket, ownProps.player)
})

export default connect(
		mapStateToProps,
		mapDispatchToProps
)(Board)
