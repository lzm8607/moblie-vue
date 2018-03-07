/**
 * Created by Jimmy on 2018/3/7.
 */
var webpack = require('webpack');
var glob = require('glob');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
module.exports = {
    output: {
        filename: "js/[name].js",
        chunkFilename: 'js/[name].js',
        publicPath: "/"
    },
    plugins: [
        // 启动热替换
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: '[name].css',
            // allChunks: true
        }),
        new OpenBrowserPlugin({
            url: 'http://localhost:9080'
        })
    ],
    devtool : 'source-map',
    devServer : {
        port: 9080,
        contentBase: './dist',
        hot: true,
        historyApiFallback: true,
        disableHostCheck: true,
        publicPath: "",
        stats: {
            colors: true
        }
    }
}