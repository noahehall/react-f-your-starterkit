const path = require('path')
const nodeExternals = require('webpack-node-externals');
module.exports = {
    target: 'node',
    externals: [nodeExternals()],
    entry: path.resolve(__dirname, 'src/components/server/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: 'server.js',
        library: 'app',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            components: path.resolve(__dirname, 'src/components')
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {

                    "presets": [
                      "env",
                      "stage-1",
                      "react"
                    ],
                    "plugins": [
                      "transform-object-rest-spread",
                      "import-glob",
                      "transform-runtime"
                    ]
                  }

            },
            {
                test: /\.css/,
                loader: 'css-loader/locals'
            },
            {
                test: /\.(ttf|eot|otf|svg|png)$/,
                loader: 'file-loader?emitFile=false'
            },
            {
                test: /\.(woff|woff2)$/,
                loader: 'url-loader?emitFile=false'
            }
        ]
    }
};
