/* eslint-disable */

// TODO: get nodemonplugin for server setup from starter/config/pluginTansformObjectRestSpread
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import webpack from 'webpack';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import WebpackManifestPlugin from 'webpack-manifest-plugin';
// import InlineChunkManifestHtmlWebpackPlugin from 'inline-chunk-manifest-html-webpack-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin';

export default function plugins(options) {
  const config = { plugins: [] };

  const getHashedModulesIdsPluginConfig = () => ({
    hashDigest: 'hex',
    hashDigestLength: 20,
    hashFunction: 'sha256',
  });

  const getUglifyJsPluginConfig = () => ({
    sourceMap: options.sourceMap,
    parallel: true,
    extractComments: true,
    uglifyOptions: {
      mangle: false,
      compress: true,
      warnings: true,
    },
  });

  const getExtractTextPluginConfig = () => ({
    filename: options.cssFilename,
    ...options.extractTextPluginConfig,
  });

  switch (options.env) {
    case 'development': {
      if (options.isWeb)
        config.plugins.push(
          new StyleLintPlugin({ ...options.styleLintPluginConfig })
        )

      config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
      )
      break;
    }

    case 'production': {
      // TODO: do this with npm script
      // if (options.isNode || (!options.ssr))
      //   config.plugins.push(
      //     // remove dist directory on build
      //     new CleanWebpackPlugin(
      //       [options.distDir],
      //       {
      //         verbose: true,
      //         root: options.context
      //       }
      //     ),
      //   )
      config.plugins.push(
        new UglifyJSPlugin(getUglifyJsPluginConfig()),
        new webpack.HashedModuleIdsPlugin(getHashedModulesIdsPluginConfig()),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
      );
    }
  }

  if (options.http2Server) {
    config.plugins.push(
      new webpack.optimize.AggressiveSplittingPlugin({
  			minSize: 30000,
  			maxSize: 50000
  		}),
    )
  }

  if ( options.isWeb )
    config.plugins.push(
      // TODO: move this to all envs section
      new ExtractTextPlugin(getExtractTextPluginConfig()),

      // inject webpack asset manifest into html.head
      // new InlineChunkManifestHtmlWebpackPlugin({
      //   dropAsset: false, // dont create manifest.json -> handled by webpackmanifestplugin
      // }),

      new HtmlWebpackPlugin({
        filename: options.htmlFilename,
        template: options.htmlTemplate,
        hash: false,
        chunks: ['runtime', 'vendor', 'main'],
        chunksSortMode: 'manual',
        ssr: options.ssr,
        ...options.htmlWebpackPluginConfig,
      }),


      // create PWA manifest
      // https://developer.mozilla.org/en-US/docs/Web/Manifest
      // exports json
      new WebpackPwaManifest({ ...options.webpackPwaManifestConfig }),

      //splitout options.dependencies
      //TODO: get from /starter/config/plugins
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks(module) {
          // This prevents stylesheet resources with the .css or .scss extension
          // from being moved from their original chunk to the vendor chunk
          return (module.resource && (/^.*\.(css|scss)$/).test(module.resource))
            ? false
            : true
        }
      }),

      // splitout webpack boilerplate
      new webpack.optimize.CommonsChunkPlugin({ name: 'runtime', minChunks: Infinity }),

    );
  else if (options.isNode)
    config.plugins.push(
      new ExtractTextPlugin(getExtractTextPluginConfig()),
      new webpack.DefinePlugin({ 'process.env.NODE_PORT': JSON.stringify(options.port) }),

    )

  // all envs and platforms
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.DIST_DIR': JSON.stringify(options.distDir),
      'process.env.NODE_ENV': JSON.stringify(options.env),
      'process.env.PRIVATE_DIR': JSON.stringify(options.privateDir),
      'process.env.PUBLIC_DIR': JSON.stringify(options.clientPublicDir),
      'process.env.SSR': JSON.stringify(options.ssr),
      [`process.env.${options.platform.toUpperCase()}_PORT`]: JSON.stringify(options.port),
     }),

    // exports webpack asset manifest in json format
    new WebpackManifestPlugin({...options.WebpackManifestPluginConfig}),

  );

  if (options.emitFiles) {
    config.plugins.push(new WriteFilePlugin());
  }

  if (options.emitFiles || options.isProd) {
    config.plugins.push(
      new webpack.DefinePlugin({ 'process.env.EMIT_FILES': JSON.stringify(true) })
    )
  }

  return config;
};
