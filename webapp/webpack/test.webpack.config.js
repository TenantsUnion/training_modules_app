const merge = require('webpack-merge');
const path = require('path');
const baseConfig = require('./default.webpack.config');
const webpackConfig = merge(baseConfig, {
    devtool: '#inline-source-map',
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'raw-loader',
                exclude: ['./src/index.html']
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader'
                },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            includePaths: [
                                path.resolve(__dirname, '../../node_modules/foundation-sites/scss'),
                                path.resolve(__dirname, '../../node_modules/foundation-sites/scss/util'),
                                path.resolve(__dirname, '../../node_modules/foundation-sites/_vendor'),
                                path.resolve(__dirname, '../../node_modules/font-awesome-sass/assets/stylesheets/font-awesome')
                            ]
                        }
                    }
                ]
            }]
    }
});

// no need for app entry during tests
delete webpackConfig.entry;

module.exports = webpackConfig;
