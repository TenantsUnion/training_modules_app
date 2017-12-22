import {tuLocalDevClient, postgresClient, getSqlFileAsyncExecutor} from './sql_file_executor';
import {getLogger} from './script_logger';
import config from 'config';

const logger = getLogger("init_test_db");
const sqlDirectory = '/resources/test_postgres_db/';

module.exports = async () => {
    const tuDevClient = tuLocalDevClient();
    const pgClient = postgresClient();
    try {
        await pgClient.connect();
        logger.log('info', 'Establishing db connection as user: %s', pgClient.user);
        let pgExecutor = await getSqlFileAsyncExecutor(pgClient, sqlDirectory);

        logger.log('info', 'Initializing database %s', config.get('database.db'));

        logger.log('info', 'Executing sql statements');
        await pgExecutor('01__create_roles_pg.sql');

        let testDbExists = await pgClient.query(
            `SELECT count(*) from pg_database where datname = '${config.get("database.db")}';`
        );
        if (testDbExists.rows[0].count === "0") {
            await pgExecutor('02__create_database_pg.sql', true);
        }
        await pgExecutor('03__create_dev_user.pg.sql');

        await tuDevClient.connect();
        logger.log('info', 'Establishing db connection as user: %s', tuDevClient.user);
        let tuDbExecutor = await getSqlFileAsyncExecutor(tuDevClient, sqlDirectory);
        await tuDbExecutor('04__create_schema.pg.sql', true);
        logger.log('info', 'database initialized successfully');
    } catch (e) {
        logger.log('error', 'failed to initialize database');
        logger.log('error', e);
        throw e;
    } finally {
        pgClient && pgClient.end();
        tuDevClient && tuDevClient.end();
    }
};
