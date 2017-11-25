import config from "config";
import {LoggerInstance} from "winston";
import {getLogger} from "../../../server/src/log";
import {Client} from 'pg';
import {postgresClient, tuLocalDevClient} from "../../../bin/sql_file_executor.js";

/**
 * Helper class for tests to check if the test db has been setup, initialized the test db, and clear the test db
 */
let logger: LoggerInstance = getLogger("ClearDbUtil", "info");
let testDbName: string = config.get("database.db");
let pgClient: Client;
let dbClientsConnected: boolean = false;

(async () => {
    pgClient = await postgresClient();
    dbClientsConnected = true;
})();

// don't run unless test is in database name of config
if (!config.get("database.db").includes("test")) {
    logger.log("error", "not running against test database, db name: %s", config.get('database.db'));
    throw 'Not running against test database';
}

const databaseInitialized: () => Promise<boolean> = async () => {
    let results = await pgClient.query(`EXISTS (select datname from pg_catalog.pg_database where datname = ${testDbName})`);
    // testDb.query()
    logger.info(`Database initialized check results: ${JSON.stringify(results)}`);
    return results[0].rows;
};

const clearData: () => Promise<void> = async () => {
    let dropIfExists = `DROP DATABASE IF EXISTS ${testDbName}`;
    logger.log('info', 'truncating tables');
    await pgClient.query(dropIfExists);
    logger.log('successfully', 'truncated tables');
};
