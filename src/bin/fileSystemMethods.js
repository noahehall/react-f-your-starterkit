/* eslint-disable */
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
