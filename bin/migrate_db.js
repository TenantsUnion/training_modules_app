import Postgrator from 'postgrator';
import config from 'config';

import {getLogger} from "./script_logger";

let logger = getLogger('migrate_db');

module.exports = async () => {
    let postgrator = new Postgrator({
        migrationDirectory: __dirname + '/../database/migrations',
        driver: 'pg',
        host: 'localhost',
        port: 5432,
        database: config.get('database.db'),
        username: config.get('database.db_user'),
        password: config.get('database.db_password'),
        schemaTable: config.get('database.schemaVersion')
    });

    logger.log('info', 'Migrating %s database', config.get('database.db'));
    return postgrator.migrate('max')
        .then((appliedMigrations) => {
            let appliedMigrationsFileNames = appliedMigrations.map((migration) => {
                return `filename: ${migration.filename}, version: ${migration.version}`;
            });
            if (appliedMigrations.length) {
                logger.log('info', `Applied migrations:\n\t${appliedMigrationsFileNames.join('\n\t')}`);
            } else {
                logger.log('info', 'No migrations applied. Database up to date');
            }
            logger.log('info', 'Database migrated successfully');
        })
        .catch((err) => {
            logger.log('error', err);
            throw err;
        });
};
