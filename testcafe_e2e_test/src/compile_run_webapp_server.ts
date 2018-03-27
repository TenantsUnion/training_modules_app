const http = require('http');
const config = require('config');
const webappTsConfig = require('../../webapp/webpack/testcafe_e2e_test.webpack.config.js');
const rimraf = require('rimraf');
const webpack = require('webpack');
const chalk = require('chalk');

export const buildWebpack = async () => {
    console.log(chalk.cyan('\n\tBuilding webpack...'));
    return await new Promise((resolve, reject) => {
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

                console.log(chalk.greenBright('\tWebapp build complete.\n'));
                resolve();
            });
        });
    });

};
export const runServer = async () => {
    console.log(chalk.cyan('\tInitializing app server...'));
    const app = require('@server/app')();
    app.set('port', config.get('server.port'));
    let server = http.createServer(app);

    return new Promise((resolve, reject) => {
        server.listen(config.get('server.port'));
        server.once('listening', function () {
            console.log(chalk.cyan('Serving listening on ' + server.address().port));
            resolve();
        });
    });
};
