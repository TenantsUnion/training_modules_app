import {config} from "../../../shared/normalize_imports";

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
