import {LoggerInstance} from "winston";
import {getLogger} from "../../../server/src/log";
import {postgresClient} from "../../../bin/sql_file_executor.js";
import {DatabaseConfig} from '../../../server/src/config/normalize_config';

/**
 * Helper class for tests to check if the test db has been setup, initialized the test db, and clear the test db
 */
let logger: LoggerInstance = getLogger("ClearDbUtil", "info");


let {database} = DatabaseConfig;
// don't run unless test is in database name of config
if (!database.includes("test")) {
    logger.log("error", `not running against test database, db name: ${database}`);
    throw 'Not running against test database';
}

export const databaseInitialized: () => Promise<boolean> = async () => {
    let pgClient = postgresClient();
    await pgClient.connect();
    let results = await pgClient.query(`EXISTS (select datname from pg_catalog.pg_database where datname = ${database})`);
    // testDb.query()
    logger.info(`Database initialized check results: ${JSON.stringify(results)}`);
    pgClient.end();
    return results[0].rows;
};

export const clearData: () => Promise<void> = async () => {
    let pgClient = postgresClient();
    await pgClient.connect();
    let dropIfExists = `DROP DATABASE IF EXISTS ${database}`;
    logger.log('info', 'truncating tables');
    await pgClient.query(dropIfExists);
    logger.log('successfully', 'truncated tables');
    pgClient.end();
};
