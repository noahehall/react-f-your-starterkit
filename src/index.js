/**
 * TODO
 https://github.com/google/web-starter-kit
 https://github.com/jantimon/favicons-webpack-plugin
 */
import Router from 'components/Router';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
function render (Component) {
  ReactDOM.render(
    <AppContainer><Component /></AppContainer>,
    document.getElementById('root')
  );
}

render(Router);

if (module && module.hot)
  module.hot.accept("components/Router", () =>
    render(require('components/Router').default)
  );
