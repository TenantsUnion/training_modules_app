import winston from 'winston';
import config from 'config';

const logLevel = 'info';

var customColors = {
    trace: 'white',
    debug: 'green',
    info: 'blue',
    warn: 'yellow',
    crit: 'red',
    fatal: 'red'
};


export const getLogger = (loggerName, fileName) => {
    let basicTransportOptions = {
        colorize: true,
        level: 'info',
        timestamp: true,
        prettyPrint: true,
        showLevel: true
    };
    fileName = fileName ? fileName : process.env.SCRIPT_NAME;
    loggerName = loggerName ? loggerName : process.env.SCRIPT_NAME;
    let transport = config.get("log.fileLogging") ? new winston.transports.File({
            label: loggerName,
            filename: `${new Date().toISOString()}-${fileName}`,
            maxsize: 1024 * 1024 * 1024,
            maxFiles: 5,
            zippedArchive: true,
            rotationFormat: 'gz',
            ...basicTransportOptions
        }) :
        new winston.transports.Console({
            label: loggerName,
            ...basicTransportOptions
        });

    return new winston.Logger({
        transports: [
            transport
        ]
    });
};


