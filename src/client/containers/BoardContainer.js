import { connect } from 'react-redux'
import { shapeDown } from '../actions'
import Board from '../components/board'

const mapStateToProps = (state, ownProps) => ({
		player: ownProps.player,
		board: state.board,
		currentShape: state.currentShape
})

const mapDispatchToProps = dispatch => ({
		shapeDown: shape => dispatch(shapeDown(shape))
})

export default connect(
		mapStateToProps,
		mapDispatchToProps
)(Board)
