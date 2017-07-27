const fs = require('fs');
const path = require('path');
const sqlFs = require('./sql_file_executor');

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
        console.log('dropped database successfully');
        process.exit(0);
    })
    .catch((e) => {
        console.log(e.stack);
        process.exit(0);
    });


