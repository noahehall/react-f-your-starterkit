/**
 * TODO
 https://github.com/google/web-starter-kit
 */

import 'babel-polyfill';
import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';

import createHistory from 'history/createBrowserHistory';
import storeCreator from 'store';

const history = createHistory();
const store = storeCreator(history);


function render (Component) {
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
  module.hot.accept('components/App', () =>
    render(require('components/App').default)
  );
