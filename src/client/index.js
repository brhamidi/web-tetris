import React from 'react';
import ReactDOM from 'react-dom';

import io from 'socket.io-client';

import App from './components/app';

ReactDOM.render(
  <App />,
  document.getElementById('tetris')
);
