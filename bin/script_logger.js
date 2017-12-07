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


const DEFAULT_LOG_NAME = "run_script.log";

const fileConfig = config.has("log.directory") ? config.get("logDirectory") : "";
const defaultLogNameConfig = config.has("log.default_name") ? config.get("log.default_name") : "";

export const getLogger = (loggerName, fileName) => {
let basicTransportOptions = {
    colorize: true,
    level: 'info',
    timestamp: true,
    prettyPrint: true,
    showLevel: true
};
    let transport = fileConfig ? new winston.transports.File({
            label: loggerName,
            filename: fileConfig + '/' + fileName ? fileName :
                defaultLogNameConfig ? defaultLogNameConfig : DEFAULT_LOG_NAME,
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


