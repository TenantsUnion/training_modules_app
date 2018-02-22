const styleLoaders = require('./style_loaders.conf');
const path = require('path');
const config = require('config');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./default.webpack.config');
// Extract style sheets into dedicated file in production
// var ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(baseConfig, {
    entry: [
        'webpack-dev-server/client?http://localhost:8080'
    ],
    output: {
      publicPath: '/'
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
    ],
    module: {
        rules: styleLoaders.styleLoaders({sourceMap: true, usePostCSS: true}),
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
                        return !pathname.match(/build\.js/) || !pathname.match(/style\.css/);
                    }
            }
        }
    }
});


