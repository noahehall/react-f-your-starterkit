/* eslint-disable */
import deps from './package.json';
import optionsConfig from './config/optionsConfig';
import path from 'path';
import webpackConfig from './config/webpackConfig';
import styleLintRules from './.stylelintrc.js';

/**
 * TODO
 https://github.com/danethurber/webpack-manifest-plugin
 delete webpack info plugin
 */

function mainOptions ({
  platform = 'web'
} = {}) {
  const getEntry = () => platform === 'web'
    ? './src/index.js'
    : './src/server.js';

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
    htmlTemplate: 'src/components/App/template.html.js',
    http2Server: false,
    isNode: platform === 'node',
    isWeb: platform === 'web',
    mainEntry: getEntry(),
    port: 3000,
    publicPath: '/',
    sourceMap: true,
    styleRulesConfig: styleLintRules,
    platform,
    verbose: true,
    webpackBail: true,
    webpackDir: path.resolve(__dirname, '.'), // loaders + entries are resovled relative to this
  };
}

module.exports = (env, argv) => {
  console.log(
    'env is', env
  )
  return webpackConfig(optionsConfig(mainOptions(env)));
}
