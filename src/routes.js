import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App.js';

export default (
    <Route name="app" component={App} path="/">
      <IndexRoute component={App} />
    </Route>
);
