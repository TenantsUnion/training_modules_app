import chalk from 'chalk';
import * as path from 'path';
import {createTestCafeServer, runTests} from './compile_run_testcafe';
import {buildWebpack, runServer} from "./compile_run_webapp_server";
const ora = require('ora');

process.env.NODE_CONFIG_DIR = path.resolve(__dirname, '../config');
process.env.NODE_ENV = 'test';

console.log(chalk.cyan(`Executing tests with \nNODE_ENV=${process.env.NODE_ENV}\nNODE_CONFIG_DIR=${process.env.NODE_CONFIG_DIR}`));
const spinner = ora(chalk.cyanBright('building integration tests...'));
spinner.start();
Promise.all([
    buildWebpack().then(() => console.log(chalk.greenBright('\tFinished building webpack'))),
    createTestCafeServer().then((t) => {
        console.log(chalk.greenBright('\tFinished creating TestCafe server'));
        return t;
    }),
    runServer().then(() => console.log(chalk.greenBright('\tFinished initializing app server')))
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
