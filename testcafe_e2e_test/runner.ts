const createTestCafe = require('testcafe');
const testTsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

process.env.NODE_CONFIG_DIR = path.resolve(__dirname, '../config');
tsConfigPaths.register({
    baseUrl: './',
    paths: testTsConfig.compilerOptions.paths
});

const allTestSpecFiles = (dir): string[] => {
    let files = fs.readdirSync(dir);
    return files.reduce((acc, file) => {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            acc.push(...allTestSpecFiles(dir + '/' + file));
        } else if (/\.spec\.ts$/.test(file)) {
            let testFile = path.resolve(dir, file);
            acc.push(testFile);
        }
        return acc;
    }, [])
};

(async () => {

    console.log(chalk.cyan('\tCreating testcafe server...'));
    let t = await createTestCafe('localhost', 1337, 1338);

    let tests = allTestSpecFiles(__dirname);
    try {
        let testsFailed = await t.createRunner()
            .src(tests)
            .browsers(['chrome'])
            .reporter('spec')
            .run();
        console.log(chalk.cyan('\tTests Complete'));
        console.log(testsFailed);
    } catch (e) {
        console.error(chalk.red(`Error executing test cafe runner\n${e}.\n${e.stack}`));
    } finally {
        t.close();
    }
})().catch((e) => {
    console.error(chalk.red(`Error creating testcafe server\n${e}\n${e.stack}`));
    process.exit(1);
});
