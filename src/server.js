/* eslint-disable */
// TODO: https://github.com/Raynos/http-framework#modules


import * as fsMethods from './bin/fileSystemMethods';
import express from 'express';
import http from 'http';
import path from 'path';
import reactHandler from 'components/Server/routeHandlers/reactHandler';
import setupPublicAssetsHandlers from 'components/Server/routeHandlers/setupPublicAssetsHandlers';
import setupServerMiddleware from 'components/Server/setupServerMiddleware';

const publicDir = process.env.PUBLIC_DIR;
const server = express();

setupServerMiddleware(server);
setupPublicAssetsHandlers(server, publicDir);

if (!process.env.EMIT_FILES) {
  console.log('files NOT emitted, setting up server locals with Memory FS');
  fsMethods.setupServer(server, publicDir)
}

server.get('*', [ reactHandler ]);

console.log(`Initiating node server on ${process.env.NODE_PORT}`);
export default http.createServer(server).listen(process.env.NODE_PORT);
