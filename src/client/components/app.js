import React from 'react';

import Board from './board';
import Score from './score';
import Spectre from './spectre';

import { List } from 'immutable';
import * as Styles from './app.css';

const list = List().set(19, undefined).map(e => List().set(9, undefined));

const App = () => (
		<div style={Styles.divStyle} >
				<div style={Styles.headerStyle} >
						<h3> tetris </h3>
				</div>
				<Score />
				<div style={Styles.infoOppStyle} > Info opponent </div>
				<div style={Styles.nextShape} > Next Shape </div>
				<Board list={list} />
				<Spectre />
				<div style={Styles.footerStyle} > Footer </div>
		</div>
);

export default App;
