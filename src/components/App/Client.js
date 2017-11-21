/* eslint-disable */
// TODO: rename dir to App

import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import ClientApp from './index.js';

export class App extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <ConnectedRouter history={this.props.history}>
          <ClientApp />
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
