import path from 'path';

export default function hotreload(options) {
  return options.isDev
    ? {
      devServer: {
        contentBase: options.contentBase,
        historyApiFallback: true,
        port: options.port,
        hotOnly: true,
        hot: true,
        inline: true,
        clientLogLevel: 'info',
        compress: false,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
      }
    }
    : {};
}
