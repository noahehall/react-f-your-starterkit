/* eslint-disable */
require("babel-register");

import express from 'express';
const path = require('path');
const app = express();

/// works but we need to compile with webpack
// const server = require('./src/server.js').default;
//app.use(server)


function normalizeAssets(assets) {
  return Array.isArray(assets) ? assets : [assets]
}

const webpack = require('webpack');
const webpackConfig = require('./webpack.config.babel.js');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

// const clientConfig = webpackConfig();
// const clientCompiler = webpack(clientConfig);
// const clientMiddleware = webpackMiddleware(clientCompiler, {
//   publicPath: clientConfig.output.publicPath,
//   contentBase: clientConfig.contentBase,
//   serverSideRender: true,
//   stats: {
//     colors: true,
//     hash: false,
//     timings: true,
//     chunks: false,
//     chunkModules: false,
//     modules: false
//   }
// });
// app.use(clientMiddleware);
// app.use((req, res) => {
//   const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName
//
//   console.log('assets chunk name', assetsByChunkName)
//
// 	res.send(`
//     <html><head><title>My App</title>
//   		${
//   			normalizeAssets(assetsByChunkName.main)
//   			.filter(path => path.endsWith('.css'))
//   			.map(path => `<link rel="stylesheet" type="text/css" href="${path}" />`)
//   			.join('\n')
//   		}
//       </head>
//       <body>
//         <div>helllllo noah</div><div id="root"></div>
//         ${
//     			normalizeAssets(assetsByChunkName.runtime)
//     			.filter(path => path.endsWith('.js'))
//     			.map(path => `<script src="${path}"></script>`)
//     			.join('\n')
//     		}
//     		${
//     			normalizeAssets(assetsByChunkName.main)
//     			.filter(path => path.endsWith('.js'))
//     			.map(path => `<script src="${path}"></script>`)
//     			.join('\n')
//     		}
//       </body></html>
// 	`);
// });
// works for serving client bundle + hotreload, but not needed
// app.get('*', function response(req, res) {
//   const records = middleware.fileSystem.readFileSync(clientConfig.recordsOutputPath)
//   console.log('client config',records)
//   // console.log('helloo',middleware.fileSystem)
//   res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/public/index.html')));
//   res.end();
// });
//
// app.use(webpackHotMiddleware(clientCompiler));

const MemoryFS = require("memory-fs");
const fs = new MemoryFS();
const requireFromString = require('require-from-string');
const serverConfig = webpackConfig({ platform: 'node' });
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = fs;

// const serverMiddleware = webpackMiddleware(serverCompiler, {
//   publicPath: serverConfig.output.publicPath,
//   contentBase: serverConfig.contentBase,
//   serverSideRender: true,
//   stats: {
//     colors: true,
//     hash: false,
//     timings: true,
//     chunks: false,
//     chunkModules: false,
//     modules: false
//   }
// });
// app.use(serverMiddleware)

serverCompiler.run((err, stats) => {
  console.log('err', err)
//   console.log('output path', serverCompiler.outputPath);
//   console.log('public path', serverCompiler.publicPath);
//   const content = serverCompiler.outputFileSystem.readFileSync(serverCompiler.outputPath + '/node.main.js','utf8');

  const serv = stats.compilation.assets['node.main.js'].source();
  const server = requireFromString(serv, './src/server.js');

})
// app.get('*', (req, res) => {
//   console.log('inside', res.locals.webpackStats.toJson());
//
//   res.send('hello')
// })
