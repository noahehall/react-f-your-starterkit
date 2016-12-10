import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'containers/app';
import Landing from 'containers/landing';
import NotFound from 'containers/notfound';
import Start from 'containers/start';

export default (
  <Route component={App} name='app' path='/'>
    <IndexRoute component={Landing} />
    <Route component={Start} name='Start' path='start' />
    <Route component={NotFound} name='404' path='*' />
  </Route>
);
