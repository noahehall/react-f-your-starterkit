/* eslint-disable */
import _eval from 'eval';
import express from 'express';
import path from 'path';
import requireFromString from 'require-from-string';
import webpack from 'webpack';
import webpackConfig from './webpack.config.babel.js';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import fse from 'fs-extra';

const
  EMIT_FILES = true,
  HOST = '0.0.0.0',
  NODE_IGNORE_CLIENT_HMR = false,
  NODE_PORT = 3000,
  NODE_SERVER_MAIN_FILE = 'node.main.js',
  SSR = true,
  WEB_PORT = 3001;

if (EMIT_FILES) {
  console.log('emptying ./dist directory & requiring memor-fs');
  fse.emptyDirSync('./dist');
  require('./src/bin/memoryFs').default;
}

function createConfig (type) {
  return webpackConfig({
    emitFiles: EMIT_FILES,
    host: HOST,
    platform: type,
    port: eval(`${type.toUpperCase()}_PORT`),
    ssr: SSR,
  });
}

const webConfig = createConfig('web');
const nodeConfig = createConfig('node');

const webCompiler = webpack(webConfig);
const nodeCompiler = webpack(nodeConfig);

[webCompiler, nodeCompiler].forEach(compiler => {
  compiler.apply(new webpack.ProgressPlugin({
    profile: false,
  }));

  if (global.FS) compiler.outputFileSystem = global.FS;
})

const clientHotReloadServer = express();
clientHotReloadServer.use(webpackDevMiddleware(
  webCompiler,
  webConfig.devServer
));
clientHotReloadServer.use(webpackHotMiddleware(webCompiler));
clientHotReloadServer.listen(webConfig.devServer.port);

function compilerHasErrors (err, type) {
  if (!err) return false;

  console.log(`${type} compiler has errors`)
  console.error(err.stack || err);
  if (err.details) {
    console.log(`${type} compiler error details`);
    console.error(err.details);
  }

  return true;
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
function getNodeCompilerIgnore() {
  // comment this to only update server code
  // however this will make the first request serve old code
  // and then hmr kicks in and applies latest update
  // https://github.com/es128/anymatch
  return NODE_IGNORE_CLIENT_HMR
    ? {
      ignored: path => {
        return path.includes('components/server') || path.endsWith('src')
          ? false
          : !path.includes('server.js');

      },
    }
    : {};
}

function runNodeCompiler () {
  nodeCompiler.watch(
    {
      ...getNodeCompilerIgnore(),
      aggregateTimeout: 500, // milliseconds
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
        console.log('webpack: node compiler initiating');
        console.log(stats.toString({
          assets: true,
          cached: false,
          children: false,
          chunks: false,
          colors: true,
          env: false,
          errorDetails: true,
          errors: true,
          modules: false,
          performance: false,
          timings: false,
          warnings: true,
        }));
        const startServer = (serverSource) => {
          server = _eval(serverSource, NODE_SERVER_MAIN_FILE, {}, true).default;
          server.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
              console.log('Address in use, retrying...');
              setTimeout(() => {
                server.close();
                server.listen(NODE_PORT, HOST);
              }, 1000);
            }
          })
        }

        const serverSource = stats.compilation.assets[NODE_SERVER_MAIN_FILE].source();
        if (server) {
          console.log(`restarting ${NODE_SERVER_MAIN_FILE}`)
          await server.close(() => startServer(serverSource));
        } else startServer(serverSource);
      }
    }
  );
}

let serverInitialized = false;
webCompiler.plugin('done', (stats) => {
  logStatsErrorsAndWarnings(stats, 'web');
  if (!serverInitialized) {
    console.log('Initializing node compiler');
    serverInitialized = true;
    runNodeCompiler();
  }
});
