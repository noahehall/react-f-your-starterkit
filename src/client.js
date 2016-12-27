const setGlobals = require('node-globals').default;
setGlobals({
  yourConstants: {
    appVersion: Number(process.env.APP_VERSION),
    dbName: process.env.IDB_NAME || null,
    idb: Number(process.env.APP_VERSION) && process.env.IDB_NAME && process.env.INITIAL_IDB_STORE,
    initialStore: process.env.INITIAL_IDB_STORE || null,
    isProd: process.env.NODE_ENV === 'production',
    nodeOnline: process.env.NODE_ONLINE === 'true',
    rollbarKeyClient: process.env.ROLLBAR_CLIENT_KEY || null,
    rollbarKeyServer: process.env.ROLLBAR_SERVER_KEY || null,
  }
});

import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import configure from './store/configure';
import Immutable from 'seamless-immutable';
import React from 'react';
import routes from './routes';

const preloadedState = Immutable(window.__PRELOADED_STATE__);

render(
  <Provider store={configure(preloadedState)} >
    <Router children={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('root')
);
