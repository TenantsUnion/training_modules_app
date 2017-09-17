const fs = require('fs');
const path = require('path');
const sqlFs = require('./sql_file_executor');
const logger = require('./script_logger')('drop_db');

const sqlDirectory = '/resources/drop_postgres_db/';


module.exports = (async () => {
    try {
        logger.log('info', 'Establishing db connection with user: %s', sqlFs.postgresCient.user);
        let pgExecutor = await sqlFs.getSqlFileAsyncExecutor(sqlFs.postgresCient, sqlDirectory);
        await pgExecutor('00__drop_database_pg.sql', true);
    } catch (e) {
        throw e;
    }
})()
    .then(() => {
        //todo replace with npm logging library
        logger.log('info', 'Dropped database successfully');
        process.exit(0);
    })
    .catch((e) => {
        logger.log('error', 'Failed to drop database');
        logger.log('error', e);
        process.exit(0);
    });


