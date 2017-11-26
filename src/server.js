/* eslint-disable */
import * as fsMethods from './bin/fileSystemMethods';
import express from 'express';
import http from 'http';
import path from 'path';
import serveIndex from 'serve-index';
import serveStatic from 'serve-static';
import reactHandler from 'components/Server/routeHandlers/reactHandler';
import publicAssetsHandler from 'components/Server/routeHandlers/publicAssetsHandler';

const distPath = path.resolve(process.cwd(), 'dist');
const publicPath = path.join(distPath, 'public');

const {
  indexHtml,
  pwaManifest,
  pwaManifestFileName,
  webManifest,
} = fsMethods.getManifest(publicPath);

const server = express();

server.locals.webAssets = fsMethods.normalizeAssets([
  pwaManifestFileName,
  ...Object.values(webManifest),
]);
server.locals.webManifest = webManifest;
server.locals.pwaManifest = pwaManifest;
server.locals.indexHtml = indexHtml;
server.use(publicAssetsHandler);

if (process.env.NODE_ENV === 'development') {
  server.get('/pwa.manifest.json', (req, res, next) => {
    res.status(200).end(server.locals.pwaManifest);
    return;
  })
  // TODO: need to get /manifest.json
  server.use(['/js', '/css'], (req, res, next) => {
    const file = fsMethods.readFileSync(path.join(publicPath, req.baseUrl, req.path))
    if (file) res.status(200).end(file);
    // TODO: should be 404
    else next();
  })
} else {
  console.log('not in dev', process.env.NODE_ENV);
  // todo set this up for prod
  // server.use('/', serveIndex(process.cwd()))
  // server.use('/js', express.static(publicPath + '/public/js'), serveIndex(publicPath + '/public/js'))
}

server.get('*', [ reactHandler ]);

console.log(`Initiating node server on ${process.env.NODE_PORT}`);
export default http.createServer(server).listen(process.env.NODE_PORT);
