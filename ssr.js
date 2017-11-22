/* eslint-disable */
require("babel-register");

import express from 'express';
import MemoryFS from "memory-fs";
import path from 'path';
import requireFromString from 'require-from-string';
import webpack from 'webpack';
import webpackConfig from './webpack.config.babel.js';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackMiddleware from 'webpack-dev-middleware';

const app = express();
const fs = new MemoryFS();

function normalizeAssets (assets) {
  return Array.isArray(assets) ? assets : [assets]
}

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
// console.log('webconfig', webConfig)
// console.log('ssr compiler', ssrCompiler)
// console.log('web compiler', ssrCompiler.compilers.find((compiler => compiler.name === 'web')))

const webMiddleware = webpackMiddleware(
  webCompiler,
  webConfig.devServer
  // {
  //   publicPath: webConfig.output.publicPath,
  //   contentBase: webConfig.contentBase,
  //   serverSideRender: true,
  //   stats: {
  //     colors: true,
  //     hash: false,
  //     timings: true,
  //     chunks: false,
  //     chunkModules: false,
  //     modules: false
  //   }
  // }
);

app.use(webMiddleware);
app.use((req, res, next) => {
  const assetsByChunkName = res.locals.webpackStats;//.toJson().assetsByChunkName

  console.log('assets chunk name', assetsByChunkName)
  next();
  // doesnt work with multicompiler
	// res.send(`
  //   <html><head><title>My App</title>
  // 		${
  // 			normalizeAssets(assetsByChunkName.main)
  // 			.filter(path => path.endsWith('.css'))
  // 			.map(path => `<link rel="stylesheet" type="text/css" href="${path}" />`)
  // 			.join('\n')
  // 		}
  //     </head>
  //     <body>
  //       <div>helllllo noah</div><div id="root"></div>
  //       ${
  //   			normalizeAssets(assetsByChunkName.runtime)
  //   			.filter(path => path.endsWith('.js'))
  //   			.map(path => `<script src="${path}"></script>`)
  //   			.join('\n')
  //   		}
  //   		${
  //   			normalizeAssets(assetsByChunkName.main)
  //   			.filter(path => path.endsWith('.js'))
  //   			.map(path => `<script src="${path}"></script>`)
  //   			.join('\n')
  //   		}
  //     </body></html>
	// `);
});
// works for serving client bundle + hotreload, but not needed
// app.get('*', function response(req, res) {
//   const records = middleware.fileSystem.readFileSync(webConfig.recordsOutputPath)
//   console.log('client config',records)
//   // console.log('helloo',middleware.fileSystem)
//   res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/public/index.html')));
//   res.end();
// });
//

app.use(webpackHotMiddleware(webCompiler));

// const serverMiddleware = webpackMiddleware(nodeCompiler, {
//   publicPath: nodeConfig.output.publicPath,
//   contentBase: nodeConfig.contentBase,
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

// works for server
nodeCompiler.run((err, stats) => {
  console.log('err', err)
  console.log('output path', nodeCompiler.outputPath);
  console.log('public path', nodeCompiler.publicPath);
  const content = nodeCompiler.outputFileSystem.readFileSync(nodeCompiler.outputPath + '/node.main.js','utf8');

  const serv = stats.compilation.assets['node.main.js'].source();
  const server = requireFromString(serv, './src/server.js');
  // const serv = multiStats.stats[1].compilation.assets['node.main.js'].source();
  // const server = requireFromString(serv, './src/server.js');
  //
  // // console.log('stats is', multiStats.stats[0].compilation.assets)

})


// this should go to ssr server
// doesnt work with ssr
// app.get('*', (req, res) => {
//   console.log('inside', res.locals.webpackStats); //.toJson());
//
//   res.send('hello')
// })

app.listen(3001);
