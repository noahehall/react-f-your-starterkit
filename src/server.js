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
// import * as fsMethods from './bin/fileSystemMethods';
const server = express();

const publicPath = path.resolve(process.cwd(), 'dist');
console.log('public path', publicPath)
// console.log('memory fs in server', fs)
// server.use('/', express.static(publicPath), serveIndex(publicPath))
// server.use('/js', express.static(publicPath + '/public/js'), serveIndex(publicPath + '/public/js'))

server.use(function(req, res, next) {
  // const { pwaManifestFileName, webManifest } = fsMethods.getManifest(publicPath + '/public');
  //
  // console.log('memory in ssr readdirsync', pwaManifestFileName, webManifest )
  // const webAssets = Object.values(webManifest)
  //   .map(file => file.includes('.css')
  //     ? fsMethods.getCssLinkString(file)
  //     : fsMethods.getJsScriptString(file)
  //   );
  //
  // console.log('web assets', webAssets)

  next();
})
server.get('*', (req, res) => {
  console.log(
    'made it in',
    res.locals
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
  console.log('routerContext.url', routerContext)

  // Checking is page is 404
  const status = routerContext.status === '404' ? 404 : 200;

  res.status(status).send(template);

});

server.listen(3000);
console.log('listening on 3000');
