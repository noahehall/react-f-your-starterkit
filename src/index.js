/* eslint-disable */
/**
 * TODO
 https://github.com/google/web-starter-kit
 */

import 'babel-polyfill';
import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App/Client';

import createHistory from 'history/createBrowserHistory';
import storeCreator from 'store';
// import { StaticRouter, matchPath } from 'react-router-dom';

const history = createHistory();
const store = storeCreator(history);


function render (Component) {
  console.log(process.env.SSR)
  // use hydrate if SSR https://github.com/facebook/react/blob/ffc9c37102bf31984827f3f5e5891b77c33eb7c1/CHANGELOG.md
  ReactDOM.render(
    <AppContainer>
      <Component history={history} store={store} />
    </AppContainer>,
    document.getElementById('root')
  );
}

render(App);

// echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
// https://stackoverflow.com/questions/26708205/webpack-watch-isnt-compiling-changed-files
if (module && module.hot)
  module.hot.accept('components/App/Client', () =>
    render(require('components/App/Client').default)
  );
