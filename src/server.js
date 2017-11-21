/* eslint-disable */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import templateFn from 'components/server';
import App from 'components/App/Server';
import express from 'express';
import Routes from 'components/Routes';

import { matchPath } from 'react-router-dom';
import createHistory from 'history/createMemoryHistory';
import storeCreator from 'store';
const history = createHistory();
const store = storeCreator(history);


const server = express();


server.use('/public', express.static('public'));


server.get('*', (req, res) => {
  console.log(
    'made it in'
  )
  const routerContext = {};

  const html = ReactDOMServer.renderToString(
    <App
      history={history}
      store={store}
      routerContext={routerContext}
      location={req.url}
    />
  );
  const template = templateFn(html);

  // Check if the render result contains a redirect, if so we need to set
  // the specific status and redirect header and end the response
  if (routerContext.url) {
    res.status(301).setHeader('Location', routerContext.url);
    res.end();

    return;
  }

  // Checking is page is 404
  const status = routerContext.status === '404' ? 404 : 200;

  res.status(status).send(template);

  //res.send(template);
});

server.listen(3000);
console.log('listening on 3000');
