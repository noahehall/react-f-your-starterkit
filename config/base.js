
import path from 'path';
import webpack from 'webpack';


export default function base (options) {
  return {
    recordsPath: options.recordsOutputPath,
    recordsInputPath: options.recordsOutputPath,
    recordsOutputPath: options.recordsOutputPath,
    context: options.context,
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        //'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        options.mainEntry
      ],
      //vendor: options.dependencies,

    output: {
      path: options.publicDir,
      chunkFilename: options.jsFilename,
      publicPath: options.publicPath,
      filename: options.jsFilename,
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
      modules: ['node_modules', options.contentBase]
    },
    profile: options.webpackProfile,
    bail: options.webpackBail,

  };
}
