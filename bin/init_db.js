const fs = require('fs');
const config = require('config');
const path = require('path');
const Client = require('pg').Client;
const sqlFs = require('./sql_file_executor');

const sqlDirectory = '/resources/init_postgres_db/';

(async () => {
    try {
        let pgExecutor = await sqlFs.getSqlFileAsyncExecutor(sqlFs.postgresCient, sqlDirectory);
        await pgExecutor('01__create_roles_pg.sql');
        await pgExecutor('02__create_database_pg.sql', true);
        await pgExecutor('03__create_dev_user.pg.sql');
        let tuDbExecutor = await sqlFs.getSqlFileAsyncExecutor(sqlFs.tuLocalDevClient, sqlDirectory);
        await tuDbExecutor('04__create_schema.pg.sql', true);
    } catch (e) {
        throw e;
    }
})().then(() => {
    //todo replace with logger
    console.log('database initialized successfully');
    process.exit(0);
}).catch((e) => {
    console.log('failed to initialize database');
    console.log(e.stack);
    process.exit(0);
});

