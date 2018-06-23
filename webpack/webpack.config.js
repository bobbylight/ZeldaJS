const loaders = require('./loaders');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');
const webpack = require('webpack');

const devBuild = process.env.NODE_ENV === 'dev';
console.log(`Starting webpack build with NODE_ENV: ${process.env.NODE_ENV}`);

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
            editor: [ path.resolve('./src/app/zelda/editor/editor-main.ts') ]
        },
        output: {
            path: path.resolve('./build/web/'),
            filename: '[name].js'
        },
        resolve: {
            extensions: ['.js', '.ts', '.tsx'],
            modules: ['src/app', 'src/html', 'src/less', 'node_modules']
        },
        mode: devBuild ? 'development' : 'production',
        module: {
            rules: loaders
        },
        plugins: [
            // Simply copies the files over
            new CopyWebpackPlugin(
                [
                    {from: 'src/res', to: 'res', exclude: 'res/originals/**'},
                    {from: 'src/img', to: 'img'}
                ],
                {
                    ignore: ['originals/*']
                }
            ),
            new webpack.ProvidePlugin({
                'window.$': 'jquery',
                'window.jQuery': 'jquery',
                $: 'jquery',
                jQuery: 'jquery'
            }),
            new HtmlWebpackPlugin({
                template: 'src/html/index.html',
                inject: 'body',
                hash: true,
                chunks: [ 'vendor', 'app' ]
            }),
            new HtmlWebpackPlugin({
                template: 'src/html/editor.html',
                inject: 'body',
                hash: true,
                chunks: [ 'vendor', 'editor' ],
                filename: 'editor.html'
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                }
            }),
            new WebpackAutoInject({
                components: {
                    AutoIncreaseVersion: false,
                    InjectAsComment: false,
                    InjectByTag: true
                },
                componentsOptions: {
                    InjectByTag: {
                        fileRegex: /^.*\.js$/,
                        dateFormat: 'mmmm d, yyyy'
                    }
                }
            })
        ],
        devtool: devBuild ? 'cheap-module-eval-source-map' : undefined,
        devServer: {
            contentBase: './build/web'
        },

        optimization: {
            splitChunks: {
                cacheGroups: {
                    // Create a separate chunk for everything in node_modules
                    vendor: {
                        test: /node_modules/,
                        name: 'vendor',
                        enforce: true,
                        chunks: 'all'
                    }
                }
            }
        }
    }
];
