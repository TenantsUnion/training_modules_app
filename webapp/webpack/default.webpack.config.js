/**
 * Using typescript setup from from https://github.com/ducksoupdev/vue-webpack-typescript/blob/master/template/webpack.config.js
 */

var path = require('path');
var webpack = require('webpack');
var config = require('config');

// Extract style sheets into dedicated file in production
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    esModule: true,
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
            {// match ts and tsx files from vue output
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
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
                        //     {
                        //     loader: "postcss-loader", options: {
                        //         config: {
                        //             ctx: {
                        //                 autoprefixer: {browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']}
                        //             }
                        //         }
                        //     }
                        // },
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
