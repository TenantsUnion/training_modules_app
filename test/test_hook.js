const path = require('path');
const moduleAlias = require("module-alias");
// Override module path alias set in package.json for running server
// since the directory structure for tests doesn't match.
moduleAlias.addAlias('@shared', __dirname + '/../shared');

process.env.NODE_ENV = 'test';
require("ts-node").register({
    project: path.resolve(__dirname, "./tsconfig.json")
});
