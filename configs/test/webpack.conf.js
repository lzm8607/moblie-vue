/**
 * Created by Jimmy on 2018/3/7.
 */
const webpack = require('webpack');

module.exports = {
    output: {
        filename: "js/[name].[chunkhash:8].js",
        chunkFilename: 'js/[name].[chunkhash:8].js',
        publicPath: "/"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "eslint-loader",
                query: {presets: ['es2015', 'vue'],formatter: require('eslint-friendly-formatter')},
                exclude: /node_modules/
            },
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin()
    ],
    devtool: 'cheap-module-source-map'
}