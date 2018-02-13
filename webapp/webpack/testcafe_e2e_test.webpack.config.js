const merge = require('webpack-merge');
const baseConfig = require('./default.webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const styleLoaders = require('./style_loaders.conf');

const webpackConfig = merge(baseConfig, {
    devtool: '#eval',
    module: {
        rules: styleLoaders.styleLoaders({sourceMap: false, usePostCSS: false}),
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
        })],

});

module.exports = webpackConfig;
