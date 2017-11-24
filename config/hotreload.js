/* eslint-disable */
export default function hotreload(options) {
  const getHeaders = () => ({
    'Access-Control-Allow-Origin': '*',
  });

  const getStats = () => false
    ? options.stats // TODO: this object should be reused
    : ({
      chunkModules: false,
      chunks: false,
      colors: true,
      hash: false,
      modules: false,
      timings: false,
    });

  const getSsrPath = (port = options.port) => options.ssr
    ? { path: `http://127.0.0.1:${port}/__webpack_hmr` }
    : {};

  // https://medium.com/@rajaraodv/webpack-hot-module-replacement-hmr-e756a726a07
  return options.isDev && options.isWeb //&& !options.ssr
    ? { // TODO: this works but recompiles twice
      devServer: {
        ...getSsrPath(),
        // after(/*app*/) {}, // execute custom middleware after all other middleware internally within the server.
        // allowedHosts: ['localhost:3000, localhost:3001'],
        // before(/*app*/) {}, // execute custom middleware prior to all other middleware internally within the server.
        // hot: false, // not needed as we are running via node api
        // https: { key, cert, ca }, // use with fs.readFileSync
        // watchContentBase: false, // fuck your full page reload
        clientLogLevel: 'info',
        compress: false,
        contentBase: options.distDir, // only necessary for serving static content, absolute path recommended, publicPath overrides this
        headers: getHeaders(),
        historyApiFallback: true,
        host: '0.0.0.0',
        hotOnly: true, // fuck your page refresh
        inline: true,
        noInfo: true, // i need to see everything
        open: false, // i already have 10000 tabs open
        overlay: { errors: true, warnings: false },
        port: options.port,
        proxy: {},
        publicPath: `http://127.0.0.1:${options.port}`, // bundle files available at this location, Make sure publicPath always starts and ends with a forward slash. HMR requires a fully qualified domain, recommended should match output.publicPath
        quiet: true,
        stats: getStats(),
      }
    }
    : {};
}
