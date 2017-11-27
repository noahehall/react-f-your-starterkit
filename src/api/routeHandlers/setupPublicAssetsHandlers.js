/* eslint-disable */
import * as fsMethods from 'bin/fileSystemMethods';
import serveStatic from 'serve-static';

export function favicon (req, res, next) {
  // TODO: need to get images e.g. from pwa.manifest.json
  // https://gist.github.com/kentbrew/763822
  if (req.url === '/favicon.ico') {
    // console.log('got request for favicon.ico');
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
    return ;
  } else next();
}

export default function setupPublicAssetsHandler (server, publicDir) {
  if (process.env.EMIT_FILES) {
    // load indexhtml into memory
    server.locals.indexHtml = fsMethods.readFileSync(`${publicDir}/index.html`, 'utf8');
    server.use(serveStatic(publicDir, {
      extensions: false,
      fallthrough: true,
      index: false, // must be false to reach reactHandler
      redirect: true,
    }));
  }

  server.use(favicon);
}
