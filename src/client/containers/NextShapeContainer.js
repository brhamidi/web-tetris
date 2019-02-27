import { connect } from 'react-redux'
import NextShape from '../components/nextShape'

const mapStateToProps = (state) => ({
		shape: state.nextShape
})

export default connect(mapStateToProps)(NextShape)
