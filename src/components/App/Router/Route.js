/* eslint-disable */
import { Route } from 'react-router-dom';
import React from 'react';

// https://reacttraining.com/react-router/web/example/route-config
export default function CustomRoute (route) {
  const renderRoute = (props) => (
    <route.component
      {...props}
      routes={route.routes || []}
    />
  );

  return (
    <Route
      exact={route.exact || false}
      path={route.path}
      render={renderRoute}
    />
  );
}
