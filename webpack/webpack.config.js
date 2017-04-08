const loaders = require('./loaders');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const webpack = require('webpack');

// todo: add back when tslint-loader is updated for tslint 5.0.0
// // Loaders specific to compiling
// loaders.push({
//     enforce: 'pre',
//     test: /\.ts$/,
//     loader: 'tslint-loader',
//     exclude: /node_modules/
// });

module.exports = [
    {
        entry: {
            app: path.resolve('./src/app/zelda.ts'),
            editor: [ path.resolve('./src/app/zelda.ts'), path.resolve('./src/app/zelda/editor/editor.ts'),
                    // TODO: Figure out a way to pull in these dependencies without referencing the entire libs!
                    path.resolve('./node_modules/angular-ui-bootstrap/index.js'),
                    path.resolve('./node_modules/angular-sanitize/index.js') ]
        },
        output: {
            path: path.resolve('./build/web/'),
            filename: '[name].js',
            //publicPath: 'build/web/'
        },
        resolve: {
            extensions: ['.js', '.ts'],
            modules: ['src/app', 'src/html', 'src/css', 'node_modules']
        },
        module: {
            loaders: loaders
        },
        plugins: [
            // Simply copies the files over
            new CopyWebpackPlugin([
                { from: 'src/res', to: 'res' },
                { from: 'src/img', to: 'img' },
                { from: '**/*.html', context: 'src/app' }
            ]),
            new StringReplacePlugin(),
            new webpack.ProvidePlugin({
                'window.$': 'jquery',
                'window.jQuery': 'jquery',
                $: 'jquery',
                jQuery: 'jquery'
            })
        ],
        // Create Sourcemaps for the bundle
        devtool: 'source-map',
        devServer: {
            contentBase: './build/web'
        }
    }
];
