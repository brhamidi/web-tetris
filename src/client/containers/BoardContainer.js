import { connect } from 'react-redux'
import { shapeShouldDown, startGame, OnStart, OnTetrimino } from '../actions'
import Board from '../components/board'

const mapStateToProps = (state, ownProps) => ({
		status: state.status,
		player: ownProps.player,
		board: state.board,
		currentShape: state.currentShape
})

const mapDispatchToProps = (dispatch, ownProps) => ({
		loadInitialEvent: () => dispatch(OnTetrimino(ownProps.socket)),
		shapeShouldDown: (shape, board) => dispatch(shapeShouldDown(shape, board, ownProps.socket)),
		OnPressEnter: () => dispatch(startGame(ownProps.socket)),
		OnStart: () => dispatch(OnStart(ownProps.socket))
})

export default connect(
		mapStateToProps,
		mapDispatchToProps
)(Board)
