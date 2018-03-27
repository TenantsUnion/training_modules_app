import chalk from 'chalk';
import {createTestCafeServer, runTests} from './compile_run_testcafe';

// e2e test fixture page will run against live reload webpack dev server on localhost:8080
process.env.NODE_ENV = 'dev';

createTestCafeServer()
    .then((t) => runTests(t, ['chrome']))
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        console.error(chalk.red(`Error creating testcafe server\n${e}\n${e.stack}`));
        process.exit(1);
    });
