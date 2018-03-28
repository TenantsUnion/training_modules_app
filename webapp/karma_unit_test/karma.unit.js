const path = require('path');
const webpackConfig = require('../webpack/karma_unit_test.webpack.config');
process.env.NODE_CONFIG_DIR = path.resolve(__dirname, '../../config');
process.env.NODE_ENV = 'test';

module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['mocha'],
        plugins: [
            require('karma-mocha'),
            require('karma-webpack'),
            require('karma-chrome-launcher'),
            require('karma-mocha-reporter')
        ],
        files: ['karma_unit_test/src/index.ts',
            {
                pattern: './src/**/*',
                watched: false,
                included: false,
                served: true
            },
            {
                pattern: './karma_unit_test/src/**/*.ts',
                watched: false,
                included: false,
                served: true
            }
        ],
        mochaReporter: {
            showDiff: true

        },
        reporters: ['mocha'],
        preprocessors: {
            'karma_unit_test/src/index.ts': ['webpack']
        },
        webpack: webpackConfig,
        webpackServer: {noInfo: true},
        port: 9876,
        autoWatch: true,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadlessNoSandbox'],
        // browsers: ['ChromeHeadlessNoSandbox'],
        // for running in container environments like travis-ci where there is no sandbox available
        // https://docs.travis-ci.com/user/chrome#Sandboxing
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        mime: {
            'text/x-typescript': ['ts']
        },
        // optional middleware that blocks tests from running until code
        // recompiles
        beforeMiddleware: [
            'webpackBlocker'
        ],
        singleRun: false
    });
};
