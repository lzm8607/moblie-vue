/**
 * Created by Jimmy on 2017/5/22.
 */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge')
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const getEntry = function () {
    var entry = {};
    //读取开发目录,并进行路径裁剪
    glob.sync('./src/*.js')
        .forEach(function (name) {
            var start = name.indexOf('src/') + 4,
                end = name.length - 2;
            var n = name.slice(start, end);
            n = n.slice(0, n.lastIndexOf('/'));
            //保存各个组件的入口
            entry[n] = ['babel-polyfill',name];
        });
    entry.commons = ['vue', 'vue-router', 'axios'];
    return entry;
};
const env = process.env.NODE_ENV;
const config = {
    entry: getEntry(),
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "js/[name].[chunkhash:8].js",
        chunkFilename: 'js/[name].[chunkhash:8].js',
        publicPath: "/"
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
            test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svgz)(\?.+)?$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'images/[hash:16].[ext]'
                }
            }]
        }, {
            test: /\.js$/,
            loader: "babel-loader",
            query: {presets: ['es2015', 'vue']},
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!less-loader'})
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!postcss-loader!sass-loader'})
        }, {
            test: /\.vue$/,
            use: ['vue-loader']
        }, {
            test: /\.svg$/,
            use: ['xml-loader']
        }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [
                        require("autoprefixer")({
                            browsers: ['ie>=8', '>1% in CN']
                        })
                    ]
                }
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            inject: 'body',
            hash: true
        }),
        new CleanPlugin(['dist']),

        new ExtractTextPlugin({
            filename: '[name][chunkhash:8].css',
            allChunks: true
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        /* 公共库 */
        new CommonsChunkPlugin({
            name: 'commons',
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({name: 'mainifest', chunks: ['commons']}),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: `"${env}"`
            }
        }),
    ]
};
module.exports = merge(config,require(`./configs/${env}/webpack.conf`));
