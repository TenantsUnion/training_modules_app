/**
 * Using typescript setup from from https://github.com/ducksoupdev/vue-webpack-typescript/blob/master/template/webpack.config.js
 */

var path = require('path');
var webpack = require('webpack');
var config = require('config');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        './src/app/app.ts'
    ],
    context: path.resolve(__dirname),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'build.js'
    },
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
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.html', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
    devServer: {
        historyApiFallback: true,
        quiet: false,
        stats: {
            colors: true
        },
        proxy: {
            "**": {
                target: "http://localhost:3000/",
                changeOrigin: true,
                filter: function(pathname, req){
                    console.log(pathname);
                    !console.log(pathname.match("build.js"));
                    return !pathname.match(/build\.js/);
                }
            }
        }
    }
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}
