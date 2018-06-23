const loaders = require('./loaders');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
        target: 'electron-main',
        entry: {
            'electron-main': path.resolve('./src/app/electron-main.ts'),
            app: path.resolve('./src/app/zelda.ts')
        },
        output: {
            path: path.resolve('./build/electron/'),
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
        node: {
            __dirname: false,
            __filename: false
        },
        plugins: [
            // new webpack.optimize.CommonsChunkPlugin({ names: [ 'gtp', 'editorVendor' ] }),
            // new webpack.optimize.CommonsChunkPlugin({
            //     name: 'manifest',
            //     minChunks: Infinity
            // }),
            // Simply copies the files over
            new CopyWebpackPlugin(
                [
                    { from: 'src/res', to: 'res', exclude: 'res/originals/**' },
                    { from: 'src/img', to: 'img' },
                    { from: 'desktop-index.html', context: 'src/html' },
                    { from: 'src/res/originals/desktop_icon_gxi_icon.ico', to: 'icon.ico' }
                ],
                {
                    ignore: [ 'originals/*' ]
                }
            ),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                }
            })
        ],
        devtool: devBuild ? 'cheap-module-eval-source-map' : undefined
    }
];
