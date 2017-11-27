/* eslint-disable */
import * as fsMethods from './bin/fileSystemMethods';
import express from 'express';
import http from 'http';
import path from 'path';
import serveIndex from 'serve-index';
import serveStatic from 'serve-static';
import reactHandler from 'components/Server/routeHandlers/reactHandler';
import publicAssetsHandler from 'components/Server/routeHandlers/publicAssetsHandler';

const publicDir = process.env.PUBLIC_DIR;
const server = express();

server.use(publicAssetsHandler);

if (!process.env.EMIT_FILES) {
  console.log('files NOT emitted, setting up server locals with Memory FS');
  const {
    indexHtml,
    pwaManifest,
    pwaManifestFileName,
    webManifest,
  } = fsMethods.getManifest(publicDir);

  server.locals.webAssets = fsMethods.normalizeAssets([
    pwaManifestFileName,
    ...Object.values(webManifest),
  ]);
  server.locals.webManifest = webManifest;
  server.locals.pwaManifest = pwaManifest;
  server.locals.indexHtml = indexHtml;

  server.get('/pwa.manifest.json', (req, res, next) => {
    res.status(200).end(server.locals.pwaManifest);
    return;
  })
  server.use(['/js', '/css'], (req, res, next) => {
    const file = fsMethods.readFileSync(path.join(publicDir, req.baseUrl, req.path))
    if (file) res.status(200).end(file);
    // TODO: should be 404
    else next();
  })
} else {
  console.log('files emitted, setting up server locals and express static');
  server.use(serveStatic(publicDir, {
    extensions: false,
    fallthrough: true,
    index: false, // must be false to reach reactHandler
    redirect: true,
  }));
  // load indexhtml into memory
  server.locals.indexHtml = fsMethods.readFileSync(`${publicDir}/index.html`, 'utf8');

}

server.get('*', [ reactHandler ]);

console.log(`Initiating node server on ${process.env.NODE_PORT}`);
export default http.createServer(server).listen(process.env.NODE_PORT);
