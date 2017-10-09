const loaders = require('./loaders');
const path = require('path');
const webpack = require('webpack');

// Loaders specific to testing
loaders.push({
    test: /\.tsx?$/,
    enforce: 'pre',
    loader: 'tslint-loader',
    exclude: /node_modules/,
    options: {
        typeCheck: true
    }
});
loaders.push({
    test: /^((?!\.spec\.ts).)*.ts$/,
    enforce: 'post',
    loader: 'istanbul-instrumenter-loader',
    exclude: /node_modules/
});

module.exports = [
    {
        entry: [ './src/app/zelda.ts' ],
        output: {
            path: path.resolve('./build/test/'),
            filename: '[name].js'
        },
        resolve: {
            extensions: [ '.js', '.ts', '.tsx' ],
            modules: [ 'src/app', 'src/html', 'src/less', 'node_modules' ]
        },
        module: {
            loaders: loaders
        },
        plugins: [
            new webpack.ProvidePlugin({
                'window.$': 'jquery',
                'window.jQuery': 'jquery',
                $: 'jquery',
                jQuery: 'jquery'
            })
        ],
        devtool: "inline-source-map"
    }
];
