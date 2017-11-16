import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import webpack from 'webpack';
import WebpackInfoPlugin from 'webpack-info-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';

export default function plugins(options) {
  const config = {plugins: [] };
  switch (options.env) {
    case 'development': {
      config.plugins.push(
        new StyleLintPlugin({
          ...options.styleLintPluginConfig,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
      )
      break;
    }
    case 'production': {
      config.plugins.push(
        // remove dist directory on build
        new CleanWebpackPlugin(
          [options.path],
          {
            verbose: true,
            root: options.context
          }
        ),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new UglifyJSPlugin({
          sourceMap: options.sourceMap,
        })
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

  // all environments
  config.plugins.push(
    // new WebpackInfoPlugin({
    //   ...options.webpackInfoPluginConfig,
    // }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(options.env)
    }),

    new ExtractTextPlugin({
      filename: options.cssFilename,
      ...options.extractTextPluginConfig,
    }),

    new HtmlWebpackPlugin({
      filename: options.htmlFilename,
      template: options.htmlTemplate,
      hash: false,
      ...options.htmlWebpackPluginConfig,
    }),

    // splitout options.dependencies
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
    // splitout webpack boilerplate + manifest
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    }),

    // create PWA manifest
    // https://developer.mozilla.org/en-US/docs/Web/Manifest
    new WebpackPwaManifest({
      ...options.webpackPwaManifestConfig,
    })
  );

  return config;
};
