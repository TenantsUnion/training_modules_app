import {LoggerInstance} from "winston";
import {getLogger} from "../../../server/src/log";
import {DatabaseConfig} from '../../../server/src/config/normalize_config';
import {postgresDb} from '../../../server/src/config/repository_config';

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
    let results = await postgresDb.query(`EXISTS (select datname from pg_catalog.pg_database where datname = ${database})`);
    // testDb.query()
    logger.info(`Database initialized check results: ${JSON.stringify(results)}`);
    return results[0].rows;
};

export const clearData: () => Promise<void> = async () => {
    logger.log('info', 'truncating tables');
    await postgresDb.query(`
        truncate table tu.account CASCADE;
        truncate table tu.user_content CASCADE;
        truncate table tu.course CASCADE;
        truncate table tu.module CASCADE;
        truncate table tu.permission CASCADE;
        truncate table tu.question CASCADE;
        truncate table tu.question_option CASCADE;
        truncate table tu.quill_data CASCADE;
        truncate table tu.section CASCADE;
        truncate table tu.user CASCADE;
        truncate table tu.user_course_progress CASCADE;
        truncate table tu.user_permissions CASCADE;
    `);
    logger.log('successfully', 'truncated tables');
};
