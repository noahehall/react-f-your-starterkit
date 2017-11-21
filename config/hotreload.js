/* eslint-disable */
export default function hotreload(options) {
  const getHeaders = () => ({
    'Access-Control-Allow-Origin': '*',
  });

  return options.isDev && options.isWeb && !options.ssr
    ? { // TODO: this works but recompiles twice
      devServer: {
        clientLogLevel: 'info',
        compress: false,
        contentBase: options.distDir,
        headers: getHeaders(),
        historyApiFallback: true,
        hotOnly: true,
        inline: true,
        noInfo: false,
        overlay: true,
        port: options.port,
        publicPath: options.publicPath,
        quiet: false,
      }
    }
    : {};
}
