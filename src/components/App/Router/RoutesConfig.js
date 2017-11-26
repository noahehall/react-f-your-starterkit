/* eslint-disable */
import { Redirect } from 'react-router-dom';
import About from 'components/About';
import App from 'components/App';
import Canvas from 'components/Canvas';
import Home from 'components/Home';
import Oops from 'components/Oops';
import React from 'react';

export default [
  // {
  //   Component: App,
  //   routes: [
      {
        path: '/',
        exact: true,
        Component: Home,
        routes: [],
      },
      {
        path: '/about',
        exact: false,
        Component: About,
        routes: [],
      },
      {
        path: '/canvas',
        exact: false,
        Component: Canvas,
        routes: [],
      },
      {
        path: '/oops',
        exact: false,
        Component: Oops,
        routes: [],
      },
      {
        path: '*',
        exact: false,
        statusCode: 301,
        redirectToUrl: '/oops',
        Component: () => <Redirect to='/oops' />,
        routes: [],
      },
    ]; //,
//   },
// ];
