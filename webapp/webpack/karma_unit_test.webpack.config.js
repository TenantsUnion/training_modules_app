const merge = require('webpack-merge');
const path = require('path');
const baseConfig = require('./default.webpack.config');
const webpackConfig = merge(baseConfig, {
    // chrome launched by karma doesn't pick up source maps when inlined
    devtool: 'inline-source-map',
});

// no need for app entry during tests
delete webpackConfig.entry;

module.exports = webpackConfig;
