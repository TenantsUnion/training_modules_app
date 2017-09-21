const fs = require('fs');
const config = require('config');
const path = require('path');
const sqlFs = require('./sql_file_executor');
const getLogger = require('./script_logger');

const logger = getLogger("init_test_db");

const sqlDirectory = '/resources/test_postgres_db/';

let initializationFinished = false;
let wait = () => {
    if (initializationFinished) {
        logger.log('info', 'initialized finished');
    } else {
        logger.log('info', 'waiting to initialize db ');
        setTimeout(wait, 200);
    }
};

setTimeout(wait, 0);
module.exports = (async () => {
    try {
        logger.log('info', 'Establishing db connection as user: %s', sqlFs.postgresCient.user);
        let pgExecutor = await sqlFs.getSqlFileAsyncExecutor(sqlFs.postgresCient, sqlDirectory);

        logger.log('info', 'Initializing database %s', config.get('database.db'));

        logger.log('info', 'Executing sql statements');
        // await pgExecutor('00__drop_test_database_pg.sql');
        await pgExecutor('01__create_roles_pg.sql');

        let testDbExists = await sqlFs.postgresCient.query(
            'SELECT count(*) from pg_database where datname = \'' + sqlFs.tuLocalDevClient.database + '\''
        );
        if (testDbExists.rows[0].count === "0") {
            await pgExecutor('02__create_database_pg.sql', true);
        }
        await pgExecutor('03__create_dev_user.pg.sql');

        logger.log('info', 'Establishing db connection as user: %s', sqlFs.tuLocalDevClient.user);
        let tuDbExecutor = await sqlFs.getSqlFileAsyncExecutor(sqlFs.tuLocalDevClient, sqlDirectory);
        await tuDbExecutor('04__create_schema.pg.sql', true);
    } catch (e) {
        logger.log('error', e);
        throw e;
    }
})().then(() => {
    logger.log('info', 'database initialized successfully');
    initializationFinished = true;
    process.exit(0);
}).catch((e) => {
    logger.log('error', 'failed to initialize database');
    logger.log('error', e);
    initializationFinished = true;
    process.exit(0);
});

