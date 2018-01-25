/**
 * Can kick off Karma tests programatically using Node. Useful for debugging or if Karma-cli is not available.
 */
const path = require('path');
const Server = require('karma').Server;

const server = new Server({
    configFile: path.resolve(__dirname, './karma.unit.js')
}, function (exitCode) {
    console.log('Karma has exited with ' + exitCode)
    process.exit(exitCode)
});
server.start();