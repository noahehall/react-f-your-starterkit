import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import Layout from 'components/Layout';
import storeCreator from 'store';
import React from 'react';

const history = createHistory();

export default class Router extends React.Component {
  render () {
    return (
      <Provider store={storeCreator(history)}>
        <ConnectedRouter history={history}>
          <Layout />
        </ConnectedRouter>
      </Provider>
    );
  }
}
