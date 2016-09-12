//https://github.com/jarredwitt/react-boilerplate/blob/master/app/store/store.jsx
import { compose, createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk';
import * as reducers from '../reducers';

export default (initialState) => {
  //console.log('init state', initialState);
  const isProd = process.env.NODE_ENV === "production";
  const reduxTools = !isProd &&
    typeof window !== 'undefined' &&
    window.devToolsExtension ?
      window.devToolsExtension() :
      (f) => f;

  return createStore(
    combineReducers(reducers),
    initialState,
    compose(
      applyMiddleware(thunk),
      reduxTools
    )
  );
};
