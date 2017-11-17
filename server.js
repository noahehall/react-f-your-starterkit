const express = require('express');
const webpack = require('webpack');
const path = require('path');
const requireFromString = require('require-from-string');
const MemoryFS = require('memory-fs');
const serverConfig = require('./server.webpack.babel.js');
const fs = new MemoryFS();
const outputErrors = (err, stats) => {
    if (err) {
         console.error(err.stack || err);
         if (err.details) {
              console.error(err.details);
         }
         return;
    }

    const info = stats.toJson();
    if (stats.hasErrors()) {
        console.error(info.errors);
    }
    if (stats.hasWarnings()) {
        console.warn(info.warnings);
    }
};
console.log('Initializing server application...');
const app = express();
console.log('Compiling bundle...');
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = fs;
serverCompiler.run((err, stats) => {
    outputErrors(err, stats);
    const contents = fs.readFileSync(path.resolve(serverConfig.output.path, serverConfig.output.filename), 'utf8');
    const server = requireFromString(contents, serverConfig.output.filename);
    app.get('*', server.default);
    app.listen(3000);
    console.log('Server listening on port 3000!');
});
