/* eslint-disable */
require("babel-register");

import express from 'express';
import path from 'path';
import requireFromString from 'require-from-string';
import webpack from 'webpack';
import webpackConfig from './webpack.config.babel.js';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackMiddleware from 'webpack-dev-middleware';
import fs from './src/memoryFs';
import * as fsMethods from './src/bin/fileSystemMethods';

const app = express();

function getCompiler (ssrCompiler, type = 'web') {
  return ssrCompiler.compilers.find(
    compiler => compiler.name === type
  );
}

const webConfig = webpackConfig({ platform: 'web', ssr: true });
const nodeConfig = webpackConfig({ platform: 'node', ssr: true });

const ssrCompiler = webpack([webConfig, nodeConfig]);
ssrCompiler.outputFileSystem = fs;

const webCompiler = getCompiler(ssrCompiler, 'web');
const nodeCompiler = getCompiler(ssrCompiler, 'node');

const webMiddleware = webpackMiddleware(
  webCompiler,
  webConfig.devServer
);

//console.log('web compiler', webCompiler)

app.use(webMiddleware);
app.use(webpackHotMiddleware(webCompiler));
app.use((req, res, next) => {
  // https://webpack.github.io/docs/node.js-api.html
  console.log('web dev server')
  next();
  // const assetsByChunkName = res.locals.webpackStats;//.toJson().assetsByChunkName
  //
  // console.log('assets chunk name', assetsByChunkName)
  // next();
  // doesnt work with multicompiler
	// res.send(`
  //   <html><head><title>My App</title>
  // 		${normalizeAssets(assetsByChunkName.main, '.css')}
  //     </head>
  //     <body>
  //       <div>helllllo noah</div><div id="root"></div>
  //       ${normalizeAssets(assetsByChunkName.runtime, '.js')}
  //   		${normalizeAssets(assetsByChunkName.main, '.js')}
  //     </body></html>
	// `);
});

//works for serving client bundle + hotreload, but not needed
// app.get('*', function response(req, res) {
//   console.log('in get')
//   const records = middleware.fileSystem.readFileSync(webConfig.recordsOutputPath)
//   console.log('client config',records)
//   // console.log('helloo',middleware.fileSystem)
//   res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/public/index.html')));
//   res.end();
// });




// works for separate nodeCompiler
// but doesnt have webCompiler stats in fs
// nodeCompiler.run((err, stats) => {
//   console.log('err', err)
//   // console.log('output path', nodeCompiler.outputPath);
//   // console.log('public path', nodeCompiler.publicPath);
//   const content = nodeCompiler.outputFileSystem.readFileSync(nodeCompiler.outputPath + '/node.main.js','utf8');
//   console.log('memory fs', fs.readdirSync(nodeCompiler.outputPath))
//
//   console.log('assets', Object.keys(stats.compilation.assets))
//   const serv = stats.compilation.assets['node.main.js'].source();
//   requireFromString(serv, './src/server.js');
//
// })



ssrCompiler.run((err, multiStats) => {
  console.log('err', err)
  // console.log('output path node', nodeCompiler.outputPath);
  // console.log('public path', nodeCompiler.publicPath);
  // const content = nodeCompiler.outputFileSystem.readFileSync(nodeCompiler.outputPath + '/node.main.js','utf8');



  // works with stats, but we need to access the filesystem to keep things DRY
  // const webAssets = multiStats.stats[0].toJson().assetsByChunkName;
  // const webAssetsCss = normalizeAssets(webAssets.main, '.css')
  // const webAssetsRuntime = normalizeAssets(webAssets.runtime, '.js');
  // const webAssetsScripts = normalizeAssets(webAssets.main, '.js');

  // works with memory file system
  // const { pwaManifestFileName, webManifest } = fsMethods.getManifest(webCompiler.outputPath);
  //
  // console.log('memory in ssr readdirsync', pwaManifestFileName, webManifest )
  // const webAssets = Object.values(webManifest)
  //   .map(file => file.includes('.css')
  //     ? fsMethods.getCssLinkString(file)
  //     : fsMethods.getJsScriptString(file)
  //   );
  //
  // console.log('web assets', webAssets)

  const serv = multiStats.stats[1].compilation.assets['node.main.js'].source();
  requireFromString(serv);


})

app.listen(webConfig.devServer.port);
