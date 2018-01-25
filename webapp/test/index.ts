import Vue from 'vue'

/**
 * Webpack entry point for Karma unit tests
 */
Vue.config.productionTip = false;

// require all test files (files that ends with .spec.js)
const testsContext = (<any>require).context('.', true, /\.spec\.ts$/);
testsContext.keys().forEach(testsContext);

// // require all src files except app entry point and d.ts (no output) for test coverage analysis
// // (?!.+\.d)
// const srcContext = require.context('../src/app', true, /(^\.\/?!(app|.+\.d\.ts))\.ts/);
// srcContext.keys().forEach(srcContext);

