import {getSqlFileAsyncExecutor, postgresClient} from './sql_file_executor';
import {getLogger} from './script_logger';

const logger = getLogger('DropDb');
const sqlDirectory = '/resources/drop_postgres_db/';

(async () => {
    const pgClient = postgresClient();
    try {
        await pgClient.connect();
        logger.log('info', 'Establishing db connection with user: %s', pgClient.user);

        let pgExecutor = await getSqlFileAsyncExecutor(pgClient, sqlDirectory);
        await pgExecutor('00__drop_database_pg.sql', true);
        logger.log('info', 'Dropped database successfully');
    } catch (e) {
        logger.log('error', 'Failed to drop database');
        logger.log('error', e);
        throw e;
    } finally {
        pgClient && pgClient.end();
        process.exit(0);
    }
})();


