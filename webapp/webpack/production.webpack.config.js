const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const defaultConfig = require('./default.webpack.config');
// Extract style sheets into dedicated file in production
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = merge(defaultConfig, {
    devtool: 'source-map',
    rules: [
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
        }
    ],
    // http://vue-loader.vuejs.org/en/workflow/production.html
    plugins: [
        new ExtractTextPlugin('style.css', {
            allChunks: true,
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        //use beta for es6 compatibility
        //https://stackoverflow.com/questions/44287584/how-to-minify-es6-code-using-webpack
        new UglifyJsPlugin({
            sourceMap: true
        }),
    ]
});
