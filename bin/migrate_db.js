var postgrator = require('postgrator');
var config = require('config');

    // CREATE ROLE tu_dev_db_user LOGIN PASSWORD 'development_only' VALID UNTIL 'infinity';
postgrator.setConfig({
    migrationDirectory: __dirname + '/../database/migrations',
    driver: 'pg',
    host: 'localhost',
    port: 5432,
    database: 'tu_training',
    username: config.get('database.db_user'),
    password: config.get('database.db_password'),
    schemaTable: 'tu.schemaversion'
});

postgrator.migrate('max', function (err, migrations) {
    if (err) {
        console.log(err);
    }

    postgrator.endConnection(function (err) {
        if (err) {
            console.log('Error closing connection: \n');
            console.log(err);
        }

        console.log('Connection closed');
        process.exit(0);
    });
});