import path from 'path';

export default function hotreload(options) {
  return options.isDev
    ? {
      devServer: {
        //hot: true,
        clientLogLevel: 'info',
        compress: false,
        contentBase: options.distDir,
        headers: {'Access-Control-Allow-Origin': '*'},
        historyApiFallback: true,
        hotOnly: true,
        inline: true,
        noInfo: false,
        overlay: true,
        port: options.port,
        quiet: false,
        //hot: true,
      }
    }
    : {};
}
