/* eslint-disable */
import path from 'path';

function getCssLoaderConfig ({
  isDev,
  isNode,
  isProd,
  isWeb,
  sourceMap,
}) {
  return {
    camelCase: true,
    importLoaders: 1,
    localIdentName: isDev ? '[path][name]__[local]' : 'css[hash:base64:5]',
    minimize: isProd,
    modules: isWeb,
    sourceMap,
  };
}

function getHtmlWebpackPluginConfig ({
  appSlogan,
  appTitle,
  isDev,
}) {
  const getMinifyConfig = () => (
    isDev
      ? false
      : {
        caseSensitive: false,
        minifyCSS: true,
        minifyJS: true,
      }
  );

  return {
    inject: true,
    metaDescription: appSlogan,
    minify: getMinifyConfig(),
    title: appTitle,
  };
}

function getResolveUrlLoaderConfig ({
  isDev,
  sourceMap,
  verbose,
}) {
  return {
    debug: isDev ? verbose : false,
    fail: isDev,
    silent: isDev ? verbose : true,
    sourceMap,
  };
}

function getBabelLoaderConfig ({
  platform,
}) {
  return {
    plugins: [
      "react-hot-loader/babel",

      'transform-class-properties',
      'transform-object-rest-spread',
      "import-glob",
      "transform-async-generator-functions",
      "transform-function-bind",
      "transform-object-rest-spread",
      "transform-runtime",
    ],
    'presets': [
      ['env', {
        modules: false,
      }],
      'stage-1',
      'react',
      'flow',
    ],
  };
}

function getStyleLintPluginConfig ({
  isDev,
  isProd,
  styleRulesConfig,
}) {
  return {
    config: styleRulesConfig,
    context: './',
    emitErrors: isDev,
    failOnError: isDev,
    files: ['**/*.s?(a|c)ss'],
    fix: false, // breaks hot reloader: endless loop
    ignoreDisables: true,
    quiet: isProd,
  };
}

function getWebpackPwaManifestPluginConfig ({
  appSlogan,
  appTitle,
  publicPath,
}) {
  const getIcons = () => [
    path.resolve('src/components/App/images/laptop_icon.png'),
    path.resolve('src/components/App/images/web_icon.png'),
  ].map((src) => ({ sizes: [ 96, 128, 192, 256, 384, 512 ], src }));

  return {
    background_color: '#ffffff',
    description: appSlogan,
    filename: 'manifest.json',
    icons: getIcons(),
    inject: true,
    name: appTitle,
    orientation: 'portrait',
    publicPath,
    short_name: 'NE Tech',
    theme_color: '#ea3d94',
  };
}

function dynamicOptionsOne ({
  context,
  distDir,
  env,
  isNode,
  verbose,
}) {
  return {
    contentBase: path.resolve(context, 'src'), // static file location
    isDev: env === 'development',
    isProd: env === 'production',
    privateDir: path.resolve(distDir, 'private'),
    publicDir:isNode ? distDir : path.resolve(distDir, 'public'), // use to be called path
    webpackProfile: verbose,
  };
}

function dynamicOptionsTwo ({
  distDir,
  isProd,
  privateDir,
  publicDir,
  platform,
  isNode,
}) {
  return {
    dataPath: path.resolve(distDir, publicDir, 'data'),
    fontsPath: path.resolve(distDir, publicDir, 'fonts'),
    imagePath: path.resolve(distDir, publicDir, 'images'),
    jsFilename: `${isNode ? '' : 'js/'}${platform}.[name]${isProd ? '.[hash]' : ''}.js`, // filename template for entry chunks
    recordsOutputPath: path.resolve(distDir, privateDir, 'webpack_records.js'),
  }
}

function getExtractTextPluginConfig ({
  isDev,
  isNode,
}) {
  return {
    allChunks: true,
    disable: isNode,
    filename: isDev ? 'css/[name].css' : 'css/[name].[id].[contenthash].css',
    ignoreOrder: true,

  };
}

function getBabelTarget ({
  isDev,
}) {
  return isDev
    ? { browsers: [ 'last 3 versions', '> 5%' ]}
    : { node: 'current' }
}

function getUrlLoaderConfig({

}) {
  return {
    fallback: 'file-loader',
    limit: 8192,
  };
}

function getManifestPluginConfig ({
  isNode,
  platform,
}) {
  return {
    writeFileEmit: false,
    fileName: `${isNode ? '' : 'js/'}${platform}.manifest.json`,
  }
}

function getStatsConfig ({

}) {
  return {
    assets: true,
    assetsSort: 'field',
    cached: false,
    cachedAssets: false,
    children: false,
    chunkModules: false,
    chunkOrigins: false,
    chunks: false,
    colors: true,
    entrypoints: true,
    env: true,
    errorDetails: true,
    errors: true,
    hash: true,
    maxModules: Infinity,
    modules: false,
    modulesSort: 'field',
    optimizationBailout: true, // Display bailout reasons
    source: false,
  };
}


function getPerformanceConfig ({

}) {
  return {
    hints: 'warning',
  };
}

function getWebpackConfig ({
 platform,
 isNode,
}) {
  return {
    bail: true,
    parallelism: 2,
    profile: true,
    target: platform,
    watch: false, //isNode,
  };
}



function dynamicOptionsThree (options) {
  return {
    babelLoaderConfig: getBabelLoaderConfig(options),
    babelTarget: getBabelTarget(options),
    cache: options.isDev,
    cssLoaderConfig: getCssLoaderConfig(options),
    extractTextPluginConfig: getExtractTextPluginConfig(options),
    htmlWebpackPluginConfig: getHtmlWebpackPluginConfig(options),
    manifestPluginConfig: getManifestPluginConfig(options),
    performanceConfig: getPerformanceConfig(options),
    resolveUrlLoaderConfig: getResolveUrlLoaderConfig(options),
    statsConfig: getStatsConfig(options),
    styleLintPluginConfig: getStyleLintPluginConfig(options),
    urlLoaderConfig: getUrlLoaderConfig(options),
    webpackPwaManifestConfig: getWebpackPwaManifestPluginConfig(options),
    webpackConfig: getWebpackConfig(options),
  }
}

export default function create (options) {
  return [
    dynamicOptionsOne,
    dynamicOptionsTwo,
    dynamicOptionsThree,
  ].reduce(
    (optionConfig, optionsCreator) =>
      Object.assign(
        {},
        optionConfig,
        optionsCreator({ ...options, ...optionConfig })
      ),
    options,
  );
}
