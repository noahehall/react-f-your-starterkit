require('./.globals');
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import compression from 'compression';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import Helmet from 'react-helmet';
import Immutable from 'seamless-immutable';
// import path from 'path';
import React from 'react';
import routes from './routes';
import spdy from 'spdy';

// store
import { Provider } from 'react-redux';
import configure from './store/configure';
import initialState from './store/initialstate.js';

const port = 3000;

// https: only in production
const options = {
  cert: fs.readFileSync(`${__dirname}/server/localhost-cert.pem`),
  key: fs.readFileSync(`${__dirname}/server/localhost-key.pem`),
  plain: !appConsts.isProd,
  spdy: {
    plain: !appConsts.isProd,
    protocols: [ 'h2', 'spdy/3.1', 'spdy/3', 'spdy/2', 'http/1.1', 'http/1.0' ],
    ssl: appConsts.isProd
  }
};

function renderFullPage (html, preloadedState) {
  const head = Helmet.rewind();

  return `
    <!doctype html>
      <html ${head.htmlAttributes.toString()}>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${head.title}
        ${head.meta}
        ${head.link}
        ${head.script}
      </head>
      <body>
        <article id="root">${html}</article>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
        </script>
        <script src='/js/bundle.js' type='text/javascript'></script>
        <script src='/container.js' type='text/javascript'></script>
      </body>
    </html>
    `;
}

const app = express();
app.use(compression());
app.use(helmet());
app.use(express.static(`${__dirname}/public`));

const serviceWorkerFileOptions = {
  dotfiles: 'deny',
  headers: {
    'x-sent': true,
    'x-timestamp': Date.now(),
  },
  root: __dirname,
};

app.get('/container.js', (req, res) => {
  res.sendFile('./container.js', serviceWorkerFileOptions, (err) => {
    if (err) {
      appFuncs.console('error')(err);
      res.status(err.status).end();
    } else appFuncs.console()('Sent: container.js');
  });
});

app.get('/rootworker.js', (req, res) => {
  res.sendFile('./rootworker.js', serviceWorkerFileOptions, (err) => {
    if (err) {
      appFuncs.console('error')(err);
      res.status(err.status).end();
    } else appFuncs.console()('Sent: rootworker.js');
  });
});

app.get("*", (req, res) => {
  match({ location: req.url, routes }, (err, redirectLocation, renderProps) => {
    if (err) {
      appFuncs.console('error')(err);

      return res.status(500).end('Internal server error');
    }
    if (!renderProps) return res.status(404).end('Not found.');
    // setup store based on data sent in
    const store = configure(Immutable(initialState));

    const InitialComponent = ( // eslint-disable-line no-extra-parens
      <Provider store={store} >
        <RouterContext {...renderProps} />
      </Provider>
    );
    const html = renderToString(InitialComponent);

    return res.status(200).send(renderFullPage(html, store.getState()));
  });

  return true;
});

spdy.createServer(options, app)
  .listen(port, (error) => { // eslint-disable-line consistent-return
    if (error) {
      appFuncs.console('error')(`error occured starting server: ${error}`);

      return process.exit(1);
    }

    appFuncs.console('info', true)(`Server running: ${!appConsts.isProd ? 'http://127.0.0.1' : 'https://localhost'}:${port}`);
  });
