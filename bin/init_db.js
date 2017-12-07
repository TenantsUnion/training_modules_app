import {postgresClient, tuLocalDevClient, getSqlFileAsyncExecutor} from './sql_file_executor';
import {getLogger} from './script_logger';

const logger = getLogger("init_db");

const sqlDirectory = '/resources/init_postgres_db/';

export const run = async () => {
    let tuDevClient = tuLocalDevClient();
    let pgClient = postgresClient();
    try {
        await pgClient.connect();
        logger.log('info', 'Establishing db connection as user: %s', pgClient.user);
        let pgExecutor = await getSqlFileAsyncExecutor(pgClient, sqlDirectory);

        logger.log('info', 'Executing sql statements');
        await pgExecutor('01__create_roles_pg.sql');
        await pgExecutor('02__create_database_pg.sql', true);
        await pgExecutor('03__create_dev_user.pg.sql');

        await tuDevClient.connect();
        logger.log('log', 'Establishing db connection as user: %s', tuDevClient.user);
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
