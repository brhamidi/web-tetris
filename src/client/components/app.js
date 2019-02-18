import React from 'react';

import Board from './board';
import Score from './score';
import Spectre from './spectre';

import { List } from 'immutable';

const list = List().set(19, undefined).map(e => List().set(9, undefined));

const App = () => (
		<div>
				<h3> tetris </h3>
				<Score />
				<Board list={list} />
				<Spectre />
		</div>
);

export default App;
