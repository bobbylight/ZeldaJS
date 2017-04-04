const loaders = require('./loaders');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [ './src/app/zelda.ts' ],
    output: {
        filename: 'build.js',
        path: 'tmp'
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js', '.json']
    },
    resolveLoader: {
        modulesDirectories: ["node_modules"]
    },
    devtool: "source-map-inline",
    plugins: [
        new webpack.ProvidePlugin({
        })
    ],
    module: {
        loaders: loaders,
        postLoaders: [
            {
                test: /^((?!\.spec\.ts).)*.ts$/,
                exclude: /node_modules/,
                loader: 'istanbul-instrumenter'
            }
        ]
    }
};
