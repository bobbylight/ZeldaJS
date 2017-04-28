const loaders = require('./loaders');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const webpack = require('webpack');

const devBuild = process.env.NODE_ENV === 'dev';

// Loaders specific to compiling
loaders.push({
    test: /\.tsx?$/,
    enforce: 'pre',
    loader: 'tslint-loader',
    exclude: /node_modules/,
    options: {
        typeCheck: true
    }
});

module.exports = [
    {
        entry: {
            app: path.resolve('./src/app/zelda.ts'),
            editor: [ path.resolve('./src/app/zelda/editor/editor-main.ts'),
                // // TODO: Figure out a way to pull in these dependencies without referencing the entire libs!
                // path.resolve('./node_modules/angular-ui-bootstrap/index.js'),
                // path.resolve('./node_modules/angular-sanitize/index.js')
            ],
            // gtp: [ 'gtp' ],
            // // TODO: Figure out how to split highlight.js into separate, lazy-loaded chunk.  Also, custom build it?
            // editorVendor: [ 'bootstrap', 'highlight.js', 'jquery', 'react', 'react-bootstrap', 'react-dom', 'react-redux', 'redux', 'redux-actions' ]
        },
        output: {
            path: path.resolve('./build/web/'),
            filename: '[name].js'
        },
        resolve: {
            extensions: ['.js', '.ts', '.tsx'],
            modules: ['src/app', 'src/html', 'src/css', 'node_modules']
        },
        module: {
            loaders: loaders
        },
        plugins: [
            // new webpack.optimize.CommonsChunkPlugin({ names: [ 'gtp', 'editorVendor' ] }),
            // new webpack.optimize.CommonsChunkPlugin({
            //     name: 'manifest',
            //     minChunks: Infinity
            // }),
            // Simply copies the files over
            new CopyWebpackPlugin([
                { from: 'src/res', to: 'res' },
                { from: 'src/img', to: 'img' },
                { from: '**/*.html', context: 'src/app' }
, { from: '*.html', context: 'src/html' }
            ]),
            new StringReplacePlugin(),
            new webpack.ProvidePlugin({
                'window.$': 'jquery',
                'window.jQuery': 'jquery',
                $: 'jquery',
                jQuery: 'jquery'
            })
        ],
        devtool: devBuild ? 'cheap-eval-source-map' : 'source-map',
        devServer: {
            contentBase: './build/web'
        }
    }
];

if (!devBuild) {
    module.exports[0].plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
}
