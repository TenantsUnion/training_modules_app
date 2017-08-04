const fs = require('fs');
const path = require('path');
const sqlFs = require('./sql_file_executor');
const logger = require('./script_logger')('Drop Database');

const sqlDirectory = '/resources/drop_postgres_db/';


(async () => {
    let pgExecutor = await sqlFs.getSqlFileAsyncExecutor(sqlFs.postgresCient, sqlDirectory, true);
    try {

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
        logger.log('error', 'Error while dropping database');
        process.exit(0);
    });


