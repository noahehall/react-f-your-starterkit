/* eslint-disable */
import React from 'react';
import Route from './Route';
import RoutesConfig from './RoutesConfig';
import { Switch } from 'react-router-dom';

export default function Router () {
  return (
    <Switch>
      {
        RoutesConfig.map(route =>
          <Route {...route} key={route.path} />
        )
      }
    </Switch>
  );
}
