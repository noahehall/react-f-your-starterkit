/* eslint-disable */

import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import App from './index.js';
import PropTypes from 'prop-types';
import React from 'react';

export class ClientApp extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <ConnectedRouter history={this.props.history}>
          <App />
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default ClientApp
