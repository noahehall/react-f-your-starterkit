/* eslint-disable */
// TODO: rename dir to App

import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import ServerApp from './index.js';

export class App extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <StaticRouter history={this.props.history} location={this.props.url} context={this.props.routerContext}>
          <ServerApp />
        </StaticRouter>
      </Provider>
    );
  }
}

export default App;
