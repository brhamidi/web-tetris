import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'; 

import App from './containers/app'
import rootReducer from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(
		applyMiddleware(ReduxThunk)
));

ReactDOM.render(
		<Provider store={store}>
				<App />
		</Provider>,
		document.getElementById('tetris')
);
