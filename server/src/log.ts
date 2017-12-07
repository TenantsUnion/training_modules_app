import {LoggerInstance} from 'winston';
import * as winston from 'winston';
import config from 'config';

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
    levels: LOG_LEVEL_VALUES,
    colors: LOG_COLORS
};

export const getLogger = (loggerName: string, level?: string & keyof LogLevels, loggerFile?: string): LoggerInstance => {
    const fileConfig = config.has("log.directory");
    let transport = fileConfig ? new winston.transports.File({
            label: loggerName,
            level: level ? level : LOG_LEVELS.info,
            filename: fileConfig + '/' + loggerFile ? loggerFile : 'server.log',
            maxsize: 1024 * 1024 * 1024,
            maxFiles: 5,
            zippedArchive: true,
            rotationFormat: 'gz',
            ...basicTransportOptions
        }) :
        new winston.transports.Console({
            label: loggerName,
            level: level ? level : LOG_LEVELS.info,
            ...basicTransportOptions
        });

    return new winston.Logger({
        transports: [
            transport
        ]
    });
};


