/* eslint-disable */
// TODO: clean this shit up, most of this logic is irrelavent
const fs = process.env.EMIT_FILES === true
  ? require('fs-extra')
  : global.FS;

export function readFileSync (file, options = 'utf8') {
  return fs.readFileSync(file, options);
}

export function getCssLinkString (path) {
  return `<link rel="stylesheet" type="text/css" href="/${path}" />`;
}

export function getJsScriptString (path) {
  return `<script src="/${path}"></script>`;
}

export function getManifestLinkString (path) {
  return `<link rel="manifest" href="/${path}" />`;
}

export function normalizeAssets (assets) {

  const normalized = {
    css: [],
    json: [],
    jsFirst: [],
    jsSecond: [],
  }

  assets.forEach(path => {
    if (path.endsWith('.css'))
      normalized.css.push(getCssLinkString(path));

    else if (path.endsWith('.js')) {
      if (path.includes('runtime'))
        normalized.jsFirst.push(getJsScriptString(path));
      else
        normalized.jsSecond.push(getJsScriptString(path));
    }

    else if (path.endsWith('.json'))
      normalized.json.push(getManifestLinkString(path));

    else console.log(`Error in normializing asset: ${path} does not end in .js, .css, or .json`);
  });

  return normalized;
}

export function getManifest (path) {
  let indexHtml = fs.readdirSync(path).find(name => name.includes('.html'));

  if (indexHtml)
    indexHtml = fs.readFileSync(`${path}/${indexHtml}`, 'utf8');

  const pwaManifestFileName = fs.readdirSync(path).find(name => name.includes('pwa.manifest.json'));

  const webManifestFileName = fs.readdirSync(path + '/js').find(name => name.includes('manifest'));

  const pwaManifest = fs.readFileSync(`${path}/${pwaManifestFileName}`, 'utf8');

  const webManifest =  JSON.parse(fs.readFileSync(`${path}/js/${webManifestFileName}`, 'utf8'));

  return {
    indexHtml,
    pwaManifest,
    pwaManifestFileName,
    webManifest,
    webManifestFileName,
  };
}

export function setupServer (server) {
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
}
