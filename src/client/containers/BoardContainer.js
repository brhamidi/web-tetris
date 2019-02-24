import { connect } from 'react-redux'
import { shapeDown, startGame, OnStart } from '../actions'
import Board from '../components/board'

const mapStateToProps = (state, ownProps) => ({
		status: state.status,
		player: ownProps.player,
		board: state.board,
		currentShape: state.currentShape
})

const mapDispatchToProps = (dispatch, ownProps) => ({
		shapeDown: shape => dispatch(shapeDown(shape)),
		OnPressEnter: () => dispatch(startGame(ownProps.socket)),
		OnStart: () => dispatch(OnStart(ownProps.socket))
})

export default connect(
		mapStateToProps,
		mapDispatchToProps
)(Board)
