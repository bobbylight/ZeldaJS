const StringReplacePlugin = require('string-replace-webpack-plugin');

module.exports = [
    {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
    },
    {
        test: /\.css$/,
        loader: "style-loader!css-loader"
    },

    // Loaders for font-awesome fonts
    {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
    }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
    }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/octet-stream"
    }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader"
    }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml"
    },

    {
        // This is the voodoo to have webpack convert "import 'index.html'; into an actual HTML file (!!)
        test: /\.html$/, // /(?:index|editor)\.html$/,
        loaders: [ 'file-loader?name=[name].[ext]',
            StringReplacePlugin.replace({
                replacements: [{
                    pattern: /<%=build.date%>/,
                    replacement: function() {
                        return new Date().toLocaleDateString();
                    }
                }]
            })
        ]
    }
];
