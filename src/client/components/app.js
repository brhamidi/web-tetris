import React from 'react';

import Score from './score';
import Spectre from './spectre';
import NextShape from './nextShape';
import BoardContainer from '../containers/BoardContainer';


import { List } from 'immutable';
import * as Styles from './app.css';

const App = () => (
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

export default App;
