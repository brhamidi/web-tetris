import { connect } from 'react-redux'
import { shapeShouldDown, startGame, OnStart, OnTetrimino } from '../actions'
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
		loadInitialEvent: () => dispatch(OnTetrimino(ownProps.socket)),
		shapeShouldDown: () => dispatch(shapeShouldDown(ownProps.socket)),
		OnStart: () => getOnstart(dispatch, ownProps.socket, ownProps.player)
})

export default connect(
		mapStateToProps,
		mapDispatchToProps
)(Board)
