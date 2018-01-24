const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./default.webpack.config');
// Extract style sheets into dedicated file in production
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = merge(baseConfig, {
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new ExtractTextPlugin('style.css', {
            allChunks: true,
            sourceMap: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ],
    module: {
        rules: [{
            test: /\.(scss|css)$/,
            loader: ExtractTextPlugin.extract({
                use: [
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
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
        }],
    },
    devServer: {
        clientLogLevel: 'warning',
        // serve index.html page instead of 404 error to not break html5 history api
        historyApiFallback: true,
        inline: true,
        hot: true,
        host: 'localhost', //replace with comp ip to have server be available on local network
        port: 8080,
        open: true,
        progress: true,
        overlay: true,
        // noInfo: true,
        stats:
            {
                colors: true
            },
        proxy: {
            "**": {
                target: "http://localhost:3000",
                changeOrigin: true,
                secure: false,
                filter:
                    function (pathname, req) {
                        return !pathname.match(/build\.js/);
                    }
            }
        }
    },
// entry: [
//     'webpack-dev-server/client?http://localhost:8080'
// ],
})
;


