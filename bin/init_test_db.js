const fs = require('fs');
const config = require('config');
const path = require('path');
const sqlFs = require('./sql_file_executor');
const getLogger = require('./script_logger');

const logger = getLogger("init_db");

const sqlDirectory = '/resources/init_postgres_db/';

module.exports = (async () => {
    try {
        logger.log('info', 'Establishing db connection as user: %s', sqlFs.postgresCient.user);
        let pgExecutor = await sqlFs.getSqlFileAsyncExecutor(sqlFs.postgresCient, sqlDirectory);

        logger.log('info', 'Executing sql statements');
        await pgExecutor('01__create_roles_pg.sql');
        await pgExecutor('02__create_database_pg.sql', true);
        await pgExecutor('03__create_dev_user.pg.sql');

        logger.log('log', 'Establishing db connection as user: %s', sqlFs.tuLocalDevClient.user);
        let tuDbExecutor = await sqlFs.getSqlFileAsyncExecutor(sqlFs.tuLocalDevClient, sqlDirectory);
        await tuDbExecutor('04__create_schema.pg.sql', true);
    } catch (e) {
        logger.log('error', e);
        throw e;
    }
})().then(() => {
    logger.log('info', 'database initialized successfully');
    process.exit(0);
}).catch((e) => {
    logger.log('error', 'failed to initialize database');
    logger.log('error', e);
    process.exit(0);
});

