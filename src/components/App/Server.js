/* eslint-disable */
// TODO: rename dir to App

import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import App from './index.js';

export class ServerApp extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <StaticRouter
          location={this.props.location}
          context={this.props.routerContext}
        >
          <App />
        </StaticRouter>
      </Provider>
    );
  }
}

export default ServerApp;
