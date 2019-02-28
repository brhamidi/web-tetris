import { connect } from 'react-redux'
import Spectre from '../components/spectre'
import { OnSpectreStart } from '../actions';

const mapStateToProps = (state) => ({
	mode: state.mode,
	spectre: state.spectre
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	OnStart: () => dispatch(OnSpectreStart(ownProps.socket))
});

export default connect(mapStateToProps, mapDispatchToProps)(Spectre)
