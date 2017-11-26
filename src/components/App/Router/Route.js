/* eslint-disable */
import { Route } from 'react-router-dom';
import React from 'react';

// https://reacttraining.com/react-router/web/example/route-config
// use this everywhere you need reactRouterDom.Route, then when
// sub routes are added to any route it'll work
export default function CustomRoute (route) {
  return (
    <Route
      {...route}
      exact={route.exact || false}
      path={route.path}
      render={props => {
        if (props.staticContext) {
          if (route.statusCode) props.staticContext.statusCode = route.statusCode;
          if (route.redirectToUrl) props.staticContext.url = route.redirectToUrl;
        }

        return (
          <route.Component
            {...props}
            routes={route.routes || []}
          />
        );
      }}
    />
  );
}
