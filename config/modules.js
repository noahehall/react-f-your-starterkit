/* eslint-disable */

import cssMqpacker from 'css-mqpacker';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import postCssBrowserReporter from 'postcss-browser-reporter';
import postcssCssnext from 'postcss-cssnext';
import postCssCurrentSelector from 'postcss-current-selector';
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import postCssNestedAncestor from 'postcss-nested-ancestors';
import postcssRemoveRoot from 'postcss-remove-root';
import postcssReporter from 'postcss-reporter';
import webpack from 'webpack';

// TODO: split this out to multiple files
export default function modules(options) {
  // const moduleConfig = { module: {rules: [] } };

  const includePaths = options.cssIncludeGrommet
    ? ['./node_modules', './node_modules/grommet/node_modules']
    : [];

  const cssRules = {
    test:  /\.s?(a|c)ss$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            ...options.cssLoaderConfig,
          }
        },
        // see https://github.com/postcss/postcss-loader
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            sourceMap: options.sourceMap,
            syntax: 'postcss-scss',
            plugins(loader) {
              const pluginArray = [
                postcssImport,

                postcssCssnext({
                  ...options.babelTarget,
                }),
                postCssNestedAncestor(),
                postcssNested({
                  preserveEmpty: true,
                }),
                postCssCurrentSelector(),
                postcssRemoveRoot,
                cssMqpacker({
                  sort: false
                })
              ];

              if (options.isDev)
                pluginArray.push(
                  postcssReporter({throwError: true}),
                  postCssBrowserReporter()
                )

              return pluginArray;
            },
          }
        },
        {loader: 'resolve-url-loader', options: {
          ...options.resolveUrlLoaderConfig,
        }},
        {loader: 'sass-loader?sourceMap', options: {
          includePaths,
        }},
      ]
    })
  };

  const cssFromNodeModules = { // dont process with post-css
    enforce: 'pre',
    test:  /\.(s?)css$/,
    include: /node_modules/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      // resolve-url-loader may be chained before sass-loader if necessary
      use: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: 0,
            modules: false,
            minimize: options.isProd,
            sourceMap: options.sourceMap,
            localIdentName: '[local]'
          },
        },
      ]
    })
  };

  if (options.env === 'development') {
    cssRules.use = ['css-hot-loader'].concat(cssRules.use);
  }

  const javascriptRules = {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [{
      loader: 'babel-loader',
      options: {
        ...options.babelLoaderConfig,
      }
    }]
  };

  const htmlRules = {
    test: /\.html$/,
    use: [
      {
        loader: 'html-loader',
        options: {
          minimize: options.isProd,
          removeComments: false,
          collapseWhiteSpace: options.isProd,
        }
      }
    ],
  };

  const imageRules = {
    test: /\.(png|jpe?g|gif|svg)$/,
    use: [
      {
        // TODO: review image-webpack-loader
        loader: 'url-loader',
        options: {
          ...options.urlLoaderConfig,
          name: 'images/[name].[ext]',
        }
      }
    ]
  }

  const fontRules = {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: [
      {
        // TODO: review the limit setting
        loader: 'url-loader',
        options: {
          ...options.urlLoaderConfig,
          outputPath: 'fonts/'
        }
      }
    ]
  }

  const excelRules = {
    test: /\.(csv|tsv)$/,
    use: [
      'csv-loader'
    ]
  };

  const xmlRules = {
    test: /\.xml$/,
    use: [
      'xml-loader'
    ]
  };

  const eslintRules = {
    loader: 'eslint-loader',
    options: {
      fix: false, // causes compile endles loop
      emitError: options.isDev,
      emitWarning: options.isDev,
      quiet: options.isProd,
      failOnWarning: false,
      failOnError: options.isDev,
    }
  };

  const faviconRules = {
    test: /\.(ico)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 1,
          name: '[name].[ext]',
        }
      }
    ]
  };

  // moduleConfig.module.rules.push(eslintRules); // TODO: renable this
  // moduleConfig.module.rules.push(cssFromNodeModules);
  // moduleConfig.module.rules.push(cssRules);
  // moduleConfig.module.rules.push(excelRules)
  // moduleConfig.module.rules.push(fontRules);
  // moduleConfig.module.rules.push(htmlRules);
  // moduleConfig.module.rules.push(imageRules);
  // moduleConfig.module.rules.push(javascriptRules);
  // moduleConfig.module.rules.push(xmlRules);

  return {
    module: {
      rules: [
        cssFromNodeModules,
        cssRules,
        excelRules,
        faviconRules,
        fontRules,
        htmlRules,
        imageRules,
        javascriptRules,
        xmlRules,
      ]
    }
  };
};
