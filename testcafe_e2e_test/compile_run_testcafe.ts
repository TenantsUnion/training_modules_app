import * as path from 'path';
import * as ts from 'typescript';
import * as rimraf from 'rimraf';
import * as fs from 'fs';
import chalk from 'chalk';

const createTestCafe = require('testcafe');
const moduleAlias = require("module-alias");
// Override module path alias set in package.json for running server
// since the directory structure for tests doesn't match.
moduleAlias.addAlias('@shared', __dirname + '/../shared');
moduleAlias.addAlias('@server', __dirname + '/../server/src');
moduleAlias.addAlias('@course', __dirname + '/../server/src/course');
moduleAlias.addAlias('@module', __dirname + '/../server/src/module');
moduleAlias.addAlias('@section', __dirname + '/../server/src/section');
moduleAlias.addAlias('@mochatest', __dirname + '/../mocha_unit_test');


const testTsConfig = require('./tsconfig.json');
let compileTestDir = "./.compiled";


const allTestSpecFiles = (dir, regexMatch) => {
    let files = fs.readdirSync(dir);
    return files.reduce((acc, file) => {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            acc.push(...allTestSpecFiles(dir + '/' + file, regexMatch));
        } else if (file.match(regexMatch)) {
            let testFile = path.resolve(dir, file);
            acc.push(testFile);
        }
        return acc;
    }, [])
};

export const run = async () => {
    // delete old test files
    await new Promise((resolve, reject) => {
        rimraf(compileTestDir, err => {
            if (err) reject(err);
            resolve();
        });
    });
    console.log(chalk.cyan('\tCompiling Typescript files...'));
    let program: ts.Program = ts.createProgram(allTestSpecFiles('./', /\.spec\.ts$/), {
        ...testTsConfig.compilerOptions,
        noEmit: false,
        allowJs: false,
        outDir: compileTestDir,
    });
    program.emit(); // outputs files

    console.log(chalk.cyan('\tCreating testcafe server...'));
    let t = await createTestCafe('localhost', 1337, 1338);

    let tests = allTestSpecFiles(__dirname + '/.compiled/testcafe_e2e_test', /\.spec\.js$/);
    try {
        let testsFailed = await t.createRunner()
            .src(tests)
            .browsers(['chrome'])
            .reporter('spec')
            .run({
               // debugMode: true
            });
        console.log(chalk.cyan('\tTests Complete'));
        console.log(testsFailed);
    } catch (e) {
        console.error(chalk.red(`Error executing test cafe runner\n${e}.\n${e.stack}`));
    } finally {
        t.close();
    }
};
