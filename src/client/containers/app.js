import React from 'react';

import Score from '../components/score';
import Spectre from '../components/spectre';
import NextShape from '../components/nextShape';
import BoardContainer from './BoardContainer';


import { List } from 'immutable';
import * as Styles from './app.css';

import io from "socket.io-client";

export default class App extends React.Component {
		constructor(props) {
				super(props);
		}

		render() {
				return (
						<div style={Styles.appStyle} >
								<div style={Styles.headerStyle} >
										<h3> tetris </h3>
								</div>
								<Score />
								<div style={Styles.infoOppStyle} > Info opponent </div>
								<NextShape index={1} />
								<BoardContainer />
								<Spectre />
						</div>
				);
		}
}
