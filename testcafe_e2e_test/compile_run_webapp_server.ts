process.env.NODE_CONFIG_DIR = '../config';
process.env.NODE_ENV = 'test';
const http = require('http');
const config = require('config');
const webappTsConfig = require('../webapp/webpack/testcafe_e2e_test.webpack.config.js');
const rimraf = require('rimraf');
const webpack = require('webpack');
const chalk = require('chalk');

const testTsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');
tsConfigPaths.register({
    baseUrl: './',
    paths: testTsConfig.compilerOptions.paths
});
import {app} from '@server/app';


(async () => {
    await new Promise((resolve, reject) => {
        rimraf(config.get('webapp.dist'), err => {
            if (err) reject(err);
            webpack(webappTsConfig, (err, stats) => {
                if (err) reject(err);
                process.stdout.write(stats.toString({
                    colors: true,
                    modules: false,
                    children: true,
                    chunks: false,
                    chunkModules: false
                }) + '\n\n');

                if (stats.hasErrors()) {
                    console.error(chalk.red('Webapp build failed with errors. \n'));
                    process.exit(1);
                }

                console.log(chalk.cyan('    Webapp build complete.\n'));
                resolve();
            });
        });
    });

    app.set('port', config.get('server.port'));
    let server = http.createServer(app);

    let serverListening = new Promise((resolve, reject) => {
        server.once('listening', function () {
            console.log(chalk.cyan('Serving listening on ' + server.address().port));
            resolve();
        });
    });
    server.listen(config.get('server.port'));

    serverListening.then(() => {
        process.exit(0);
    }).catch((err) => {
        console.error(chalk.red(err.stack));
        console.error(chalk.red(err));
        process.exit(1);
    });
})();
