const path = require("path");
process.env.NODE_CONFIG_DIR = path.resolve(__dirname, '../config');

require("ts-node").register({
    project: path.resolve(__dirname, "./tsconfig.json"),

});

const tsConfig = require('./tsconfig.json');
require("../bin/module_aliases").registerModuleAliases(__dirname, tsConfig);

module.exports = require('./src/build_runner').run();
