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
    modules: true,
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
    cache: isDev,
    favicon: path.resolve('src/components/App/images/favicon.ico'),
    inject: true,
    metaDescription: appSlogan,
    minify: getMinifyConfig(),
    showErrors: isDev,
    title: appTitle,
  }
}

function getResolveUrlLoaderConfig ({
  isDev,
  sourceMap,
  verbose,
}) {
  return {
    debug: false, //isDev ? verbose : false,
    fail: isDev,
    silent: isDev ? verbose : true,
    sourceMap,
  };
}

function getBabelLoaderConfig ({
  isWeb,
  isDev,
}) {
  return {
    plugins: [
      isDev && isWeb ? "react-hot-loader/babel" : false,

      "import-glob",
      "transform-async-generator-functions",
      "transform-class-properties",
      "transform-function-bind",
      "transform-object-rest-spread",
      "transform-runtime",
    ].filter(plugin => plugin),
    'presets': [
      ['env', {
        modules: false,
      }],
      'stage-1',
      'react',
      //'flow',
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
    filename: 'pwa.manifest.json',
    fingerprints: false,
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
    publicDir:isNode ? distDir : path.resolve(distDir, 'public'),
    clientPublicDir: path.resolve(distDir, 'public'),
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
    jsFilename: `${isNode ? '' : 'js/'}${platform}.[name]${isProd ? '.[chunkhash]' : ''}.js`, // filename template for entry chunks
    recordsOutputPath: path.resolve(distDir, privateDir, `${platform}.webpack_records.js`),
  };
}

function getExtractTextPluginConfig ({
  isDev,
  isNode,
}) {
  return {
    allChunks: true,
    filename: isDev ? 'css/[name].css' : 'css/[name].[id].[contenthash].css',
    ignoreOrder: true,
  };
}

function getBabelTarget ({
  isDev,
  isWeb,
}) {
  return true
    ? { browsers: [ 'last 3 versions', '> 5%' ]}
    : { node: 'current' };
}

function getUrlLoaderConfig({
  // include options here
}) {
  return {
    fallback: 'file-loader',
    limit: 8192,
  };
}

function getWebpackManifestPluginConfig ({
  isNode,
  platform,
}) {
  return {
    writeFileEmit: false,
    fileName: `${isNode ? '' : 'js/'}${platform}.manifest.json`,
  };
}

function getStatsConfig ({
  // include options here
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
    env: false,
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
  // include options here
}) {
  return {
    hints: 'warning',
  };
}

function getWebpackConfig ({
 isDev,
 isNode,
 platform,
}) {
  return {
    bail: true,
    parallelism: 2,
    profile: true,
    target: platform,
    name: platform,
    watch: isNode && isDev,
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
    WebpackManifestPluginConfig: getWebpackManifestPluginConfig(options),
    performanceConfig: getPerformanceConfig(options),
    resolveUrlLoaderConfig: getResolveUrlLoaderConfig(options),
    statsConfig: getStatsConfig(options),
    styleLintPluginConfig: getStyleLintPluginConfig(options),
    urlLoaderConfig: getUrlLoaderConfig(options),
    webpackConfig: getWebpackConfig(options),
    webpackPwaManifestConfig: getWebpackPwaManifestPluginConfig(options),
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
