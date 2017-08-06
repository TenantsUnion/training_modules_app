const winston = require('winston');
const _ = require('underscore');
const config = require('config');

const logLevel = 'info';

var customColors = {
    trace: 'white',
    debug: 'green',
    info: 'blue',
    warn: 'yellow',
    crit: 'red',
    fatal: 'red'
};

const basicTransportOptions = {
    timestamp: true,
    prettyPrint: true,
    showLevel: true
};

const loggerNameToFile = (loggerName) => {
    return 'server.log';
};


const fileConfig = config.has("log.directory");
module.exports = (loggerName) => {
    let transport = fileConfig ? new winston.transports.File({
            label: loggerName,
            level: 'info',
            filename: fileConfig + '/' + loggerNameToFile(loggerName),
            maxsize: 1024 * 1024 * 1024,
            maxFiles: 5,
            zippedArchive: true,
            rotationFormat: 'gz'
        }) :
        new winston.transports.Console({
            label: loggerName,
            colorize: true,
            level: 'info'
        });

    return new winston.Logger({
        transports: [
            transport
        ]
    });
};

