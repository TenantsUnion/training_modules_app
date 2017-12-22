import config from 'config';
import {postgresClient} from './sql_file_executor';
import {getLogger} from './script_logger';

const logger = getLogger('DropDb');
module.exports = async () => {
    const pgClient = postgresClient();
    try {
        await pgClient.connect();
        logger.log('info', 'Establishing db connection with user: %s', pgClient.user);

        logger.log('info', `Dropping database ${config.get('database.db')}`);
        await pgClient.query(`DROP DATABASE IF EXISTS ${config.get('database.db')}`);
        logger.log('info', 'Dropped database successfully');
    } catch (e) {
        logger.log('error', 'Failed to drop database');
        logger.log('error', e);
        throw e;
    } finally {
        pgClient && pgClient.end();
    }
};


