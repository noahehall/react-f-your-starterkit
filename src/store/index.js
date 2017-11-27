/* eslint-disable */
// TODO: add seamless-immutable
import { ConnectedRouter, routerReducer as router, routerMiddleware } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import * as reducers from './api/**/*reducer.js';
import initialState from './initialState';
import thunk from 'redux-thunk';

export default function storeCreator(history) {
  const useDevTools = !!(
    typeof window !== 'undefined'
    && ['production', 'test'].indexOf(process.env.NODE_ENV) === -1
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  );

  /** setup redux devtools browser extension */
  const composeEnhancers = useDevTools
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

  const thisState = typeof window !== 'undefined' && window.__INIT_STATE__
    ? window.__INIT_STATE__
    : initialState;

  const updateReducerNames = (reducers) =>
    Object.keys(reducers).map(fileName => ({
      [fileName]: reducers[fileName]
    }));

  const store = createStore(
    combineReducers(
      Object.assign(
        {},
        {router},

        // rename reducers to each reducer's folder name
        ...updateReducerNames(reducers),
      )
    ),
    thisState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        thunk
      )
    )
  );

  return store;
}
