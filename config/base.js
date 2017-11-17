/* eslint-disable */
import path from 'path';
import webpack from 'webpack';


export default function base (options) {

  // TODO: splitout vendor bundle //vendor: options.dependencies,
  const getEntry = () => options.isDev
    ? [
      'react-hot-loader/patch',
      'babel-polyfill',
      options.mainEntry
    ]
    : [
      'babel-polyfill',
      options.mainEntry
    ]

  const getOutput = () => ({
    path: options.publicDir,
    chunkFilename: options.jsFilename,
    publicPath: options.publicPath,
    filename: options.jsFilename,
  });

  const getResolve = () => ({
    extensions: ['*', '.js', '.jsx'],
    modules: ['node_modules', options.contentBase]
  });

  return {
    bail: options.webpackBail,
    context: options.context,
    profile: options.webpackProfile,
    recordsInputPath: options.recordsOutputPath,
    recordsOutputPath: options.recordsOutputPath,
    recordsPath: options.recordsOutputPath,
    entry: getEntry(),
    output: getOutput(),
    resolve: getResolve(),
  };
}
