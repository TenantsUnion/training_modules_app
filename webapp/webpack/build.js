const path = require('path');

process.env.NODE_CONFIG_DIR = path.resolve(__dirname, '../../config');
process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const rimraf = require('rimraf');
const ora = require('ora');
const config = require('config');
const webpackConf = require('./production.webpack.config');
const chalk = require('chalk');


const spinner = ora('building for production...');
spinner.start();

rimraf(config.get('webapp.dist'), err => {
    if (err) throw err;
    webpack(webpackConf, (err, stats) => {
        spinner.stop();
        if (err) throw err;
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: true,
            chunks: false,
            chunkModules: false
        }) + '\n\n');

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors. \n'));
            process.exit(1);
        }

        console.log(chalk.cyan('    Build complete.\n'));
    });
});


