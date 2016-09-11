import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Page from './containers/page/page.js';
import Main from './containers/main/main.js';

export default (
    <Route name="app" component={Page} path="/">
      <IndexRoute component={Main} />
    </Route>
);
