import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory }  from 'react-router';
import routes from './routes';
import Page from './containers/page/page';

import { Provider } from 'react-redux';
import configure from './store/configure';

render(
  <Provider store={configure()} >
    <Router children={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('root')
);
