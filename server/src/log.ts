import {LoggerInstance, addColors, transports, Logger, setLevels} from 'winston';
import {LogConfig} from './config/normalize_config';

export const LOG_COLORS: {[index in keyof LogLevels]: string} = {
    emerg: 'red',
    alert: 'red',
    crit: 'red',
    error: 'red',
    warning: 'yellow',
    notice: 'yellow',
    info: 'blue',
    debug: 'blue'
};

export type LogLevels = {
    emerg: any,
    alert: any,
    crit: any,
    error: any,
    warning: any,
    notice: any,
    info: any,
    debug: any
}

export const LOG_LEVELS: {[index in keyof LogLevels]: keyof LogLevels} = {
    emerg: 'emerg',
    alert: 'alert',
    crit: 'crit',
    error: 'error',
    warning: 'warning',
    notice: 'notice',
    info: 'info',
    debug: 'debug'
};


/**
 * Log levels defined in order of importance low to high. Config follows rfc5424 syslog definitions
 * {@link https://tools.ietf.org/html/rfc5424}
 */
export const LOG_LEVEL_VALUES: {[index in keyof LogLevels]: number} = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7
};

const basicTransportOptions = {
    timestamp: true,
    prettyPrint: true,
    showLevel: true,
    colorize: true,
};

setLevels(LOG_LEVEL_VALUES);
addColors(LOG_COLORS);
export const getLogger = (loggerName: string, level?: string & keyof LogLevels, loggerFile?: string): LoggerInstance => {
    let transport = LogConfig.fileLogging ? new transports.File({
            label: loggerName,
            level: LogConfig.useConfigLevel ? LogConfig.level : level,
            filename: LogConfig.directory + '/' + (loggerFile ? loggerFile : 'server.log'),
            maxsize: 1024 * 1024 * 1024,
            maxFiles: 5,
            zippedArchive: true,
            rotationFormat: 'gz',
            ...basicTransportOptions
        }) :
        new transports.Console({
            label: loggerName,
            level: LogConfig.useConfigLevel || !level ? LogConfig.level : level,
            ...basicTransportOptions
        });

    return new Logger({
        levels: LOG_LEVEL_VALUES,
        transports: [
            transport
        ]
    });
};


