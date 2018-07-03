module.exports = [
    {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
    },
    {
        test: /\.css/,
        use: [ 'style-loader', 'css-loader' ]
    },
    {
        test: /\.less/,
        loader: 'style-loader!css-loader!less-loader'
    }, {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'raw-loader'
    }, {
        test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
        test: /\.(ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
    }
];
