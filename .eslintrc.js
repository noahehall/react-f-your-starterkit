var path = require('path');

module.exports = {
  parser: 'babel-eslint',
  "extends": [
    "eslint-config-ct-fletcher"
  ],
  plugins: [
    'disable'
  ],
  rules: {
    'import/no-unresolved': 0,
    'import/namespace': 0,
    'import/named': 0,
    'import/default': 0,
    'arrow-parens': ['error', 'as-needed'],
  },
  settings: {
    // TODO: reporting false errors
    // turned off via rules
    'import/external-module-folders': [
      'node_modules',
      'src'
    ],
    'import/resolver': {
      order: ['webpack', 'node'],
      node: {
        moduleDirectory: [
          './src',
          './node_modules'
        ]
      },
      webpack: {
        config: path.join(__dirname, 'webpack.config.babel.js'),
      }
    }
  }
}
