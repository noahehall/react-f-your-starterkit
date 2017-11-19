// import { ConnectedRouter } from 'react-router-redux';
// import { Provider } from 'react-redux';
// import createHistory from 'history/createBrowserHistory';
// import Layout from 'components/Layout';
// import storeCreator from 'store';
// import React from 'react';
//
// const history = createHistory();
//
// export default class Router extends React.Component {
//   render () {
//     return (
//       <Provider store={storeCreator(history)}>
//         <ConnectedRouter history={history}>
//           <Layout />
//         </ConnectedRouter>
//       </Provider>
//     );
//   }
// }
//
//
//

//   <Redirect to={{
//     pathname: '/oops',
//     state: { from: this.props.location}
//   }}/> */}


/* eslint-disable */
import About from 'components/About';
import Canvas from 'components/Canvas';
import Home from 'components/Home';
import Oops from 'components/Oops';

export default [
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
  }
];
