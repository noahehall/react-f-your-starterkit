/* eslint-disable */
export default function publicAssetsHandler (req, res, next) {
  // TODO: handle all public assets here
  // TODO: need to get images e.g. from pwa.manifest.json
  // https://gist.github.com/kentbrew/763822
  if (req.url === '/favicon.ico') {
    // console.log('got request for favicon.ico');
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
    return ;
  } else next();
}
