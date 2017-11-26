/* eslint-disable */
// TODO: rename dir to App

import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import App from './index.js';


// staticrouter: https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/server-rendering.md
export class ServerApp extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <StaticRouter
          location={this.props.location}
          context={this.props.staticContext}
        >
          <App />
        </StaticRouter>
      </Provider>
    );
  }
}

export default ServerApp;
