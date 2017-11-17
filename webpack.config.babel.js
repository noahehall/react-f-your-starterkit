import deps from './package.json';
import optionsConfig from './config/optionsConfig';
import path from 'path';
import webpackConfig from './config/webpackConfig';
import webpackNodeExternals from 'webpack-node-externals';

/**
 * TODO
 https://github.com/danethurber/webpack-manifest-plugin
 delete webpack info plugin
 */

function mainOptions (type = 'web') {
  return {
    appSlogan: 'Creating the future, together',
    appTitle: 'Noah Edward Technologies Inc.',
    context: path.resolve(__dirname, '.'), // was '.'
    cssFilename: 'css/[name].[id].css',
    cssIncludeGrommet: false, // delete this
    dependencies: Object.keys(deps.dependencies),
    distDir: path.resolve(__dirname, 'dist'), // target directory
    env: process.env.NODE_ENV || 'development',
    htmlFilename: 'index.html',
    htmlTemplate: 'src/components/Layout/template.html.js',
    http2Server: false,
    isNode: type === 'node',
    isWeb: type === 'web',
    mainEntry: './src/index.js',
    port: 3000,
    publicPath: '/',
    sourceMap: true,
    styleLintConfigPath: path.resolve(__dirname, '.stylelintrc'),
    type,
    verbose: true,
    webpackBail: true,
    webpackBail: true,
    webpackDir: path.resolve(__dirname, '.'), // loaders + entries are resovled relative to this
  };
}

module.exports = () => webpackConfig(optionsConfig(mainOptions()));
