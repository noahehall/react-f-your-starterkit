/* eslint-disable */
import path from 'path';

function getCssLoaderConfig ({
  isDev,
  isProd,
  sourceMap,
} = {}) {
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
} = {}) {
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
} = {}) {
  return {
    debug: isDev ? verbose : false,
    fail: isDev,
    silent: isDev ? verbose : true,
    sourceMap,
  };
}

function getBabelLoaderConfig ({
  type,
} = {}) {
  return {
    plugins: [
      "react-hot-loader/babel",
      'transform-class-properties',
      'transform-object-rest-spread',
      "import-glob",
    ],
    'presets': [
      ['env', {
        modules: false,
      }],
      'stage-1',
      'react',
    ],
  };
}

function getStyleLintPluginConfig ({
  isDev,
  isProd,
  styleLintConfigPath,
} = {}) {
  return {
    configFile: styleLintConfigPath,
    context: './',
    emitErrors: true,
    failOnError: isDev,
    files: ['**/*.s?(a|c)ss'],
    quiet: isProd,
  };
}

function getWebpackPwaManifestPluginConfig ({
  appSlogan,
  appTitle,
} = {}) {
  const getIcons = () => [
    path.resolve('src/components/Layout/images/laptop_icon.png'),
    path.resolve('src/components/Layout/images/web_icon.png'),
  ].map((src) => ({ sizes: [ 96, 128, 192, 256, 384, 512 ], src }));

  return {
    background_color: '#ffffff',
    description: appSlogan,
    filename: 'manifest.json',
    icons: getIcons(),
    name: appTitle,
    short_name: 'NE Tech',
    theme_color: '#ea3d94',
  };
}

function dynamicOptionsOne ({
  context,
  distDir,
  env,
  verbose,
} = {}) {
  return {
    contentBase: path.resolve(context, 'src'), // static file location
    isDev: env === 'development',
    isProd: env === 'production',
    privateDir: path.resolve(distDir, 'private'),
    publicDir: path.resolve(distDir, 'public'), // use to be called path
    webpackProfile: verbose,
  };
}

function dynamicOptionsTwo ({
  distDir,
  isDev,
  privateDir,
  publicDir,
  type,
} = {}) {
  return {
    dataPath: path.resolve(distDir, publicDir, 'data'),
    fontsPath: path.resolve(distDir, publicDir, 'fonts'),
    imagePath: path.resolve(distDir, publicDir, 'images'),
    jsFilename: `js/${type}.[name].${isDev ? '[hash].' : ''}js`, // filename template for entry chunks
    recordsOutputPath: path.resolve(distDir, privateDir, 'webpack_records.js'),
  }
}

function getExtractTextPluginConfig ({
  isDev
} = {}) {
  return {
    allChunks: true,
    filename: isDev ? 'css/[name].css' : 'css/[name].[id].[contenthash].css',
    ignoreOrder: true,
  };
}

function getBabelTarget ({
  isDev,
} = {}) {
  return isDev
    ? { browsers: [ 'last 3 versions', '> 5%' ]}
    : { node: 'current' }
}

function getUrlLoaderConfig({

} = {}) {
  return {
    fallback: 'file-loader',
    limit: 8192,
  };
}

function dynamicOptionsThree (options = {}) {
  return {
    babelTarget: getBabelTarget(options),
    babelLoaderConfig: getBabelLoaderConfig(options),
    cssLoaderConfig: getCssLoaderConfig(options),
    extractTextPluginConfig: getExtractTextPluginConfig(options),
    htmlWebpackPluginConfig: getHtmlWebpackPluginConfig(options),
    resolveUrlLoaderConfig: getResolveUrlLoaderConfig(options),
    styleLintPluginConfig: getStyleLintPluginConfig(options),
    urlLoaderConfig: getUrlLoaderConfig(options),
    webpackPwaManifestConfig: getWebpackPwaManifestPluginConfig(options),
  }
}

export default function create (options) {
  return [
    dynamicOptionsOne,
    dynamicOptionsTwo,
    dynamicOptionsThree,
  ].reduce(
    (option, optionsCreator) =>
      Object.assign(
        {},
        option,
        optionsCreator({ ...options, ...option })
      ),
    options,
  );
}
