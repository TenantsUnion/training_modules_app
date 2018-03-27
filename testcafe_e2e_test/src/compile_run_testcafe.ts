import path from 'path';
import fs from 'fs';

const rimraf = require('rimraf');
const ts = require('typescript');
const chalk = require('chalk');

const createTestCafe = require('testcafe');

const testTsConfig = require('../tsconfig.json');
let compileTestDir = path.resolve(__dirname, "../.compiled");

const allTestSpecFiles = (dir, regexMatch) => {
    let files = fs.readdirSync(dir);
    return files.reduce((acc, file) => {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            acc.push(...allTestSpecFiles(dir + '/' + file, regexMatch));
        } else if (file.match(regexMatch)) {
            let testFile = path.resolve(dir, file);
            acc.push(testFile)
        }
        return acc;
    }, [])
};

export const compileTests = async () => {
    console.log(chalk.cyan('Compiling Typescript files...'));
    // delete old test files
    await new Promise((resolve, reject) => {
        rimraf(compileTestDir, err => {
            if (err) reject(err);
            resolve();
        });
    });
    let program = ts.createProgram(allTestSpecFiles('./', /\.spec\.ts$/), {
        ...testTsConfig.compilerOptions,
        module: ts.ModuleKind.ES2015,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        noEmit: false,
        outDir: compileTestDir
    });
    program.emit(); // outputs files
};

export const runTests = async (t, browsers) => {
    let tests = allTestSpecFiles(__dirname + '/../.compiled', /\.spec\.js$/);
    try {
        console.log('Initializing test runner...');
        let testsFailed = await t.createRunner()
            .src(tests)
            .browsers(browsers)
            .concurrency(3)
            .reporter('spec')
            .run({
                // debugMode: true
            });
        console.log(chalk.cyan('Tests Complete'));
        console.log(testsFailed);
    } catch (e) {
        console.error(chalk.red(`Error executing test cafe runner\n${e}.\n${e.stack}`));
    } finally {
        t.close();
    }
};

export const createTestCafeServer = async () => {
    console.log(chalk.cyan('Creating testcafe server...'));
    return createTestCafe('localhost', 1337, 1338);
};
