/* eslint-disable */
import { ConnectedRouter, routerReducer as router, routerMiddleware } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { initialState } from './initialState';
import * as reducers from './api/**/*reducer.js';
import thunk from 'redux-thunk';

// https://webpack.js.org/api/module-methods/#import-
// https://github.com/gaearon/react-hot-loader/issues/413
// https://webpack.js.org/api/hot-module-replacement/
// https://github.com/gaearon/redux-devtools/issues/24
// https://github.com/reactjs/redux/blob/98ab1de4df0da56bd1f95e1d2b3a7bec765127c7/examples/todomvc/containers/App.js#L8
// https://webpack.js.org/guides/dependency-management/#require-context
// https://webpack.github.io/docs/context.html
// https://github.com/presidenten/webpack-context-hmr
// https://webpack.github.io/docs/hot-module-replacement.html
// var cache = {};
// var cachek = {}
// function importAll (r) {
//   r.keys().forEach(key => {
//     cache[key] = {
//       module: r(key).default,
//       id: r.id,
//       resolve: r.resolve(key),
//     }
//
//     cachek[key] = r(key).default;
//
//   });
// }

// importAll(require.context('.', true, /reducer\.js$/));

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

  const updateReducerNames = (reducers) =>
    Object.values(reducers).map(reducer => ({
      [reducer.name]: reducer
    }));

  const store = createStore(
    combineReducers(
      Object.assign(
        {},
        {router},

        // rename reducers to each reducer's default function name
        // this requires that each reducer exports a default function
        ...updateReducerNames(reducers),
      )
    ),
    initialState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        thunk
      )
    )
  );

  // https://github.com/reactjs/react-redux/releases/tag/v2.0.0
  // https://github.com/reactjs/react-redux/issues/259
  // if (module && module.hot) {
  //   // const reducerConfig = Object.keys(cachek).map(key => [
  //   //   key,
  //   //   `./api/${key}/reducer.js`,
  //   // ]);
  //
  //   // const getHotReducers = () => reducerConfig
  //   //   .map(config => ({
  //   //     [config[0]]: import( /* webpackMode: "lazy-once" */'./api/' + config[0] + '/reducer.js').then(mod => mod)
  //   //   }))
  //   //   .reduce((a, b) => Object.assign(a, b));
  //   // importAll(require.context('.', true, /reducer\.js$/));
  //
  //   console.log(
  //     'cache keys',
  //     cache,
  //     cachek,
  //
  //   )
  //
  //
  //   module.hot.accept(Object.keys(cachek), (file) => {
  //     console.log('got inside')
  //     // importAll(require.context('.', true, /reducer\.js$/));
  //     console.log('file is', file)
  //       store.replaceReducer(updateReducerNames(cachek));
  //     }
  //    );
  // }

  return store
}
