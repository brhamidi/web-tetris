import React from 'react';
import * as Styles from './spectre.css';

class Spectre extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.OnStart();
	}

	render() {
		const { mode, spectre } = this.props;
		const elem = spectre.map((v, k) =>
			(<div style={Styles.blockStyle(v * 5)} key={k}/>) )

		if (mode.type === 'solo') {
			return (
				<div style={Styles.spectreStyle} >
					<h2 style={Styles.title}> Solo Mode </h2>
				</div>
			);
		}
		return (
			<div style={Styles.spectreStyle} >
				<h2 style={Styles.title}> [{mode.meta.name}] </h2>
				<div style={Styles.boardStyle}>
					{elem}
				</div>
			</div>
		)
	}
}

export default Spectre;

