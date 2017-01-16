require('node-globals').default({
  constants: Object.assign(
    { nodeOnline: process.env.NODE_ONLINE === 'true' }, require('./config.js').constants
  )
});

import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import configure from './store/configure';
import Immutable from 'seamless-immutable';
import React from 'react';
import routes from './routes';
import lz from 'lz-string';

const preloadedState = Immutable(JSON.parse(lz.decompress(window.__PRELOADED_STATE__)));

render(
  <Provider store={configure(preloadedState)} >
    <Router children={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('root')
);
