const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./default.webpack.config');
const webpackConfig = merge(baseConfig, {
    // use cheap-module-eval-source-map since chrome launched by karma doesn't pick up source maps when inlined
    // and karma-sourcemap-loader doesn't register them either
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"test"'
            }
        })
    ]
});

// no need for app entry during tests
delete webpackConfig.entry;

module.exports = webpackConfig;
