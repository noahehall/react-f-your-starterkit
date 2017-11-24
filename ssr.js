/* eslint-disable */
require("babel-register");

import express from 'express';
import path from 'path';
import requireFromString from 'require-from-string';
import webpack from 'webpack';
import webpackConfig from './webpack.config.babel.js';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackDevMiddleware from 'webpack-dev-middleware';
import fs from './src/bin/memoryFs';
import _eval from 'eval';

const app = express();

const webConfig = webpackConfig({ platform: 'web', ssr: true });
const nodeConfig = webpackConfig({ platform: 'node', ssr: true });

const webCompiler = webpack(webConfig);
const nodeCompiler = webpack(nodeConfig);
const compilers = [webCompiler, nodeCompiler];
compilers.forEach(compiler => {
  compiler.apply(new webpack.ProgressPlugin({
    profile: true
  }));

  compiler.outputFileSystem = fs;
})

const webMiddleware = webpackDevMiddleware(
  webCompiler, webConfig.devServer
);


app.use(webMiddleware);
app.use(webpackHotMiddleware(webCompiler));
app.listen(webConfig.devServer.port);

function compilerHasErrors (err, type) {
  if (err) {
    console.log(`${type} compiler has errors`)
    console.error(err.stack || err);
    if (err.details) {
      console.log(`${type} compiler error details`);
      console.error(err.details);
    }

    console.log(`please fix errors and restart ${type}`);
    return true;
  }

  return false;
}

function logStatsErrorsAndWarnings (stats, type) {
  if (stats.hasErrors()) {
    console.log(`stats: ${type} compiler has errors`);
    console.error(stats.toString({ errors: true, colors: true}));
  }

  if (stats.hasWarnings()) {
    console.log(`stats: ${type} compiler has warnings`);
    console.warn(stats.toString({ warnings: true, colors: true}));
  }
}

let server = null;

function runNodeCompiler () {
  nodeCompiler.watch(
    {
      aggregateTimeout: 500, // milliseconds
      ignored: path => {
        return path.includes('components/server') || path.endsWith('src')
          ? false
          : !path.includes('server.js');

      }, // https://github.com/es128/anymatch
      poll: true,
    },
    async (err, stats) => {
      if (compilerHasErrors(err, 'node')) return;
      logStatsErrorsAndWarnings(stats, 'node');
      const statsJson = stats.toJson({
        modules: true,
        cached: false,
        chunks: false,
      })
      if (statsJson.modules.length) {
        console.log('node watch: stats json has built modules');
        console.log('webpack: node compiler initiating');
        console.log(stats.toString({
          assets: false,
          cached: false,
          children: false,
          chunks: false,
          colors: true,
          env: false,
          errorDetails: true,
          errors: true,
          modules: true,
          performance: true,
          timings: false,
          warnings: true,
        }));

        const startServer = (serverSource) => {
          server = _eval(serverSource, 'node.main.js', {}, true).default;
          server.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
              console.log('Address in use, retrying...');
              setTimeout(() => {
                server.close();
                server.listen(PORT, HOST);
              }, 1000);
            }
          })
        }

        const serverSource = stats.compilation.assets['node.main.js'].source();
        if (server) {
          console.log('restarting server')
          await server.close(() => startServer(serverSource));
        } else startServer(serverSource);
      }
    }
  );
}

let serverInitialized = false;
webCompiler.plugin('done', (stats, callback = runNodeCompiler) => {
  logStatsErrorsAndWarnings(stats, 'web');
  console.log('web compiler finished');
  if (serverInitialized) console.log('Node compiler already initialized')
  else {
    console.log('Initializing node compiler');
    serverInitialized = true;
    callback();
  }
});
