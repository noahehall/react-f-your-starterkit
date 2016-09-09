import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory }  from 'react-router';
import routes from './routes';
import Page from './containers/page/page';
import Immutable from 'immutable';

import { Provider } from 'react-redux';
import configure from './store/configure';

const preloadedState = Immutable.fromJS(window.__PRELOADED_STATE__);

render(
  <Provider store={configure(preloadedState)} >
    <Router children={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('root')
);
