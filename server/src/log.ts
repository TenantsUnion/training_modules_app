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

const fileConfig = config.has("log.directory");
export const getLogger = (loggerName:string, level:string, loggerFile?:string) => {
    let transport = fileConfig ? new winston.transports.File({
            label: loggerName,
            level: level,
            filename: fileConfig + '/' + loggerFile ? loggerFile : 'server.log',
            maxsize: 1024 * 1024 * 1024,
            maxFiles: 5,
            zippedArchive: true,
            rotationFormat: 'gz'
        }) :
        new winston.transports.Console({
            label: loggerName,
            colorize: true,
            level: level
        });

    return new winston.Logger({
        transports: [
            transport
        ]
    });
};


