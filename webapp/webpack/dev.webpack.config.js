const merge = require('webpack-merge');
const baseConfig = require('./default.webpack.config');

module.exports = merge(baseConfig, {
    devtool: 'eval-source-map',

    devServer: {
        host: 'localhost', //replace with comp ip to have server be available on local network
        historyApiFallback:
            true,
        // noInfo: true,
        stats:
            {
                colors: true
            }
        ,
        proxy: {
            "**":
                {
                    target: "http://localhost:3000/",
                    changeOrigin:
                        true,
                    filter:

                        function (pathname, req) {
                            return !pathname.match(/build\.js/);
                        }
                }
        }
    },
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
    ],
});

