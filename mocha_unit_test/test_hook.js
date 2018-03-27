const {registerModuleAliases} = require("../bin/module_aliases");

const path = require('path');
process.env.NODE_ENV = 'test';
process.env.NODE_CONFIG_DIR = path.resolve(__dirname, '../config');
registerModuleAliases(__dirname, require('./tsconfig.json'));
// mocha test environment ts-node doesn't support es6 modules yet so modules are compiled to commonjs
require("ts-node").register({
    project: path.resolve(__dirname, "./tsconfig.json"),
});
