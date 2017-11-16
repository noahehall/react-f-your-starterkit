import path from 'path';
import deps from './package.json';
import creator from './config';

/**
 * TODO
 https://github.com/danethurber/webpack-manifest-plugin
 */

const sourceMap = true;
const verbose = false;
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const appTitle = 'Noah Edward Technologies Inc.';
const appSlogan = 'Creating the future, together';
const options = {
  isDev,
  isProd,
  sourceMap,
  // true throws webpackjsonp not defined, see config/plugins
  // https://github.com/webpack/webpack/tree/master/examples/http2-aggressive-splitting
  http2Server: false,
  recordsOutputPath: path.resolve('./dist/private', 'webpack_records.js'),

  // not used cssPath: path.resolve('./dist/public/css/'),
  contentBase: path.resolve('./src/'),
  context: path.resolve('.'),
  cssFilename: 'css/[name].[id].css',
  cssIncludeGrommet: true,
  dataPath: path.resolve('./dist/public/data'),
  dependencies: Object.keys(deps.dependencies),
  env: process.env.NODE_ENV || 'development',
  fontsPath: path.resolve('./dist/public/fonts'),
  htmlFilename: 'index.html',
  //htmlTemplate: 'src/components/Layout/index.html',
  htmlTemplate: 'src/components/Layout/template.html.js',
  imagePath: path.resolve('./dist/public/images'),
  jsFilename: 'js/[name].[hash].js',
  mainEntry: './src/index.js',
  path: path.resolve('./dist/public'),
  port: 3000,
  publicPath: '/',
  htmlWebpackPluginConfig: {
    title: appTitle,
    metaDescription: appSlogan,
    inject: true,
    minify: isDev
      ? false
      : {
        caseSensitive: false,
        minifyCSS: true,
        minifyJS: true,
      }
  },
  webpackProfile: verbose,
  webpackBail: true,
  cssLoaderConfig: {
    modules: true,
    camelCase: true,
    importLoaders: 1,
    sourceMap,
    minimize: isDev
      ? false
      : true,
    localIdentName: isDev
      ? '[path][name]__[local]'
      : 'css[hash:base64:5]',
  },
  resolveUrlLoaderConfig: {
    sourceMap,
    silent: isDev
      ? verbose
      : true,
    fail: isDev
      ? true
      : false,
    debug: isDev
      ? verbose
      : false,
  },
  extractTextPluginConfig: {
    allChunks: true,
    ignoreOrder: true,
  },
  babelLoaderConfig: {
    'presets': [
      'env',
      'stage-1',
      'react',
    ],
    plugins: [
      'transform-class-properties',
      'transform-object-rest-spread',
      "import-glob"
    ],
  },
  urlLoaderConfig: {
    fallback: 'file-loader',
    limit: 8192,
    name: '[name].[ext]',
  },
  styleLintPluginConfig: {
    configFile: path.resolve('./.stylelintrc'),
    context: './',
    emitErrors: true,
    failOnError: false,
    files: ['**/*.s?(a|c)ss'],
    quiet: false,
  },
  webpackInfoPluginConfig: {
    stats: { // provide false to disable displaying stats
      // pass options from http://webpack.github.io/docs/node.js-api.html#stats-tostring
      colors: true,
      version: true,
      hash: false,
      timings: true,
      assets: false,
      chunks: false,
      chunkModules: false,
      modules: false
    },
    state: true // show bundle valid / invalid
  },
  webpackPwaManifestConfig: {
    filename: 'manifest.json',
    name: appTitle,
    short_name: 'NE Tech',
    description: appSlogan,
    theme_color: '#ea3d94',
    background_color: '#ffffff',
    icons: [
      path.resolve('src/components/Layout/images/laptop_icon.png'),
      path.resolve('src/components/Layout/images/web_icon.png'),
    ].map(src => ({ src, sizes: [96, 128, 192, 256, 384, 512] })),
  },
};

module.exports = () => {
  return creator(options)
}
