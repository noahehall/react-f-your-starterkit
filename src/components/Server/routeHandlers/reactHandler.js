/* eslint-disable */
import { matchPath } from 'react-router-dom';
import AppSSR from 'components/App/Server';
import createHistory from 'history/createMemoryHistory';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import storeCreator from 'store';

const store = storeCreator(createHistory());

export default function reactHandler (req, res, next) {
  const staticContext = {};

  const appHtml = ReactDOMServer.renderToString(
    <AppSSR
      location={req.url}
      staticContext={staticContext}
      store={store}
    />
  );
  const responseHtml = req.app.locals.indexHtml
    .replace('__SSR_APP__', appHtml)
    .replace('__SSR_STATE__', JSON.stringify(store.getState()).replace(/</g, '\\u003c'));
  // Check if the render result contains a redirect, if so we need to set
  // the specific status and redirect header and end the response
  if (staticContext.url)
    return res
      .status(staticContext.statusCode || 301)
      .set({
        'Cache-Control': 'public, max-age=600, s-maxage=1200',
        Location: staticContext.url,
      })
      .end(responseHtml);

  // Checking is page is 404

  return res.status(staticContext.statusCode || 200).end(responseHtml);
}
