/* eslint-disable */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { ConnectedRouter, routerReducer as router, routerMiddleware } from 'react-router-redux';
import { initialState } from './initialState';
import thunk from 'redux-thunk';
import * as reducers from './logic/**/*reducer.js';

// import glob from 'glob';
//
// const reducers = glob.sync('./logic/**/*.reducers.js');
//
// console.log('reducers', reducers)
export default function storeCreator(history) {
  const useDevTools = !!(
    typeof window !== 'undefined'
    && ['production', 'test'].indexOf(process.env.NODE_ENV) === -1
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-underscore-dangle
  );

  /** setup redux devtools browser extension */
  const composeEnhancers = useDevTools
   ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-underscore-dangle
   : compose;

  return createStore(
    combineReducers(
      Object.assign(
        {},
        {router},
        ...Object.values(reducers).map(reducer => ({[reducer.name]: reducer}))
      )
    ),
    initialState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        thunk
      )
    )
  )
}
