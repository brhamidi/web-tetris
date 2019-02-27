import { connect } from 'react-redux'
import Score from '../components/score'

const mapStateToProps = (state) => ({
		score: state.score
})

export default connect(mapStateToProps)(Score)
