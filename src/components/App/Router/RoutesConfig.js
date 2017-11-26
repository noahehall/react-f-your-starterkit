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
  //   component: App,
  //   routes: [
      {
        path: '/',
        exact: true,
        component: Home,
        routes: [],
      },
      {
        path: '/about',
        exact: false,
        component: About,
        routes: [],
      },
      {
        path: '/canvas',
        exact: false,
        component: Canvas,
        routes: [],
      },
      {
        path: '/oops',
        exact: false,
        component: Oops,
        routes: [],
      },
      {
        path: '*',
        exact: false,
        component: () => <Redirect to='/oops'/>,
        routes: [],
      },
    ]; //,
//   },
// ];
