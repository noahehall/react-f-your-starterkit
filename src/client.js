/* eslint-disable */
/**
 * TODO
 https://github.com/google/web-starter-kit
 */

import 'babel-polyfill';
import { AppContainer } from 'react-hot-loader';
import { render, hydrate } from 'react-dom';
import App from 'components/App/Client';
import createHistory from 'history/createBrowserHistory';
import React from 'react';
import storeCreator from 'store';

const history = createHistory();
const store = storeCreator(history);

const renderFunction = process.env.SSR === true
  ? hydrate
  : render;

function renderComponent (Component) {
  renderFunction(
    <AppContainer>
      <Component history={history} store={store} />
    </AppContainer>,
    document.getElementById('root')
  );
}

renderComponent(App);

// echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
// https://stackoverflow.com/questions/26708205/webpack-watch-isnt-compiling-changed-files
if (module && module.hot)
  module.hot.accept('components/App/Client', () =>
    renderComponent(require('components/App/Client').default)
  );
