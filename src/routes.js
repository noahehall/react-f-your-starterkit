import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Page from './containers/page/page.js';
import Main from './containers/main/main.js';
import Notfound from './containers/notfound/notfound.js';
import Start from './containers/start/start.js';

export default (
  <Route component={Page} name='app' path='/'>
    <IndexRoute component={Main} />
    <Route component={Start} name='Start' path='start' />
    <Route component={Notfound} name='404' path='*' />
  </Route>
);
