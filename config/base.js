/* eslint-disable */
import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

export default function base (options) {

  // TODO: splitout vendor bundle //vendor: options.dependencies,
  const getEntry = () => options.isDev && options.isWeb
    ? [
      'babel-polyfill',
      'react-hot-loader/patch',
      options.ssr ? 'webpack-hot-middleware/client?name=web&path=http://127.0.0.1:3001/__webpack_hmr': false,
      options.mainEntry
    ].filter(entry => entry)
    : [
      'babel-polyfill',
      options.mainEntry
    ]

  const getPublicPath = () => (
    options.isDev && options.ssr && options.isWeb
  ) ? 'http://127.0.0.1:3001/' : options.publicPath;
  
  const getOutput = () => ({
    chunkFilename: options.jsFilename,
    filename: options.jsFilename,
    path: options.publicDir,
    publicPath: getPublicPath(),
    library: options.isWeb ? 'var' : 'app',
    libraryTarget: options.isWeb ? 'umd2' : 'commonjs2',
  });

  const getResolve = () => ({
    extensions: ['*', '.js', '.jsx', '.css'],
    modules: ['.', 'node_modules', options.contentBase]
  });

  const getExternals = () => options.isNode
    ? nodeExternals()
    : [];

  const getNode = () => options.isNode
    ? {
      __dirname: false,
      __filename: false,
      Buffer: false,
      console: false,
      global: false,
      process: false,
    }
    : {};

  return {
    ...options.webpackConfig,
    bail: options.webpackBail,
    cache: options.cache,
    context: options.context,
    devtool: options.isDev ? 'eval-source-map' : 'source-map',
    entry: getEntry(),
    externals: getExternals(),
    node: getNode(),
    output: getOutput(),
    performance: { ...options.performanceConfig },
    profile: options.webpackProfile,
    recordsInputPath: options.recordsOutputPath,
    recordsOutputPath: options.recordsOutputPath,
    recordsPath: options.recordsOutputPath,
    resolve: getResolve(),
    stats: { ...options.statsConfig },
  };
}
