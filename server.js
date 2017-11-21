/* eslint-disable */
require("babel-register");

const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.babel.js');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const server = require('./src/server.js').default;

const app = express();
const clientConfig = webpackConfig();
const clientCompiler = webpack(clientConfig);


app.use(server)

const middleware = webpackMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });
app.use(middleware);
app.use(webpackHotMiddleware(clientCompiler));
// app.get('*', function response(req, res) {
//   const records = middleware.fileSystem.readFileSync(clientConfig.recordsOutputPath)
//   console.log('client config',records)
//   // console.log('helloo',middleware.fileSystem)
//   res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/public/index.html')));
//   res.end();
// });
app.listen(3000);
