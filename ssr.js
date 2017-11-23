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

const app = express();

const webConfig = webpackConfig({ platform: 'web', ssr: true });
const nodeConfig = webpackConfig({ platform: 'node', ssr: true });

const webCompiler = webpack(webConfig);
const nodeCompiler = webpack(nodeConfig);

webCompiler.outputFileSystem = fs;
nodeCompiler.outputFileSystem = fs;

const webMiddleware = webpackMiddleware(
  webCompiler,
  webConfig.devServer
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

function runNodeCompiler () {
  nodeCompiler.run((err, stats) => {
    if (compilerHasErrors(err, 'node')) return;
    logStatsErrorsAndWarnings(stats, 'node');

    console.log('webpack: node compiler initiating');
    console.log(stats.toString({
      assets: false,
      cached: false,
      children: false,
      chunks: false,
      colors: true,
      env: true,
      errorDetails: true,
      errors: true,
      modules: true,
      performance: true,
      timings: true,
      warnings: true,
    }));

    // const content = nodeCompiler.outputFileSystem.readFileSync(nodeCompiler.outputPath + '/node.main.js','utf8');
    // console.log('memory fs', fs.readdirSync(nodeCompiler.outputPath))

    // console.log('assets', Object.keys(stats.compilation.assets))
    const serv = stats.compilation.assets['node.main.js'].source();
    requireFromString(serv, './src/server.js');
  });
}

webCompiler.plugin('done', (stats, callback = runNodeCompiler) => {
  logStatsErrorsAndWarnings(stats, 'web');
  console.log('web compiler finished, running node compiler...');
  callback();
});
