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

const basicTransportOptions = {
    timestamp: true,
    prettyPrint: true,
    showLevel: true
};

const DEFAULT_LOG_NAME = "run_script.log";

const fileConfig = config.has("log.directory") ? config.get("logDirectory") : "";
const defaultLogNameConfig = config.has("log.default_name") ? config.get("log.default_name") : "";

export const getLogger = (loggerName, fileName) => {
    let transport = fileConfig ? new winston.transports.File({
            label: loggerName,
            level: 'info',
            filename: fileConfig + '/'  + fileName ? fileName :
                defaultLogNameConfig ? defaultLogNameConfig : DEFAULT_LOG_NAME,
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


