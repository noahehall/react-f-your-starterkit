/* eslint-disable */
import { matchPath } from 'react-router-dom';
import AppSSR from 'components/App/Server';
import createHistory from 'history/createMemoryHistory';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import storeCreator from 'store';
import templateFn from 'components/Server/template.html.js';

const store = storeCreator(createHistory());

export default function reactHandler (req, res, next) {
  const staticContext = {};

  const html = ReactDOMServer.renderToString(
    <AppSSR
      location={req.url}
      staticContext={staticContext}
      store={store}
    />
  );

  const template = templateFn(html, req.app.locals.webAssets);

  // Check if the render result contains a redirect, if so we need to set
  // the specific status and redirect header and end the response
  if (staticContext.url) {
    res.status(staticContext.statusCode || 301).setHeader('Location', staticContext.url);
    res.end();

    return;
  }

  // Checking is page is 404
  const status = staticContext.statusCode === '404' ? 404 : 200;

  res.status(status).end(template);
}
