import { connect } from 'react-redux'
import Spectre from '../components/spectre'

const mapStateToProps = (state) => ({
	mode: state.mode,
	spectre: state.spectre
})

export default connect(mapStateToProps)(Spectre)
