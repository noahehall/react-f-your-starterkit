/* eslint-disable */
import About from 'components/About';
import Canvas from 'components/Canvas';
import Home from 'components/Home';
import Oops from 'components/Oops';
import App from 'components/App';

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
        path: '*',
        exact: false,
        component: Oops,
        routes: [],
      },
    ]; //,
//   },
// ];
