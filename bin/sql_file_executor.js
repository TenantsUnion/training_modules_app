'use strict';
const path = require('path');
const fs = require('fs');
const pg = require('pg');
const config = require('config');
const logger = require('./script_logger')('SQL File Executor');
const Client = pg.Client;
module.exports = {};

module.exports.postgresCient = new Client({
    user: 'postgres',
    password: 'postgres',
    host: config.get("database.db_host"),
    port: config.get("database.db_port"),
    database: 'postgres'
});


module.exports.tuLocalDevClient = new Client({
    user: config.get("database.db_user"),
    password: config.get("database.db_password"),
    host: config.get("database.db_host"),
    port: config.get("database.db_port"),
    database: config.get("database.db")
});

module.exports.getSqlFileAsyncExecutor = async (client, directory) => {
    await client.connect();
    return async (filename, split) => {
        const sqlFileContents = fs.readFileSync(path.resolve(__dirname + directory, filename), 'utf-8');

        logger.log('info', 'Executing sql file: %s', filename);
        return new Promise(async (resolve, reject) => {
            if (split) {
                let statements = sqlFileContents.split(/;\s*$/m);
                for (let statement of statements) {
                    try {
                        let response = await client.query(statement);
                    } catch (e) {
                        logger.log('error', e);
                        reject(e);
                    }
                }
            } else {
                try {
                    await client.query(sqlFileContents);
                } catch (e) {
                    logger.log('error', e);
                    reject(e);
                }
            }
            resolve();
        });
    };
};

