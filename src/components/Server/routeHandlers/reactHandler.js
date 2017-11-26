/* eslint-disable */
import { matchPath } from 'react-router-dom';
import App from 'components/App/Server';
import createHistory from 'history/createMemoryHistory';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import storeCreator from 'store';
import templateFn from 'components/Server/template.html.js';

const store = storeCreator(createHistory());

export default function reactHandler (req, res, next) {
  const routerContext = {};

  const html = ReactDOMServer.renderToString(
    <App
      location={req.url}
      routerContext={routerContext}
      store={store}
    />
  );

  const template = templateFn(html, req.app.locals.webAssets);

  // Check if the render result contains a redirect, if so we need to set
  // the specific status and redirect header and end the response
  if (routerContext.url) {
    res.status(301).setHeader('Location', routerContext.url);
    res.end();

    return;
  }
  console.log('routerContext', routerContext)

  // Checking is page is 404
  const status = routerContext.status === '404' ? 404 : 200;

  res.status(status).end(template);
}
