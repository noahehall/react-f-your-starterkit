/* eslint-disable */
export default function hotreload(options) {
  const getHeaders = () => ({
    'Access-Control-Allow-Origin': '*',
  });

  return options.isDev
    ? { // TODO: this works but recompiles twice
      devServer: {
        clientLogLevel: 'info',
        compress: false,
        contentBase: options.distDir,
        headers: {'Access-Control-Allow-Origin': '*'},
        headers: getHeaders(),
        historyApiFallback: true,
        hotOnly: true,
        inline: true,
        noInfo: false,
        overlay: true,
        port: options.port,
        quiet: false,
      }
    }
    : {};
}
