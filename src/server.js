/* eslint-disable */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import templateFn from 'components/server';
import App from 'components/App/Server';
import express from 'express';
import Routes from 'components/Routes';
import serveIndex from 'serve-index';
import serveStatic from 'serve-static';
import path from 'path';
import { matchPath } from 'react-router-dom';
import createHistory from 'history/createMemoryHistory';
import storeCreator from 'store';
const history = createHistory();
const store = storeCreator(history);
import * as fsMethods from './bin/fileSystemMethods';
const server = express();

import http from 'http';

const distPath = path.resolve(process.cwd(), 'dist');
const publicPath = path.join(distPath, 'public');
console.log('public path', publicPath)
// console.log('memory fs in server', fs)

// get build files in dev and prod envs
// set to app.locals as they shouldnt change for every request
server.use(function(req, res, next) {
  const { pwaManifestFileName, webManifest } = fsMethods.getManifest(publicPath);

  res.locals.webAssets = fsMethods.normalizeAssets([
    pwaManifestFileName,
    ...Object.values(webManifest),
  ]);

  res.locals.webManifest = webManifest;

  next();
});


if (process.env.NODE_ENV === 'development') {
  server.use((req, res, next) => {
    if (req.url.includes('webpack_hmr')) {
      console.log('redirecting hmr');
      res.redirect('http://localhost:3001/__webpack_hmr')
    }
    if (req.url.includes('hot-update')) {
      console.log('redirecting to hotupdate', req.url)
      res.redirect(`http://localhost:3001/${req.url}`)
    }
    else {
      next();
    }
  })
  server.use(['/js', '/css'], (req, res, next) => {
    const file = fsMethods.readFileSync(path.join(publicPath, req.originalUrl))
    if (file) res.status(200).end(file);
    else next();
  })
} else {
  console.log('not in dev', process.env.NODE_ENV);
  // todo set this up for prod
  // server.use('/', serveIndex(process.cwd()))
  // server.use('/js', express.static(publicPath + '/public/js'), serveIndex(publicPath + '/public/js'))
}




server.get('*', (req, res) => {
  const routerContext = {};

  const html = ReactDOMServer.renderToString(
    <App
      history={history}
      store={store}
      routerContext={routerContext}
      location={req.url}
    />
  );
  const template = templateFn(html, res.locals.webAssets);

  // Check if the render result contains a redirect, if so we need to set
  // the specific status and redirect header and end the response
  if (routerContext.url) {
    res.status(301).setHeader('Location', routerContext.url);
    res.end();

    return;
  }
  console.log('routerContext.url', routerContext)

  // Checking is page is 404
  const status = routerContext.status === '404' ? 404 : 200;

  res.status(status).end(template);

});

console.log('Initiating listening on 3000');
export default http.createServer(server).listen(3000);
