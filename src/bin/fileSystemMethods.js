/* eslint-disable */
const fs = process.env.NODE_ENV === 'development'
  ? global.FS
  : require('fs').default;

export function getCssLinkString (path) {
  return `<link rel="stylesheet" type="text/css" href="${path}" />`;
}

export function getJsScriptString (path) {
  return `<script src="${path}"></script>`;
}

export function normalizeAssets (assets, filter = false) {
  const thisAssets = Array.isArray(assets) ? assets : [assets];

  switch (filter) {
    case '.css': {
      return thisAssets
        .filter(path => path.endsWith('.css'))
        .map(path => getCssLinkString(path))
        .join('\n')
    }

    case '.js': {
      return thisAssets
        .filter(path => path.endsWith('.js'))
        .map(path => getJsScriptString(path))
        .join('\n')
    }

    default: return thisAssets;
  }
}

export function getManifest (path) {
  const pwaManifestFileName = fs.readdirSync(path).find(name => name.includes('manifest'));

  const webManifestFileName = fs.readdirSync(path + '/js').find(name => name.includes('manifest'));

  const pwaManifest = fs.readFileSync(`${path}/${pwaManifestFileName}`, 'utf8');
  const webManifest =  JSON.parse(fs.readFileSync(`${path}/js/${webManifestFileName}`, 'utf8'));

  return {
    pwaManifest,
    webManifest,
    pwaManifestFileName,
    webManifestFileName,
  };
}
