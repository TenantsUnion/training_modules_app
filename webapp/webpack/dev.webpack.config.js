const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./default.webpack.config');

module.exports = merge(baseConfig, {
    devtool: 'cheap-module-eval-source-map',

    devServer: {
        clientLogLevel: 'warning',
        // serve index.html page instead of 404 error to not break html5 history api
        historyApiFallback: true,
        hot: true,
        host: 'localhost', //replace with comp ip to have server be available on local network
        port: 8080,
        open: true,
        progress: true,
        inline: true,
        overlay: true,
        // noInfo: true,
        stats:
            {
                colors: true
            }
        ,
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
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
    ],
    // entry: [
    //     'webpack-dev-server/client?http://localhost:8080'
    // ],
});


