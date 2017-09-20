import * as config from "config";
import {LoggerInstance} from "winston";
import {getLogger} from "../../../server/src/log";

import {Client} from 'pg';

const sqlFs = require("../../../bin/sql_file_executor");


export class ClearDbUtil {
    connected: Promise<void>;
    logger: LoggerInstance = getLogger("ClearDbUtil", "info");
    sqlFileTemplate: Promise<(fsName: string) => any>;

    constructor(testDb, private truncateDbSqlFile: string) {
        // don't run unless test is in database name of config
        if (!config.get("database.db").includes("test")) {
            this.logger.log("error", "not running against test database, db name: %s", config.get('database.db'));
            throw 'Not running against test database';
        }

        this.sqlFileTemplate = sqlFs.getSqlFileAsyncExecutor(testDb, '');
    }

    async clearData(): Promise<any> {
        return (async () => {
            let template = await this.sqlFileTemplate;
            this.logger.log('info', 'truncating tables');
            template(this.truncateDbSqlFile);
            this.logger.log('successfully', 'truncated tables');
        })();
    }
}


export const clearDbUtil = new ClearDbUtil(new Client({
    user: config.get("database.db_user"),
    password: config.get("database.db_password"),
    host: config.get("database.db_host"),
    port: config.get("database.db_port"),
    database: config.get("database.db")
}), 'resources/test_postgres_db/00__truncate_tables_pg.sql');
