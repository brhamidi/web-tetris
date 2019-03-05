import React from 'react'
import { GameStatus } from '../actions'

class Home extends React.Component {
	constructor (props) {
		super(props);
		this.state = { room: '', player: '' };
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		if (this.state.room !== '' && this.state.player !== '') {
			this.props.cb(this.state.room, this.state.player);
			window.location.hash = `#${this.state.room}[${this.state.player}]`;
		}
	}


	handleChange(event, value) {
		this.setState({[value] : event.target.value});
	}

	render() {
		return (
			<div>
				<h3> Home page </h3>
				{status !== GameStatus.IDLE &&
						<div> {status} </div>
				}
				<form onSubmit={this.handleSubmit}>
				room
				<input type="text" value={this.state.room} onChange={(e) => this.handleChange(e, 'room')} />
				player
				<input type="text" value={this.state.player} onChange={(e) => this.handleChange(e, 'player')} />
				<input type="submit" value="Submit" />
				</form>
			</div>
		)
	};
}

export default Home;
