/**
 * TODO
 https://github.com/google/web-starter-kit
 https://github.com/jantimon/favicons-webpack-plugin
 */
import Router from 'components/Router';
import React from 'react';
import ReactDOM from 'react-dom';

function render (Component) {
  ReactDOM.render(
    <Component />,
    document.getElementById('root')
  );
}

render(Router);

if (module && module.hot) {
  module.hot.accept("components/Router", function renderModuleHot() {
      render(require('components/Router').default)
  });
}
