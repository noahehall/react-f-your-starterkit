require('./.globals');
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import configure from './store/configure';
import Immutable from 'seamless-immutable';
import React from 'react';
import routes from './routes';

const preloadedState = Immutable(window.__PRELOADED_STATE__);

render(
  <Provider store={configure(preloadedState)} >
    <Router children={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('root')
);
