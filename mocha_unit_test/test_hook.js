const path = require('path');
const moduleAlias = require("module-alias");
// Override module path alias set in package.json for running server
// since the directory structure for tests doesn't match.
moduleAlias.addAlias('@shared', __dirname + '/../shared');
moduleAlias.addAlias('@server', __dirname + '/../server/src');
moduleAlias.addAlias('@course', __dirname + '/../server/src/course');
moduleAlias.addAlias('@module', __dirname + '/../server/src/module');
moduleAlias.addAlias('@section', __dirname + '/../server/src/section');

process.env.NODE_ENV = 'test';
// mocha test environment ts-node doesn't support es6 modules yet so modules are compiled to commonjs form
require("ts-node").register({
    project: path.resolve(__dirname, "./tsconfig.json")
});
