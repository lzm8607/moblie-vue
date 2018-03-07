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