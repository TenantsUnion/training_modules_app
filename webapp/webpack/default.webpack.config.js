/**
 * Using typescript setup from from https://github.com/ducksoupdev/vue-webpack-typescript/blob/master/template/webpack.config.js
 */

var path = require('path');
var webpack = require('webpack');
var config = require('config');

// Extract style sheets into dedicated file in production
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: [
        '../src/app/app.ts'
    ],
    context: path.resolve(__dirname),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'build.js',
        sourceMapFilename: '[file].map'
    },
    plugins: [
        new ExtractTextPlugin('style.css', {
            allChunks: true,
            sourceMap: true
        }),
        new webpack.NodeEnvironmentPlugin([
            'NODE_ENV'
        ]),
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ['vue-style-loader', 'css-loader'],
                        scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
                        sass: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
                    },
                    extractCss: true,
                    esModule: true,
                    cssSourceMap: true,
                    cacheBusting: true,
                    transformToRequire: {
                        video: ['src', 'poster'],
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                }
            },
            {
                test: /\.tpl.html$/,
                loader: 'raw-loader'
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]?[hash]',
                        outputPath: 'fonts/',    // where the fonts will go
                        publicPath: '../'       // override the default path
                    }
                }]
            },
            {
                test: /\.(scss|css)$/,
                loader: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                                minimize: true
                            }
                        }, {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                                includePaths: [
                                    'node_modules/foundation-sites/scss',
                                    'node_modules/foundation-sites/scss/util',
                                    'node_modules/foundation-sites/_vendor',
                                    'node_modules/font-awesome-sass/assets/stylesheets/font-awesome'
                                ]
                            }
                        }]
                })
            }]
    },
    resolve: {
        extensions: ['.ts', '.js', '.html', '.json', '.scss'],
        alias:
            {
                'vue$': 'vue/dist/vue.esm.js',
                '@shared': path.resolve(__dirname, '../../shared')
            }
    },
    performance: {
        hints: false
    }
};
