/* eslint-disable */
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import App from './index.js';
import PropTypes from 'prop-types';
import React from 'react';

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
