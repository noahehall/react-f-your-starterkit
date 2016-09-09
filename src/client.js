import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory }  from 'react-router';
import routes from './routes';
import Page from './containers/page/page';

render(
    <Router children={routes} history={browserHistory} />,
  document.getElementById('root')
);
