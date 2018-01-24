var webpackConfig = require('../webpack/test.webpack.config');
// reset entry since path would be wrong and it doesn't apply

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai'],
        files: ['./index.js'],
        plugins: [
            'karma-chai',
            'karma-chrome-launcher',
            'karma-webpack',
            'karma-mocha'
        ],
        preprocessors: {
          './index.js': ['webpack']
        },
        webpack: webpackConfig,
        webpackServer: {noInfo: true},
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Chrome'],
        mime: {
            'text/x-typescript': ['ts']
        },
        singleRun: true
    })
};