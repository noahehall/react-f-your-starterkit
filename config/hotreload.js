/* eslint-disable */
export default function hotreload(
  options,
  host = options.host,
  port = options.port,
  ssr = options.ssr,
) {
  const getHeaders = () => ({
    'Access-Control-Allow-Origin': '*',
  });

  const getStats = () => ({
    assets: true,
    chunkModules: false,
    chunks: false,
    colors: true,
    errorDetails: true,
    errors: true,
    hash: false,
    modules: false,
    timings: false,
    warnings: true,
  });

  const getSsrPath = () => ssr
    ? { path: `http://${host}:${port}/__webpack_hmr` }
    : {};

  // https://medium.com/@rajaraodv/webpack-hot-module-replacement-hmr-e756a726a07
  return options.isDev && options.isWeb
    ? {
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
        host,
        hotOnly: true, // fuck your page refresh
        inline: true,
        noInfo: true, // i need to see everything
        open: false, // i already have 10000 tabs open
        overlay: { errors: true, warnings: false },
        port,
        proxy: {},
        publicPath: `http://${host}:${port}`, // bundle files available at this location, Make sure publicPath always starts and ends with a forward slash. HMR requires a fully qualified domain, recommended should match output.publicPath
        quiet: ssr,
        stats: getStats(),
      }
    }
    : {};
}
