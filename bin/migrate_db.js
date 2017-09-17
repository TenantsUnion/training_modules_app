var postgrator = require('postgrator');
var config = require('config');
var logger = require('./script_logger')('migrate_db');

console.log(process.env.NODE_ENV);
postgrator.setConfig({
    migrationDirectory: __dirname + '/../database/migrations',
    driver: 'pg',
    host: 'localhost',
    port: 5432,
    database: config.get('database.db'),
    username: config.get('database.db_user'),
    password: config.get('database.db_password'),
    schemaTable: config.get('database.schemaVersion')
});

logger.log('info', 'Migrating tu_training database');
postgrator.migrate('max', function (err, migrations) {
    if (err) {
        logger.log('error', err);
    } else {
        logger.log('info', 'Database migrated successfully');
    }

    postgrator.endConnection(function (err) {
        if (err) {
            logger.log('error', 'Error closing connection: \n');
            logger.log('error', err);
        }

        logger.log('info', 'Connection closed');
        process.exit(0);
    });
});