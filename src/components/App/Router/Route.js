/* eslint-disable */
import { Route } from 'react-router-dom';
import React from 'react';

// https://reacttraining.com/react-router/web/example/route-config
// use this everywhere you need reactRouterDom.Route, then when
// sub routes are added to any route it'll work
export default function CustomRoute (route) {
  return (
    <Route
      exact={route.exact || false}
      path={route.path}
      render={props => (
        <route.component
          {...props}
          routes={route.routes || []}
        />
      )}
    />
  );
}
