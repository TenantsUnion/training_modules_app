const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const defaultConfig = require('./default.webpack.config');

module.exports = merge(defaultConfig, {
    devtool: 'source-map',
    // http://vue-loader.vuejs.org/en/workflow/production.html
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        //use beta for ex6 compatibility
        //https://stackoverflow.com/questions/44287584/how-to-minify-es6-code-using-webpack
        new UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        })
    ]
});
