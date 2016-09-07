import React from 'react';
import ReactDOM from 'react-dom';
//import { Provider } from 'react-redux';
//import App from './containers/App';
import Page from './containers/page/page';
//import configureStore from './store/configureStore';

//  <Provider store={configureStore()}>
//  </Provider>,
ReactDOM.render(
    <Page />,
  document.getElementById('root')
);
