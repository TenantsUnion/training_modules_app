var webpackConfig = require('../webpack/test.webpack.config');
// reset entry since path would be wrong and it doesn't apply

module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'chai'],
        files: ['test/index.ts',
            {
                pattern: './src/app/**/*',
                watched: false,
                included: false,
                served: true
            },
            {
                pattern: './test/**/*',
                watched: false,
                included: false,
                served: true
            },
            {
                pattern: './dist/**/*',
                watched: false,
                included: false,
                served: true
            }
        ],
        mochaReporter: {
            showDiff: true,
        },
        reporters: ['mocha'],
        preprocessors: {
            'test/index.ts': ['webpack']
        },
        webpack: webpackConfig,
        webpackServer: {noInfo: true},
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        mime: {
            'text/x-typescript': ['ts']
        },
        // optional middleware that blocks tests from running until code
        // recompiles
        beforeMiddleware: [
            'webpackBlocker'
        ],
        // singleRun: true
    });
};
