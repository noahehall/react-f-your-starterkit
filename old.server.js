/* eslint-disable */
// const MemoryFS = require('memory-fs');
// const requireFromString = require('require-from-string');
//
// 
require("babel-register");
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.babel.js');


const app = express();
const serverConfig = webpackConfig();
const serverCompiler = webpack(serverConfig);

const outputPath = serverCompiler.outputPath;
const recordsPath = serverCompiler.recordsOutputPath
const fs = new MemoryFS();

serverCompiler.outputFileSystem = fs;
serverCompiler.run((err, stats) => {
    const statsJson = stats.toJson({
      assets: false,
      cached: false,
      cachedAssets: false,
      children: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      colors: false,
      entrypoints: true,
      env: false,
      errors: false,
      errorDetails: false,
      modules: false,
      providedExports: true,
      publicPath: false,
    })

    console.log(statsJson.entrypoints.main)
    //
    // const runtimePath = statsJson.entrypoints.main.assets[0];
    // const serverPath = statsJson.entrypoints.main.assets[1];
    // const fullNodePath = path.resolve(outputPath, serverPath);
    //
    // console.log('path', fullNodePath)
    //
    // // const dir = fs.readdirSync(outputPath + '/js');
    //
    // const contents = fs.readFileSync(fullNodePath, 'utf8');
    // //
    //  server = requireFromString(contents);

  // console.log('contents is', server)

  app.listen(3000);
  console.log('Server listening on port 3000!');

});
