import chalk from 'chalk';
import * as path from 'path';
import {runTests} from './compile_run_testcafe';
import {buildWebpack} from "./compile_run_webapp_server";

process.env.NODE_CONFIG_DIR = path.resolve(__dirname, '../config');
// will run against live reload webpack dev server on localhost:8080
process.env.NODE_ENV = 'test_dev';


buildWebpack()
    .then(runTests)
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        console.error(chalk.red(`Error creating testcafe server\n${e}\n${e.stack}`));
        process.exit(1);
    });
