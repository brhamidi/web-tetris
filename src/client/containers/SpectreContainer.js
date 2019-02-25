import { connect } from 'react-redux'
import Spectre from '../components/spectre'

const mapStateToProps = (state) => ({
		spectre: state.spectre
})

export default connect(mapStateToProps)(Spectre)
