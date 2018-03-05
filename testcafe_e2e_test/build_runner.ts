import chalk from 'chalk';
import * as path from 'path';
import {createTestCafeServer, runTests} from './compile_run_testcafe';
import {buildWebpack, runServer} from "./compile_run_webapp_server";
const ora = require('ora');

const moduleAlias = require("module-alias");
// Override module path alias set in package.json for running server
// since the directory structure for tests doesn't match.
moduleAlias.addAlias('@shared', path.resolve(__dirname,  '../shared'));
moduleAlias.addAlias('@server', path.resolve(__dirname, '../server/src'));
moduleAlias.addAlias('@util', path.resolve(__dirname, '../server/src/util'));
moduleAlias.addAlias('@course',path.resolve( __dirname,  '../server/src/course'));
moduleAlias.addAlias('@module',path.resolve( __dirname, '../server/src/module'));
moduleAlias.addAlias('@section', path.resolve(__dirname, '../server/src/section'));
moduleAlias.addAlias('@mochatest', path.resolve(__dirname, '../mocha_unit_test'));
process.env.NODE_CONFIG_DIR = path.resolve(__dirname, '../config');
console.log(`config dir: ${process.env.NODE_CONFIG_DIR}`);
// will run against live reload webpack dev server on localhost:8080
process.env.NODE_ENV = 'test';

console.log(chalk.cyan(`Executing tests in NODE_ENV=${process.env.NODE_ENV}`));
const spinner = ora(chalk.cyanBright('building integration tests...'));
spinner.start();
Promise.all([
    buildWebpack(),
    createTestCafeServer(),
    runServer()
])
    .then(({1: testCafeServer}) => {
        spinner.stop();
        return runTests(testCafeServer)
    })
    .then(() => {
        console.log(chalk.cyan('Process exit'));
        process.exit(0);
    })
    .catch((e) => {
        console.error(chalk.red(`Error creating testcafe server\n${e}\n${e.stack}`));
        process.exit(1);
    });
