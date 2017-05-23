/**
 * Created by Jimmy on 2017/5/22.
 */
var path = require('path');
var webpack = require('webpack');
var glob = require('glob');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var getEntry = function () {
    var entry = {};
    //读取开发目录,并进行路径裁剪
    glob.sync('./src/*.js')
        .forEach(function (name) {
            var start = name.indexOf('src/') + 4,
                end = name.length - 2;
            var n = name.slice(start, end);
            n = n.slice(0, n.lastIndexOf('/'));
            //保存各个组件的入口
            entry[n] = name;
        });
    return entry;
};
var prod = process.env.NODE_ENV === 'production' ? true : false;
module.exports = {
    entry: getEntry(),
    output: {
        path: path.resolve(__dirname, prod ? "./dist" : "./build"),
        filename: prod ? "js/[name].min.js" : "js/[name].js",
        chunkFilename: 'js/[name].chunk.js',
        publicPath: prod ? "/" : "/"
    },
    resolve: {
        //配置项,设置忽略js后缀
        extensions: ['.js', '.less', '.css', '.png', '.jpg'],
        modules: ['./src', 'node_modules'],
        // 模块别名
        alias: {}
    },
    module: {
        loaders: [{
            test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }]
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract({fallback: 'style', use: 'css!less'})
        }, {
            test: /\.js$/,
            loader: "babel-loader",
            query: {presets: ['es2015', 'vue']},
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
        }, {
            test: /\.vue$/,
            use: ['vue-loader']
        }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            inject: 'body',
            hash: true
        }),
        new CleanPlugin(['dist', 'build']),
        // 启动热替换
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: '[name].css',
            // allChunks: true
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new OpenBrowserPlugin({
            url: 'http://localhost:9080'
        }),
        /* 公共库 */
        new CommonsChunkPlugin({
            name: 'commons',
            minChunks: Infinity
        }),
    ]
};
// 判断开发环境还是生产环境,添加uglify等插件
if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = 'cheap-module-source-map';
    module.exports.plugins = (module.exports.plugins || [])
        .concat([
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_console: true
                }
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
        ]);
} else {
    module.exports.devtool = 'source-map';
    module.exports.devServer = {
        port: 9080,
        contentBase: './build',
        hot: true,
        historyApiFallback: true,
        disableHostCheck: true,
        publicPath: "",
        stats: {
            colors: true
        }
    };
}