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
  const getCssLoaderName = () => `css-loader${options.isNode ? '/locals': ''}`;

  const getLoaders = () => [
    {
      loader: getCssLoaderName(),
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
    {
      loader: 'resolve-url-loader',
      options: {
        ...options.resolveUrlLoaderConfig,
      }
    },
  ];

  const cssRules = {
    enforce: 'pre',
    test:  /\.s?(a|c)ss$/,
    exclude: /node_modules/,
    use: options.isWeb
      ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: getLoaders(),
        })
      : getLoaders()
  };

  if (options.env === 'development' && options.isWeb) {
    cssRules.use = ['css-hot-loader'].concat(cssRules.use);
  }

  const getCssFromNodeLoaders = () => [
    {
      loader: getCssLoaderName(),
      options: {
        importLoaders: 0,
        modules: false,
        minimize: options.isProd,
        sourceMap: options.sourceMap,
        localIdentName: '[local]'
      },
    },
  ];

  const cssFromNodeModules = { // dont process with post-css
    enforce: 'pre',
    test: /\.s?(a|c)ss$/,
    include: /node_modules/,
    use: options.isWeb
      ? ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: getCssFromNodeLoaders()
      })
      : getCssFromNodeLoaders()
  }

  const addEslintLoader = () =>  options.isDev
    ? {
      loader: 'eslint-loader',
      options: {
        fix: false, // causes compile endles loop
        emitError: true,
        emitWarning: true,
        quiet: false,
        failOnWarning: false,
        failOnError: false,
      }
    }
    : null;

  const javascriptRules = {
    // TODO: add babe;-preset to this config from starter/config/modules.js
    enforce: 'pre',
    exclude: /node_modules/,
    test: /\.jsx?$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          ...options.babelLoaderConfig,
        }
      },
      addEslintLoader(),
    ].filter(rule => rule)
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

  const processLoaderString = (text) => options.isWeb
    ? text
    : `${text}?emitFile=false`;

  const urlLoaderString = processLoaderString('url-loader');
  const fileLoaderString = processLoaderString('file-loader');

  const imageRules = {
    test: /\.(png|jpe?g|gif|svg)$/,
    use: [
      {
        // TODO: review image-webpack-loader
        loader: urlLoaderString,
        options: {
          ...options.urlLoaderConfig,
          name: options.assetFilename, // TODO: combine these into assetLoaders
        }
      }
    ]
  }

  const fontRules = {
    test: /\.(eot|ttf|woff|woff2|ttf|otf)$/,
    use: [
      {
        // TODO: review the limit setting
        loader: urlLoaderString,
        options: {
          ...options.urlLoaderConfig,
          name: 'fonts/[name].[ext]',
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

  const faviconRules = {
    test: /\.(ico)$/,
    use: [
      {
        loader: urlLoaderString,
        options: {
          limit: 1,
          name: '[name].[ext]',
        }
      }
    ]
  };

  const workerRules = {
    test: /\.worker\.js$/,
    use: {
      loader: 'worker-loader',
      options: {
        name: `js/worker${options.isProd ?'.[chunkhash]' : ''}.js`,
        fallback: false,
        inline: false // set to true if assets arent loading due to same origin policy
      },
    },
  };

  const audioRules = {
    test: /\.(mp4|ogg|mp3|wav)$/,
    use: [
      {
        loader: fileLoaderString,
        options: {
          limit: 8192,
          name: 'audio/[name].[ext]',
        }
      }
    ]
  };

  const txtRules = {
    test: /\.txt$/,
    use: 'raw-loader',
  };

  const jsonRules = {
    test: /\.json$/,
    use: 'json-loader',
  };

  return {
    module: {
      rules: [
        audioRules,
        cssFromNodeModules,
        cssRules,
        excelRules,
        faviconRules,
        fontRules,
        htmlRules,
        imageRules,
        javascriptRules,
        jsonRules,
        txtRules,
        workerRules,
        xmlRules,
      ].filter(rule => rule)
    }
  };
};
