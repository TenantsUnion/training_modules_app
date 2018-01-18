const moduleAlias = require("module-alias");
// Override module path alias set in package.json for running server
// since the directory structure for tests doesn't match.
moduleAlias.addAlias('@shared', __dirname + '/../shared');
require("ts-node").register({
    project: "test/tsconfig.json"
});