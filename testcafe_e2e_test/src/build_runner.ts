process.env.NODE_ENV = 'test';

const chalk = require('chalk');
const ora = require('ora');
import {compileTests, createTestCafeServer, runTests} from './compile_run_testcafe';
import {buildWebpack, runServer} from "./compile_run_webapp_server";

export const run = async () => {
    console.log(chalk.cyan(`Executing tests with \nNODE_ENV=${process.env.NODE_ENV}\nNODE_CONFIG_DIR=${process.env.NODE_CONFIG_DIR}`));
    const spinner = ora(chalk.cyanBright('building integration tests...'));
    spinner.start();
    try {

        let {0: testCafeServer} = await Promise.all([
            createTestCafeServer().then((t) => {
                console.log(chalk.greenBright('\tFinished creating TestCafe server'));
                return t;
            }),
            buildWebpack().then(() => console.log(chalk.greenBright('\tFinished building webpack'))),
            runServer().then(() => console.log(chalk.greenBright('\tFinished initializing app server'))),
            compileTests().then(() => console.log(chalk.greenBright('\tFinished initializing app server')))
        ]);
        spinner.stop();
        await runTests(testCafeServer, ['chrome:headless']);
        console.log(chalk.cyan('Tests finished.\nExiting...'));
        process.exit(0);
    } catch (e) {
        console.error(chalk.red(`Error creating testcafe server\n${e}\n${e.stack}\nExiting...`));
        process.exit(1);
    }
};
