import config from 'config';

// ts-node environment doesn't yet support integration with @std/esm es6 modules node functionality so sythenticDefaultImports are not
// supported. The above import statement has config as undefined when run with ts-node

if (!config) {
    var config = require('config');
}

export const DatabaseConfig = {
    user: config.get("database.db_user"),
    password: config.get("database.db_password"),
    host: config.get("database.db_host"),
    port: config.get("database.db_port"),
    database: config.get("database.db")
};

export const LogConfig = {
    fileLogging: config.get("log.fileLogging"),
    level: config.get("log.level"),
    directory: config.get("log.directory"),
    useConfigLevel: config.get("log.useConfigLevel")
};
