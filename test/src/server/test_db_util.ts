import {LoggerInstance} from "winston";
import {getLogger} from "../../../server/src/log";
import {DatabaseConfig} from '../../../server/src/config/normalize_config';
import {QuillDeltaMap} from '@shared/quill_editor';
import {Delta} from '@shared/normalize_imports';
import {postgresDb} from '../../../server/src/datasource';

/**
 * Helper class for tests to check if the test db has been setup, initialized the test db, and clear the test db
 */
let logger: LoggerInstance = getLogger("ClearDbUtil", "error");


let {database} = DatabaseConfig;
// don't run unless test is in database name of config
if (!database.includes("test")) {
    logger.log("error", `not running against test database, db name: ${database}`);
    throw 'Not running against test database';
}

export const databaseInitialized: () => Promise<boolean> = async () => {
    let results = await postgresDb.query(`EXISTS (select datname from pg_catalog.pg_database where datname = ${database})`);
    logger.info(`Database initialized check results: ${JSON.stringify(results)}`);
    return results[0].rows;
};

export const clearData = async (): Promise<void> => {
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
    logger.log('info', 'successfully truncated tables');
};

export const quillDBTableToQuillMap = async (): Promise<QuillDeltaMap> => {
  let quillRows = await postgresDb.query(`select id, editor_json from tu.quill_data`);
  return quillRows.reduce((acc, row) => {
      acc[row.id] = new Delta(row.editorJson.ops);
      return acc;
  }, {});
};
